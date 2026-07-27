export function getErrorMessage(error) {
  if (!error.response) {
    return "Network error. Please check your connection."
  }

  const data = error.response.data

  if (data && data.detail) {
    if (typeof data.detail === "string") {
      return data.detail
    }
    if (Array.isArray(data.detail)) {
      return data.detail.map((e) => e.msg || e.message || JSON.stringify(e)).join("; ")
    }
  }

  if (data && data.message) {
    return data.message
  }

  const status = error.response.status
  switch (status) {
    case 400:
      return "Bad request"
    case 401:
      return "Session expired. Please log in again."
    case 403:
      return "Access denied"
    case 404:
      return "Resource not found"
    case 500:
      return "Server error"
    default:
      return "Something went wrong"
  }
}
