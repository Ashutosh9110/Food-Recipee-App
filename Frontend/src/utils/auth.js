import { jwtDecode } from "jwt-decode"

export const setAutoLogout = (token) => {
  try {
    const decoded = jwtDecode(token)
    const expiryTime = decoded.exp * 1000 - Date.now() // ms until expiry

    if (expiryTime > 0) {
      setTimeout(() => {
        localStorage.removeItem("token")
        alert("Session expired. Please login again.")
        window.location.href = "/login"
      }, expiryTime)
    }
  } catch (err) {
    console.error("Invalid token", err)
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
}
