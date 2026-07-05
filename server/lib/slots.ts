const MORNING = [9, 10, 11]
const AFTERNOON = [14, 15, 16]

/** Each doctor's recurring availability pattern: which of the next N days, and which hours. */
const SLOT_PATTERNS: Record<string, { dayOffsets: number[]; hours: number[] }> = {
  'doc-1': { dayOffsets: [1, 2, 4], hours: MORNING },
  'doc-2': { dayOffsets: [0, 2, 3], hours: AFTERNOON },
  'doc-3': { dayOffsets: [1, 3, 5], hours: MORNING },
  'doc-4': { dayOffsets: [2, 3, 6], hours: AFTERNOON },
  'doc-5': { dayOffsets: [0, 1, 4], hours: MORNING },
  'doc-6': { dayOffsets: [1, 2, 3], hours: AFTERNOON },
  'doc-7': { dayOffsets: [0, 1, 2, 3, 4], hours: MORNING },
  'doc-8': { dayOffsets: [2, 4, 5], hours: AFTERNOON },
  'doc-9': { dayOffsets: [1, 3, 4], hours: MORNING },
  'doc-10': { dayOffsets: [0, 2, 5], hours: AFTERNOON },
}

/** Builds this doctor's future slot times (ISO strings) from their recurring availability pattern. */
export function generateSlotsForDoctor(doctorId: string): string[] {
  const pattern = SLOT_PATTERNS[doctorId]
  if (!pattern) return []

  const slots: string[] = []
  const now = new Date()
  for (const dayOffset of pattern.dayOffsets) {
    for (const hour of pattern.hours) {
      const d = new Date(now)
      d.setDate(d.getDate() + dayOffset)
      d.setHours(hour, 0, 0, 0)
      slots.push(d.toISOString())
    }
  }
  return slots
}
