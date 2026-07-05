import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Appointment, Doctor } from '../types'
import { formatDateTime } from '../lib/date'
import { ConfirmDialog } from './ConfirmDialog'

interface AppointmentCardProps {
  appointment: Appointment
  doctor: Doctor | undefined
  onCancel: (id: string) => Promise<void>
}

export function AppointmentCard({ appointment, doctor, onCancel }: AppointmentCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canCancel = appointment.status === 'upcoming' && new Date(appointment.slot) > new Date()

  async function handleConfirmCancel() {
    setCancelling(true)
    setError(null)
    try {
      await onCancel(appointment.id)
      setShowConfirm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
      <img
        src={doctor?.photoUrl}
        alt={doctor?.name ?? 'Doctor'}
        className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
      />

      <div className="min-w-0 flex-1">
        {doctor ? (
          <Link to={`/doctors/${doctor.id}`} className="font-semibold text-slate-900 hover:text-teal-600 dark:text-white">
            {doctor.name}
          </Link>
        ) : (
          <span className="font-semibold text-slate-900 dark:text-white">Unknown doctor</span>
        )}
        <p className="text-sm text-teal-600 dark:text-teal-400">{doctor?.specialization}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDateTime(appointment.slot)}</p>
        {appointment.reason && (
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Reason: {appointment.reason}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            appointment.status === 'cancelled'
              ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
              : canCancel
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {appointment.status === 'cancelled' ? 'Cancelled' : canCancel ? 'Upcoming' : 'Completed'}
        </span>
        {canCancel && (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
        )}
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Cancel appointment"
          message={`Are you sure you want to cancel your appointment with ${doctor?.name ?? 'this doctor'} on ${formatDateTime(appointment.slot)}?`}
          confirmLabel="Cancel appointment"
          busy={cancelling}
          errorMessage={error}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  )
}
