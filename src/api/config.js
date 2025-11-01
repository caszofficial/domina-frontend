const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4000'
const TASKS_SERVICE_URL = import.meta.env.VITE_TASKS_SERVICE_URL || 'http://localhost:5000'

export const apiConfig = {
  authBaseUrl: AUTH_SERVICE_URL.replace(/\/$/, ''),
  tasksBaseUrl: TASKS_SERVICE_URL.replace(/\/$/, ''),
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
}
