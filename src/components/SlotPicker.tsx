import { formatDateHeading, formatTime, groupSlotsByDay } from '../lib/date'

interface SlotPickerProps {
  slots: string[]
  bookedSlots: Set<string>
  selectedSlot: string | null
  onSelect: (slot: string) => void
}

export function SlotPicker({ slots, bookedSlots, selectedSlot, onSelect }: SlotPickerProps) {
  const grouped = groupSlotsByDay(slots)

  if (grouped.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No available slots right now.</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {grouped.map(({ day, slots: daySlots }) => (
        <div key={day}>
          <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formatDateHeading(daySlots[0])}
          </h4>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => {
              const isBooked = bookedSlots.has(slot)
              const isSelected = slot === selectedSlot
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => onSelect(slot)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    isBooked
                      ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through dark:border-slate-800 dark:bg-slate-900 dark:text-slate-600'
                      : isSelected
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  {formatTime(slot)}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
