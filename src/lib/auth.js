export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("admin_refresh_token")

  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(
      "http://localhost:8081/api/admin/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      }
    )

    if (!response.ok) {
      localStorage.removeItem("admin_access_token")
      localStorage.removeItem("admin_refresh_token")
      localStorage.removeItem("admin_user")

      return false
    }

    const data = await response.json()

    if (!data.access_token) {
      return false
    }

    localStorage.setItem(
      "admin_access_token",
      data.access_token
    )

    return true
  } catch (error) {
    console.error("Gagal refresh access token:", error)
    return false
  }
}

export async function getAccessToken() {
  const accessToken = localStorage.getItem("admin_access_token")

  if (accessToken) {
    return accessToken
  }

  const refreshed = await refreshAccessToken()

  if (!refreshed) {
    return null
  }

  return localStorage.getItem("admin_access_token")
}