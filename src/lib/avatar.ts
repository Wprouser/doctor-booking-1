const PALETTE = [
  ['#0d9488', '#ccfbf1'], // teal
  ['#2563eb', '#dbeafe'], // blue
  ['#7c3aed', '#ede9fe'], // violet
  ['#db2777', '#fce7f3'], // pink
  ['#ea580c', '#ffedd5'], // orange
  ['#059669', '#d1fae5'], // emerald
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function initials(name: string): string {
  const parts = name.replace(/^Dr\.?\s*/i, '').split(' ').filter(Boolean)
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** Generates a deterministic initials-avatar data URI so profiles don't depend on external image hosts. */
export function avatarDataUri(name: string): string {
  const [fg, bg] = PALETTE[hashString(name) % PALETTE.length]
  const label = initials(name)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="60" fill="${bg}" />
    <text x="60" y="60" text-anchor="middle" dominant-baseline="central" font-family="system-ui, sans-serif" font-size="44" font-weight="600" fill="${fg}">${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
