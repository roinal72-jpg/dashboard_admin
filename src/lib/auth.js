const API_URL = "http://localhost:8081"

const clearAdminSession = () => {
  localStorage.removeItem("admin_access_token")
  localStorage.removeItem("admin_refresh_token")
  localStorage.removeItem("admin_user")
}

const decodeJwtPayload = (token) => {
  try {
    const parts = token.split(".")

    if (parts.length !== 3) {
      return null
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    )

    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

const isTokenExpired = (token) => {
  if (!token) {
    return true
  }

  const payload = decodeJwtPayload(token)

  if (!payload?.exp) {
    return false
  }

  const now = Math.floor(
    Date.now() / 1000
  )

  // Anggap expired 10 detik lebih awal
  // supaya tidak memakai token yang
  // hampir kedaluwarsa.
  return payload.exp <= now + 10
}

export async function refreshAccessToken() {
  try {
    const response = await fetch(
      `${API_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    )

    if (!response.ok) {
      clearAdminSession()
      return false
    }

    const data = await response.json()

    if (!data?.access_token) {
      clearAdminSession()
      return false
    }

    localStorage.setItem(
      "admin_access_token",
      data.access_token
    )

    return true
  } catch (error) {
    console.error(
      "Gagal refresh access token:",
      error
    )

    clearAdminSession()
    return false
  }
}

export async function getAccessToken() {
  const accessToken = localStorage.getItem(
    "admin_access_token"
  )

  if (
    accessToken &&
    !isTokenExpired(accessToken)
  ) {
    return accessToken
  }

  const refreshed = await refreshAccessToken()

  if (!refreshed) {
    return null
  }

  return localStorage.getItem(
    "admin_access_token"
  )
}

export { clearAdminSession, isTokenExpired }