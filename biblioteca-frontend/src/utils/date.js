function pad2(n) {
  return String(n).padStart(2, '0')
}

export function getTodayISO(referenceDate = new Date()) {
  if (typeof globalThis.Temporal !== 'undefined') {
    return globalThis.Temporal.Now.plainDateISO().toString()
  }
  const year = referenceDate.getFullYear()
  const month = pad2(referenceDate.getMonth() + 1)
  const day = pad2(referenceDate.getDate())
  return `${year}-${month}-${day}`
}

export function parsePlainDate(isoString) {
  if (!isoString || typeof isoString !== 'string') return null
  const trimmed = isoString.trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (typeof globalThis.Temporal !== 'undefined') {
    try {
      const plain = globalThis.Temporal.PlainDate.from({ year, month, day })
      return { year: plain.year, month: plain.month, day: plain.day }
    } catch {
      return null
    }
  }

  const check = new Date(year, month - 1, day)
  if (
    check.getFullYear() !== year ||
    check.getMonth() !== month - 1 ||
    check.getDate() !== day
  ) {
    return null
  }
  return { year, month, day }
}

export function formatDateBR(isoString) {
  const parsed = parsePlainDate(isoString)
  if (!parsed) return '—'
  return `${pad2(parsed.day)}/${pad2(parsed.month)}/${parsed.year}`
}

export function addDaysISO(isoString, days) {
  const parsed = parsePlainDate(isoString)
  if (!parsed) return ''

  if (typeof globalThis.Temporal !== 'undefined') {
    const plain = globalThis.Temporal.PlainDate.from(parsed).add({ days })
    return plain.toString()
  }

  const dt = new Date(parsed.year, parsed.month - 1, parsed.day + days)
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`
}

function toDayNumber(parsed) {
  return Math.floor(Date.UTC(parsed.year, parsed.month - 1, parsed.day) / 86400000)
}

export function getLoanDueStatus(dataDevolucaoISO, todayISO = getTodayISO()) {
  const due = parsePlainDate(dataDevolucaoISO)
  const today = parsePlainDate(todayISO)
  if (!due || !today) {
    return { state: 'upcoming', days: 0, label: 'Sem prazo' }
  }

  const diffDays = toDayNumber(due) - toDayNumber(today)

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays)
    return {
      state: 'overdue',
      days: overdueDays,
      label: overdueDays === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${overdueDays} dias`,
    }
  }

  if (diffDays === 0) {
    return { state: 'today', days: 0, label: 'Vence hoje' }
  }

  return {
    state: 'upcoming',
    days: diffDays,
    label: diffDays === 1 ? 'Resta 1 dia' : `Restam ${diffDays} dias`,
  }
}
