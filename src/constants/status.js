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

/**
 * A status resolves to a tone, not to a pair of Tailwind classes.
 *
 * tickets/T03-token-set.md settled five hues across all eleven states, and
 * settled that a status reads as neutral text beside a coloured dot rather
 * than as a tinted pill: a pill forces its own text down to roughly 4.2:1 and
 * light-theme amber bottoms out at 3.71:1, while a dot only has to clear 3:1.
 * StatusBadge owns the rendering; this file only names the hue.
 *
 * "completed" is deliberately toneless. It is the resting state of most rows
 * and should not compete with the ones that need attention.
 */
export const getStatusTone = (status) => {
  const tones = {
    confirmed: "success",
    "in-progress": "info",
    pending: "warning",
    "awaiting-payment": "special",
    cancelled: "danger",
    completed: "neutral",
    active: "success",
    "on-leave": "warning",
    stable: "success",
    critical: "danger",
    observation: "info",
  }
  return tones[status] || "neutral"
}

export const getPaymentStatusTone = (status) => {
  const tones = {
    completed: "success",
    pending: "warning",
    failed: "danger",
  }
  return tones[status] || "neutral"
}
