import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import type { Doctor } from '../types'
import { fetchDoctor } from '../lib/api'
import { useAppointments } from '../context/AppointmentsContext'
import { useSession } from '../lib/auth-client'
import { StarRating } from '../components/StarRating'
import { SlotPicker } from '../components/SlotPicker'
import { BookingModal } from '../components/BookingModal'
import { formatDateTime } from '../lib/date'

export function DoctorProfilePage() {
  const { doctorId } = useParams<{ doctorId: string }>()
  const location = useLocation()
  const { data: session } = useSession()
  const { appointments, bookAppointment } = useAppointments()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null)

  useEffect(() => {
    if (!doctorId) return
    setLoading(true)
    fetchDoctor(doctorId).then((result) => {
      setDoctor(result)
      setLoading(false)
    })
  }, [doctorId])

  const bookedSlots = useMemo(() => {
    if (!doctor) return new Set<string>()
    return new Set(
      appointments
        .filter((appt) => appt.doctorId === doctor.id && appt.status === 'upcoming')
        .map((appt) => appt.slot),
    )
  }, [appointments, doctor])

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Loading doctor…</p>
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Doctor not found</h1>
        <Link to="/" className="rounded-full bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700">
          Back to search
        </Link>
      </div>
    )
  }

  async function handleConfirm(details: { patientName: string; patientPhone: string; reason: string }) {
    if (!selectedSlot || !doctor) return
    await bookAppointment({
      doctorId: doctor.id,
      slot: selectedSlot,
      ...details,
    })
    setConfirmedSlot(selectedSlot)
    setShowBookingModal(false)
    setSelectedSlot(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400">
        ← Back to search
      </Link>

      {confirmedSlot && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-200">
          <span>
            Appointment confirmed for <strong>{formatDateTime(confirmedSlot)}</strong>.
          </span>
          <Link to="/appointments" className="shrink-0 font-medium underline">
            View appointments
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 sm:flex-row">
              <img
                src={doctor.photoUrl}
                alt={doctor.name}
                className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              />
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
                  {doctor.name}
                </h1>
                <p className="font-medium text-teal-600 dark:text-teal-400">{doctor.specialization}</p>
                <div className="mt-1">
                  <StarRating rating={doctor.rating} reviewCount={doctor.reviewCount} />
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {doctor.experienceYears} years experience &middot; {doctor.location}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{doctor.bio}</p>

            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2 dark:border-slate-800">
              <div>
                <h3 className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Education</h3>
                <ul className="list-inside list-disc text-slate-500 dark:text-slate-400">
                  {doctor.education.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-700 dark:text-slate-200">Languages</h3>
                <p className="text-slate-500 dark:text-slate-400">{doctor.languages.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Book an appointment</h2>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                ${doctor.consultationFee}
              </span>
            </div>
            <SlotPicker
              slots={doctor.availableSlots}
              bookedSlots={bookedSlots}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
            />
            {session ? (
              <button
                type="button"
                disabled={!selectedSlot}
                onClick={() => setShowBookingModal(true)}
                className="mt-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              >
                {selectedSlot ? 'Book Appointment' : 'Select a time slot'}
              </button>
            ) : (
              <Link
                to="/sign-in"
                state={{ from: location.pathname }}
                className="mt-2 rounded-full bg-teal-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                Sign in to book
              </Link>
            )}
          </div>
        </div>
      </div>

      {showBookingModal && selectedSlot && (
        <BookingModal
          doctor={doctor}
          slot={selectedSlot}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
