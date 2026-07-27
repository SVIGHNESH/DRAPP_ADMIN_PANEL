const STORAGE_KEY = 'local_nurses'

export function getLocalNurses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function addLocalNurse(name, contact) {
  const nurses = getLocalNurses()
  const exists = nurses.some((n) => n.name.toLowerCase() === name.toLowerCase())
  if (exists) return false
  nurses.push({ name, contact: contact || null, id: Date.now(), _local: true })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nurses))
  return true
}

export function removeLocalNurse(id) {
  const nurses = getLocalNurses().filter((n) => n.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nurses))
}

export function getAllKnownNurses() {
  return getLocalNurses()
}
