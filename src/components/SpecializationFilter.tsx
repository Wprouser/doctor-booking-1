import type { Specialization } from '../types'

interface SpecializationFilterProps {
  specializations: Specialization[]
  selected: Specialization | 'All'
  onSelect: (value: Specialization | 'All') => void
}

export function SpecializationFilter({ specializations, selected, onSelect }: SpecializationFilterProps) {
  const options: (Specialization | 'All')[] = ['All', ...specializations]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((option) => {
        const isActive = option === selected
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'border-teal-600 bg-teal-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
