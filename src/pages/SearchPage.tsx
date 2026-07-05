import { useEffect, useState } from 'react'
import { SPECIALIZATIONS } from '../data/specializations'
import type { Doctor, Specialization } from '../types'
import { fetchDoctors } from '../lib/api'
import { SearchBar } from '../components/SearchBar'
import { SpecializationFilter } from '../components/SpecializationFilter'
import { DoctorList } from '../components/DoctorList'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [specialization, setSpecialization] = useState<Specialization | 'All'>('All')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const timeout = setTimeout(() => {
      fetchDoctors({ q: query, specialization })
        .then((results) => {
          if (!cancelled) setDoctors(results)
        })
        .catch((err: Error) => {
          if (!cancelled) setError(err.message)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [query, specialization])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Find your doctor</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Search and book appointments with trusted doctors near you.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <SearchBar value={query} onChange={setQuery} />
        <SpecializationFilter
          specializations={SPECIALIZATIONS}
          selected={specialization}
          onSelect={setSpecialization}
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          Couldn&apos;t load doctors: {error}
        </p>
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading ? 'Searching…' : `${doctors.length} doctor${doctors.length === 1 ? '' : 's'} found`}
          </p>
          <DoctorList doctors={doctors} />
        </>
      )}
    </div>
  )
}
