import { Router, type NextFunction, type Request, type Response } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { pool } from '../db.js'
import { auth } from '../auth.js'

export const appointmentsRouter = Router()

interface AppointmentRow {
  id: string
  doctor_id: string
  slot: Date
  reason: string
  status: 'upcoming' | 'cancelled'
  created_at: Date
  patient_name: string
  patient_phone: string
  user_id: string
}

function toAppointmentDto(row: AppointmentRow) {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    patientName: row.patient_name,
    patientPhone: row.patient_phone,
    reason: row.reason,
    slot: row.slot.toISOString(),
    status: row.status,
    createdAt: row.created_at.toISOString(),
  }
}

const APPOINTMENT_SELECT = `
  SELECT id, doctor_id, slot, reason, status, created_at, patient_name, patient_phone, user_id
  FROM appointments
`

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
  }
}

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) {
    res.status(401).json({ error: 'You must be signed in.' })
    return
  }
  req.userId = session.user.id
  next()
}

appointmentsRouter.use(requireAuth)

// GET /api/appointments
appointmentsRouter.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query<AppointmentRow>(
      `${APPOINTMENT_SELECT} WHERE user_id = $1 ORDER BY slot DESC`,
      [req.userId],
    )
    res.json(rows.map(toAppointmentDto))
  } catch (err) {
    next(err)
  }
})

// POST /api/appointments
appointmentsRouter.post('/', async (req, res, next) => {
  try {
    const { doctorId, slot, patientName, patientPhone, reason } = req.body ?? {}

    if (!doctorId || !slot || !patientName || !patientPhone) {
      res.status(400).json({ error: 'doctorId, slot, patientName and patientPhone are required' })
      return
    }

    const { rows } = await pool.query<{ id: string }>(
      `INSERT INTO appointments (doctor_id, user_id, patient_name, patient_phone, slot, reason)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [doctorId, req.userId, patientName, patientPhone, slot, reason ?? ''],
    )

    const result = await pool.query<AppointmentRow>(`${APPOINTMENT_SELECT} WHERE id = $1`, [rows[0].id])
    res.status(201).json(toAppointmentDto(result.rows[0]))
  } catch (err) {
    if (isUniqueViolation(err)) {
      res.status(409).json({ error: 'That time slot has just been booked. Please choose another.' })
      return
    }
    next(err)
  }
})

// PATCH /api/appointments/:id/cancel
appointmentsRouter.patch('/:id/cancel', async (req, res, next) => {
  try {
    const { rows } = await pool.query<AppointmentRow>(
      `UPDATE appointments SET status = 'cancelled'
       WHERE id = $1 AND user_id = $2
       RETURNING id, doctor_id, slot, reason, status, created_at, patient_name, patient_phone, user_id`,
      [req.params.id, req.userId],
    )

    const appointment = rows[0]
    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' })
      return
    }

    res.json(toAppointmentDto(appointment))
  } catch (err) {
    next(err)
  }
})

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505'
}
