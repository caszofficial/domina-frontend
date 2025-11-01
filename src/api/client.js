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

export function withAuth (token) {
  return {
    async get (path) {
      return request(path, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async post (path, body) {
      return request(path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async put (path, body) {
      return request(path, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    async delete (path) {
      return request(path, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  }
}

export { request, ApiError }
