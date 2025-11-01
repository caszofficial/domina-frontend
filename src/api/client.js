import { apiConfig } from './config.js'

class ApiError extends Error {
  constructor (message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function request (url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...apiConfig.defaultHeaders,
      ...(options.headers || {})
    }
  })

  let data
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    const message = data?.message || 'Error inesperado al comunicarse con el servicio'
    throw new ApiError(message, response.status, data)
  }

  return data
}

export function withBasicAuth (token) {
  return {
    async get (path) {
      return request(path, {
        headers: {
          Authorization: `Basic ${token}`
        }
      })
    },
    async post (path, body) {
      return request(path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Basic ${token}`
        }
      })
    },
    async put (path, body) {
      return request(path, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Basic ${token}`
        }
      })
    },
    async delete (path) {
      return request(path, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${token}`
        }
      })
    }
  }
}

export { request, ApiError }
