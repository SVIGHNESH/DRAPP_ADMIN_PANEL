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

export function formatSlotRange(startIso, endIso) {
  const start = formatDate(startIso)
  const end = formatDate(endIso)
  const sameDay = start.date === end.date
  if (sameDay) {
    return { date: start.date, time: `${start.time} - ${end.time}` }
  }
  return { date: `${start.date} - ${end.date}`, time: `${start.time} - ${end.time}` }
}
