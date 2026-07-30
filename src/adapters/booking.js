import { UI_STATUS_MAP, getStatusTone } from "../constants/status"
import { formatSlotRange } from "../utils/formatDate"

export function toUiBooking(bookingOut, serviceMap) {
  const { date, time } = formatSlotRange(bookingOut.slot_start, bookingOut.slot_end)
  const uiStatus = UI_STATUS_MAP[bookingOut.status] || bookingOut.status

  // The backend resolves related rows onto BookingOut so the dashboard does
  // not need a follow-up request per id; the "#id" strings are last resorts.
  const userName = bookingOut.booked_by_name || `User #${bookingOut.user_id}`
  const serviceName =
    bookingOut.service_name ||
    serviceMap.get(bookingOut.service_id) ||
    `Service #${bookingOut.service_id}`
  const savedAddress = [bookingOut.service_address, bookingOut.service_city]
    .filter(Boolean)
    .join(", ")
  const address =
    bookingOut.custom_address ||
    savedAddress ||
    (bookingOut.address_id ? `Saved address #${bookingOut.address_id}` : "No address on record")

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return {
    id: bookingOut.booking_id,
    bookingId: bookingOut.booking_id,
    userName,
    userEmail: bookingOut.booked_by_email || null,
    userId: bookingOut.user_id,
    patientName: bookingOut.patient_name || bookingOut.member_name || null,
    patientAge: bookingOut.patient_age ?? null,
    patientSex: bookingOut.patient_sex || null,
    patientCondition: bookingOut.patient_condition || null,
    paymentStatus: bookingOut.payment_status || null,
    nurse: bookingOut.assigned_nurse?.nurse_name || "Unassigned",
    nurseContact: bookingOut.assigned_nurse?.nurse_contact || null,
    careType: serviceName,
    date,
    time,
    status: uiStatus,
    statusTone: getStatusTone(uiStatus),
    address,
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
