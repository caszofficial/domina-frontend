import { useCallback, useEffect, useMemo, useState } from 'react'
import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createTasksClient } from '../api/tasks.js'

function Dashboard () {
  const { user, token, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [error, setError] = useState(null)

  const client = useMemo(() => createTasksClient(token), [token])

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await client.list()
      setTasks(Array.isArray(data) ? data : data?.tasks || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las tareas')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleCreateTask = async (values) => {
    setSaving(true)
    try {
      const created = await client.create({ ...values, completed: false })
      setTasks((prev) => [created, ...prev])
      setSelectedTask(null)
      setError(null)
    } catch (err) {
      setError(err.message || 'No se pudo crear la tarea')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateTask = async (values) => {
    if (!selectedTask) return
    setSaving(true)
    try {
      const updated = await client.update(selectedTask.id || selectedTask._id, values)
      setTasks((prev) => prev.map((task) => {
        const id = task.id || task._id
        return id === (selectedTask.id || selectedTask._id) ? { ...task, ...updated } : task
      }))
      setSelectedTask(null)
      setError(null)
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la tarea')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(`¿Eliminar la tarea "${task.title}"?`)
    if (!confirmed) return

    try {
      await client.remove(task.id || task._id)
      setTasks((prev) => prev.filter((item) => (item.id || item._id) !== (task.id || task._id)))
      setError(null)
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la tarea')
    }
  }

  const handleSubmit = async (values) => {
    if (selectedTask) {
      await handleUpdateTask(values)
    } else {
      await handleCreateTask(values)
    }
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <h1>Panel de tareas</h1>
          <p>Bienvenido, {user?.name || user?.email}</p>
        </div>
        <button className="button ghost" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        <TaskForm
          onSubmit={handleSubmit}
          loading={saving}
          task={selectedTask}
          onCancel={selectedTask ? () => setSelectedTask(null) : null}
        />
        <section className="tasks-section">
          <div className="section-header">
            <h2>Tareas</h2>
            <button className="button ghost" onClick={fetchTasks} disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={setSelectedTask}
            onDelete={handleDeleteTask}
          />
        </section>
      </div>
    </div>
  )
}

export default Dashboard
