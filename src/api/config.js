const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

export const apiConfig = {
  authBaseUrl: `${API_BASE_URL}/api/users`,
  tasksBaseUrl: `${API_BASE_URL}/api/tasks`,
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
}
