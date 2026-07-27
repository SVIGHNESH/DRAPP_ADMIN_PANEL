import { useState, useEffect, useCallback } from "react"
import { getErrorMessage } from "../utils/apiError"

export function useApi(fn, immediate = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fn(...args)
      setData(response.data)
      return response.data
    } catch (err) {
      const msg = getErrorMessage(err)
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fn])

  useEffect(() => {
    if (immediate) {
      fetch()
    }
  }, [immediate, fetch])

  return { data, loading, error, refetch: fetch }
}
