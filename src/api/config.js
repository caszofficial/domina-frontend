export const apiConfig = {
  authBaseUrl: `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/users`,
  tasksBaseUrl: `${import.meta.env.VITE_TASKS_SERVICE_URL}/api/tasks`,
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};
