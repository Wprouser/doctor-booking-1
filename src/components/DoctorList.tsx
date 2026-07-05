import type { Doctor } from '../types'
import { DoctorCard } from './DoctorCard'

export function DoctorList({ doctors }: { doctors: Doctor[] }) {
  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">No doctors found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Try a different specialization or search term.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  )
}
