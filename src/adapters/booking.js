import { UI_STATUS_MAP, getStatusColor } from "../constants/status"
import { formatSlotRange } from "../utils/formatDate"

export function toUiBooking(bookingOut, serviceMap) {
  const serviceName = serviceMap.get(bookingOut.service_id)
  const { date, time } = formatSlotRange(bookingOut.slot_start, bookingOut.slot_end)
  const uiStatus = UI_STATUS_MAP[bookingOut.status] || bookingOut.status
  const userLabel = `User #${bookingOut.user_id}`
  const initials = userLabel
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return {
    id: bookingOut.booking_id,
    bookingId: bookingOut.booking_id,
    userName: userLabel,
    userId: bookingOut.user_id,
    nurse: bookingOut.assigned_nurse?.nurse_name || "Unassigned",
    nurseContact: bookingOut.assigned_nurse?.nurse_contact || null,
    careType: serviceName || `Service #${bookingOut.service_id}`,
    date,
    time,
    status: uiStatus,
    statusBadge: getStatusColor(uiStatus),
    address: bookingOut.custom_address || `Saved address #${bookingOut.address_id}`,
    avatar: initials,
    slotStart: bookingOut.slot_start,
    slotEnd: bookingOut.slot_end,
    notes: bookingOut.notes || [],
    assignedNurse: bookingOut.assigned_nurse || null,
    backendStatus: bookingOut.status,
  }
}

export function buildServiceMap(services) {
  const map = new Map()
  if (services) {
    services.forEach((s) => map.set(s.service_id, s.name))
  }
  return map
}
