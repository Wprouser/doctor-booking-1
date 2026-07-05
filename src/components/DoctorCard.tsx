import { Link } from 'react-router-dom'
import type { Doctor } from '../types'
import { StarRating } from './StarRating'

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-4">
        <img
          src={doctor.photoUrl}
          alt={doctor.name}
          className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
        />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900 group-hover:text-teal-600 dark:text-white">
            {doctor.name}
          </h3>
          <p className="text-sm font-medium text-teal-600 dark:text-teal-400">{doctor.specialization}</p>
          <StarRating rating={doctor.rating} reviewCount={doctor.reviewCount} />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
        <span>{doctor.experienceYears} yrs experience</span>
        <span className="truncate">{doctor.location}</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Consultation <span className="font-semibold text-slate-900 dark:text-white">${doctor.consultationFee}</span>
        </span>
        <span className="rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-950 dark:text-teal-300">
          View Profile
        </span>
      </div>
    </Link>
  )
}
