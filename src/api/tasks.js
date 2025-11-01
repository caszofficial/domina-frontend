import { apiConfig } from './config.js'
import { withBasicAuth } from './client.js'

const routes = {
  tasks: () => apiConfig.tasksBaseUrl
}

export function createTasksClient (token) {
  const client = withBasicAuth(token)

  return {
    async list () {
      return client.get(routes.tasks())
    },
    async create (task) {
      return client.post(routes.tasks(), task)
    },
    async update (taskId, task) {
      return client.put(`${routes.tasks()}/${taskId}`, task)
    },
    async remove (taskId) {
      return client.delete(`${routes.tasks()}/${taskId}`)
    }
  }
}
