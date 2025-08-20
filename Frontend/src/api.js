import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
})

// Add interceptor for token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      alert("Your session has expired. Please login again.")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
