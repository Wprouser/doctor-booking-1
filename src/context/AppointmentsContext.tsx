import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Appointment } from '../types'
import * as api from '../lib/api'
import { useSession } from '../lib/auth-client'

interface BookAppointmentInput {
  doctorId: string
  patientName: string
  patientPhone: string
  reason: string
  slot: string
}

interface AppointmentsContextValue {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  bookAppointment: (input: BookAppointmentInput) => Promise<Appointment>
  cancelAppointment: (id: string) => Promise<void>
}

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null)

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const userId = session?.user.id

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setAppointments([])
      setLoading(false)
      return
    }
    setLoading(true)
    api
      .fetchAppointments()
      .then(setAppointments)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  const value = useMemo<AppointmentsContextValue>(
    () => ({
      appointments,
      loading,
      error,
      bookAppointment: async (input) => {
        const appointment = await api.bookAppointment(input)
        setAppointments((prev) => [...prev, appointment])
        return appointment
      },
      cancelAppointment: async (id) => {
        const appointment = await api.cancelAppointment(id)
        setAppointments((prev) => prev.map((appt) => (appt.id === id ? appointment : appt)))
      },
    }),
    [appointments, loading, error],
  )

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
}

export function useAppointments(): AppointmentsContextValue {
  const ctx = useContext(AppointmentsContext)
  if (!ctx) throw new Error('useAppointments must be used within AppointmentsProvider')
  return ctx
}
