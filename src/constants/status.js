// Every status the backend can return on a booking.
export const STATUS_LIST = [
  "pending_payment",
  "requested",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]

// Statuses an admin should actively set. "pending_payment" is a checkout
// state, not something to move a booking back into.
export const ADMIN_SETTABLE_STATUSES = [
  "requested",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]

export const UI_STATUS_MAP = {
  pending_payment: "awaiting-payment",
  requested: "pending",
  confirmed: "confirmed",
  in_progress: "in-progress",
  completed: "completed",
  cancelled: "cancelled",
}

export const BACKEND_STATUS_MAP = {
  "awaiting-payment": "pending_payment",
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
    "awaiting-payment": "bg-violet-500/15 text-violet-400",
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

export const getPaymentStatusColor = (status) => {
  const colors = {
    completed: "bg-emerald-500/15 text-emerald-400",
    pending: "bg-amber-500/15 text-amber-400",
    failed: "bg-rose-500/15 text-rose-400",
  }
  return colors[status] || "bg-dark-600 text-dark-400"
}
