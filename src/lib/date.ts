export function formatDateHeading(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function groupSlotsByDay(slots: string[]): { day: string; slots: string[] }[] {
  const groups = new Map<string, string[]>()
  for (const slot of [...slots].sort()) {
    const key = new Date(slot).toDateString()
    const existing = groups.get(key) ?? []
    existing.push(slot)
    groups.set(key, existing)
  }
  return Array.from(groups.entries()).map(([day, daySlots]) => ({ day, slots: daySlots }))
}
