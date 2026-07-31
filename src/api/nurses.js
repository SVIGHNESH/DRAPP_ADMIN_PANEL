import api from "./api"

export const getNurses = () => api.get("/nurses")

export const getNurse = (id) => api.get(`/nurses/${id}`)

export const createNurse = (data) => api.post("/nurses", data)

export const updateNurse = (id, data) => api.patch(`/nurses/${id}`, data)

// The admin view of one nurse's declared days: which were leave, which were
// worked, and the window they declared for each. This is a different question
// from getAvailableNurses below - that one answers "who is free for this
// slot", this one answers "what has this nurse declared over a period".
// from_day/to_day are plain ISO dates, e.g. "2026-07-28".
export const getNurseAvailability = (nurseId, fromDay, toDay) =>
  api.get(`/nurses/${nurseId}/availability`, {
    params: {
      ...(fromDay ? { from_day: fromDay } : {}),
      ...(toDay ? { to_day: toDay } : {}),
    },
  })

// date_str is an ISO date, e.g. "2026-07-28". Without slot_start/slot_end the
// backend treats the whole day as the window, hiding any nurse with even one
// booking that day - so pass the exact slot whenever it is known.
export const getAvailableNurses = (dateStr, slotStart, slotEnd) =>
  api.get(`/nurses/availability/${dateStr}`, {
    params: {
      ...(slotStart ? { slot_start: slotStart } : {}),
      ...(slotEnd ? { slot_end: slotEnd } : {}),
    },
  })
