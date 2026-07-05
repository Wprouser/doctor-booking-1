export type Specialization =
  | 'Cardiology'
  | 'Dermatology'
  | 'Pediatrics'
  | 'Neurology'
  | 'Orthopedics'
  | 'Dentistry'
  | 'General Medicine'
  | 'Psychiatry'
  | 'Ophthalmology'
  | 'Gynecology'

export interface Doctor {
  id: string
  name: string
  specialization: Specialization
  photoUrl: string
  experienceYears: number
  rating: number
  reviewCount: number
  location: string
  consultationFee: number
  bio: string
  education: string[]
  languages: string[]
  availableSlots: string[] // ISO datetime strings
}

export interface Appointment {
  id: string
  doctorId: string
  patientName: string
  patientPhone: string
  reason: string
  slot: string // ISO datetime string
  status: 'upcoming' | 'cancelled'
  createdAt: string
}
