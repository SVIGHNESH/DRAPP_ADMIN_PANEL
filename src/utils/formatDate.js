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

export function formatSlotRange(startIso, endIso) {
  const start = formatDate(startIso)
  const end = formatDate(endIso)
  const sameDay = start.date === end.date
  if (sameDay) {
    return { date: start.date, time: `${start.time} - ${end.time}` }
  }
  return { date: `${start.date} - ${end.date}`, time: `${start.time} - ${end.time}` }
}
