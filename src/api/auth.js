import { apiConfig } from './config.js'
import { request } from './client.js'

const routes = {
  login: () => `${apiConfig.authBaseUrl}/login`,
  register: () => `${apiConfig.authBaseUrl}/register`,
  verify: () => `${apiConfig.authBaseUrl}/verify`
}

export async function loginUser (basicToken) {
  return request(routes.login(), {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicToken}`
    }
  })
}

export async function registerUser (payload) {
  return request(routes.register(), {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function verifyUser (basicToken) {
  return request(routes.verify(), {
    headers: {
      Authorization: `Basic ${basicToken}`
    }
  })
}
