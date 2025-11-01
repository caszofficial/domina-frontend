import { apiConfig } from './config.js'
import { request } from './client.js'

const routes = {
  login: () => `${apiConfig.authBaseUrl}/auth/login`,
  register: () => `${apiConfig.authBaseUrl}/auth/register`,
  refresh: () => `${apiConfig.authBaseUrl}/auth/refresh`
}

export async function loginUser (credentials) {
  return request(routes.login(), {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
}

export async function registerUser (payload) {
  return request(routes.register(), {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function refreshSession (token) {
  return request(routes.refresh(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
