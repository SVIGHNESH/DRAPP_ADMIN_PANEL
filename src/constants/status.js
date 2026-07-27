export const STATUS_LIST = ["requested", "confirmed", "in_progress", "completed", "cancelled"]

export const UI_STATUS_MAP = {
  requested: "pending",
  confirmed: "confirmed",
  in_progress: "in-progress",
  completed: "completed",
  cancelled: "cancelled",
}

export const BACKEND_STATUS_MAP = {
  pending: "requested",
  "in-progress": "in_progress",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
}

export const getStatusColor = (status) => {
  const colors = {
    confirmed: "bg-emerald-500/15 text-emerald-400",
    "in-progress": "bg-cyan-500/15 text-cyan-400",
    pending: "bg-amber-500/15 text-amber-400",
    cancelled: "bg-rose-500/15 text-rose-400",
    completed: "bg-dark-600 text-dark-400",
    active: "bg-emerald-500/15 text-emerald-400",
    "on-leave": "bg-amber-500/15 text-amber-400",
    stable: "bg-emerald-500/15 text-emerald-400",
    critical: "bg-rose-500/15 text-rose-400",
    observation: "bg-cyan-500/15 text-cyan-400",
  }
  return colors[status] || "bg-dark-600 text-dark-400"
}
