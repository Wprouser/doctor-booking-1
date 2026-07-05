import type { Appointment, Doctor, Specialization } from '../types'
import { avatarDataUri } from './avatar'

export type DoctorSummary = Omit<Doctor, 'photoUrl' | 'availableSlots'>
export type DoctorDetail = Omit<Doctor, 'photoUrl'>

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed with status ${res.status}`)
  }
  return res.json()
}

function withPhoto<T extends { name: string }>(doctor: T): T & { photoUrl: string } {
  return { ...doctor, photoUrl: avatarDataUri(doctor.name) }
}

export async function fetchDoctors(params: { q?: string; specialization?: Specialization | 'All' }): Promise<Doctor[]> {
  const search = new URLSearchParams()
  if (params.q) search.set('q', params.q)
  if (params.specialization && params.specialization !== 'All') search.set('specialization', params.specialization)

  const query = search.toString()
  const doctors = await request<DoctorSummary[]>(`/api/doctors${query ? `?${query}` : ''}`)
  return doctors.map((doctor) => withPhoto({ ...doctor, availableSlots: [] }))
}

export async function fetchDoctor(id: string): Promise<Doctor | null> {
  try {
    const doctor = await request<DoctorDetail>(`/api/doctors/${id}`)
    return withPhoto(doctor)
  } catch {
    return null
  }
}

export async function fetchAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>('/api/appointments')
}

export interface BookAppointmentInput {
  doctorId: string
  slot: string
  patientName: string
  patientPhone: string
  reason: string
}

export async function bookAppointment(input: BookAppointmentInput): Promise<Appointment> {
  return request<Appointment>('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  return request<Appointment>(`/api/appointments/${id}/cancel`, {
    method: 'PATCH',
  })
}
