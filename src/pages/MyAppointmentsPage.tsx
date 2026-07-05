import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppointments } from '../context/AppointmentsContext'
import { fetchDoctors } from '../lib/api'
import type { Doctor } from '../types'
import { AppointmentCard } from '../components/AppointmentCard'

type Tab = 'upcoming' | 'past' | 'cancelled'

const TABS: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
]

export function MyAppointmentsPage() {
  const { appointments, loading, error, cancelAppointment } = useAppointments()
  const [tab, setTab] = useState<Tab>('upcoming')
  const [doctorsById, setDoctorsById] = useState<Map<string, Doctor>>(new Map())

  useEffect(() => {
    fetchDoctors({}).then((doctors) => {
      setDoctorsById(new Map(doctors.map((doctor) => [doctor.id, doctor])))
    })
  }, [])

  const grouped = useMemo(() => {
    const now = new Date()
    const upcoming = appointments
      .filter((a) => a.status === 'upcoming' && new Date(a.slot) > now)
      .sort((a, b) => a.slot.localeCompare(b.slot))
    const past = appointments
      .filter((a) => a.status === 'upcoming' && new Date(a.slot) <= now)
      .sort((a, b) => b.slot.localeCompare(a.slot))
    const cancelled = appointments
      .filter((a) => a.status === 'cancelled')
      .sort((a, b) => b.slot.localeCompare(a.slot))
    return { upcoming, past, cancelled }
  }, [appointments])

  const activeAppointments = grouped[tab]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">My Appointments</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your upcoming and past bookings.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === key
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {label} ({grouped[key].length})
            {tab === key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-teal-600" />}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          Couldn&apos;t load appointments: {error}
        </p>
      ) : loading ? (
        <p className="text-slate-500 dark:text-slate-400">Loading appointments…</p>
      ) : activeAppointments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">No {tab} appointments</p>
          {tab === 'upcoming' && (
            <Link to="/" className="rounded-full bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700">
              Find a doctor
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              doctor={doctorsById.get(appointment.doctorId)}
              onCancel={cancelAppointment}
            />
          ))}
        </div>
      )}
    </div>
  )
}
