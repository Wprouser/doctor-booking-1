import { Router } from 'express'
import { pool } from '../db.js'
import { generateSlotsForDoctor } from '../lib/slots.js'

export const doctorsRouter = Router()

interface DoctorRow {
  id: string
  name: string
  specialization: string
  experience_years: number
  rating: string
  review_count: number
  location: string
  consultation_fee: number
  bio: string
  education: string[]
  languages: string[]
}

function toDoctorDto(row: DoctorRow) {
  return {
    id: row.id,
    name: row.name,
    specialization: row.specialization,
    experienceYears: row.experience_years,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    location: row.location,
    consultationFee: row.consultation_fee,
    bio: row.bio,
    education: row.education,
    languages: row.languages,
  }
}

// GET /api/doctors?q=&specialization=
doctorsRouter.get('/', async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    const specialization = typeof req.query.specialization === 'string' ? req.query.specialization : ''

    const conditions: string[] = []
    const params: string[] = []

    if (specialization && specialization !== 'All') {
      params.push(specialization)
      conditions.push(`specialization = $${params.length}`)
    }
    if (q) {
      params.push(`%${q}%`)
      conditions.push(`(name ILIKE $${params.length} OR specialization ILIKE $${params.length})`)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await pool.query<DoctorRow>(`SELECT * FROM doctors ${where} ORDER BY name`, params)
    res.json(rows.map(toDoctorDto))
  } catch (err) {
    next(err)
  }
})

// GET /api/doctors/:id
doctorsRouter.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query<DoctorRow>('SELECT * FROM doctors WHERE id = $1', [req.params.id])
    const doctor = rows[0]
    if (!doctor) {
      res.status(404).json({ error: 'Doctor not found' })
      return
    }

    const bookedResult = await pool.query<{ slot: Date }>(
      `SELECT slot FROM appointments WHERE doctor_id = $1 AND status = 'upcoming'`,
      [doctor.id],
    )
    const bookedSlots = new Set(bookedResult.rows.map((row) => row.slot.toISOString()))
    const availableSlots = generateSlotsForDoctor(doctor.id).filter((slot) => !bookedSlots.has(slot))

    res.json({ ...toDoctorDto(doctor), availableSlots })
  } catch (err) {
    next(err)
  }
})
