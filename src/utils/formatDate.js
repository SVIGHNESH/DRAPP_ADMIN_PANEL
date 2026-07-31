export function formatDate(isoString) {
  if (!isoString) return { date: "", time: "" }
  const d = new Date(isoString)
  const date = d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  return { date, time }
}

// "2026-07-28" in local time, as expected by date-path API params
export function toDateParam(isoString) {
  if (!isoString) return null
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return null
  const pad = (n) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// "YYYY-MM-DD" for today shifted by n days, for the date-range query params.
export function dayOffset(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toDateParam(d)
}

/**
 * A date-only "YYYY-MM-DD" from the API, rendered as "Tue, 28 Jul".
 *
 * Split and rebuilt rather than handed to `new Date(dayStr)`, which reads a
 * bare ISO date as UTC midnight and so renders the day before anywhere west
 * of Greenwich.
 */
export function formatDay(dayStr) {
  if (!dayStr) return ""
  const [y, m, d] = dayStr.split("-").map(Number)
  if (!y || !m || !d) return dayStr
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

// "09:30:00" -> "09:30 AM"
export function formatTimeOfDay(timeStr) {
  if (!timeStr) return ""
  const [h, min] = timeStr.split(":").map(Number)
  if (Number.isNaN(h)) return timeStr
  const d = new Date()
  d.setHours(h, min || 0, 0, 0)
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
}

export function formatSlotRange(startIso, endIso) {
  const start = formatDate(startIso)
  const end = formatDate(endIso)
  const sameDay = start.date === end.date
  if (sameDay) {
    return { date: start.date, time: `${start.time} - ${end.time}` }
  }
  return { date: `${start.date} - ${end.date}`, time: `${start.time} - ${end.time}` }
}
