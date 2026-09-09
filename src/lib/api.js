import { getAccessToken, refreshAccessToken } from "./auth"

const API_URL = "http://localhost:8081"

export async function apiFetch(endpoint, options = {}) {
  let accessToken = await getAccessToken()

  if (!accessToken) {
    throw new Error("Sesi admin tidak tersedia")
  }

  const makeRequest = (token) => {
    const headers = new Headers(options.headers || {})

    headers.set("Authorization", `Bearer ${token}`)

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })
  }

  let response = await makeRequest(accessToken)

  if (response.status === 401) {
    const refreshed = await refreshAccessToken()

    if (!refreshed) {
      throw new Error("Sesi admin sudah berakhir")
    }

    accessToken = localStorage.getItem("admin_access_token")

    if (!accessToken) {
      throw new Error("Access token tidak tersedia")
    }

    response = await makeRequest(accessToken)
  }

  return response
}