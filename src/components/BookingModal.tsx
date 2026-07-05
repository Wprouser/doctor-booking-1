import { useState, type FormEvent } from 'react'
import type { Doctor } from '../types'
import { Modal } from './Modal'
import { formatDateTime } from '../lib/date'
import { useSession } from '../lib/auth-client'

interface BookingModalProps {
  doctor: Doctor
  slot: string
  onClose: () => void
  onConfirm: (details: { patientName: string; patientPhone: string; reason: string }) => Promise<void>
}

interface FormErrors {
  patientName?: string
  patientPhone?: string
}

export function BookingModal({ doctor, slot, onClose, onConfirm }: BookingModalProps) {
  const { data: session } = useSession()
  const [patientName, setPatientName] = useState(session?.user.name ?? '')
  const [patientPhone, setPatientPhone] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: FormErrors = {}
    if (!patientName.trim()) nextErrors.patientName = 'Please enter your name.'
    if (!patientPhone.trim()) nextErrors.patientPhone = 'Please enter a contact number.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitError(null)
    setSubmitting(true)
    try {
      await onConfirm({ patientName: patientName.trim(), patientPhone: patientPhone.trim(), reason: reason.trim() })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Confirm your appointment" onClose={onClose}>
      <div className="mb-4 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/60">
        <p className="font-medium text-slate-900 dark:text-white">{doctor.name}</p>
        <p className="text-slate-500 dark:text-slate-400">{doctor.specialization}</p>
        <p className="mt-1 text-teal-700 dark:text-teal-400">{formatDateTime(slot)}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="patientName" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Full name
          </label>
          <input
            id="patientName"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g. Jordan Lee"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.patientName && <p className="mt-1 text-sm text-red-500">{errors.patientName}</p>}
        </div>

        <div>
          <label htmlFor="patientPhone" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Contact number
          </label>
          <input
            id="patientPhone"
            type="tel"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="e.g. (555) 123-4567"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          {errors.patientPhone && <p className="mt-1 text-sm text-red-500">{errors.patientPhone}</p>}
        </div>

        <div>
          <label htmlFor="reason" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Reason for visit <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Briefly describe your symptoms or reason for the visit"
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {submitError}
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
