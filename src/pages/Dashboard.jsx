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
  const [filter, setFilter] = useState('all')

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

    const taskId = selectedTask.id || selectedTask._id
    const previousTasks = tasks

    setTasks((prev) => prev.map((task) => {
      const id = task.id || task._id
      return id === taskId ? { ...task, ...values } : task
    }))

    try {
      const updated = await client.update(taskId, values)

      if (updated && typeof updated === 'object') {
        setTasks((prev) => prev.map((task) => {
          const id = task.id || task._id
          if (id !== taskId) return task

          const completedValue =
            typeof updated.completed === 'boolean' ? updated.completed : task.completed

          return { ...task, ...updated, completed: completedValue }
        }))
      }

      setSelectedTask(null)
      setError(null)
    } catch (err) {
      setTasks(previousTasks)
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

  const handleToggleTask = async (task, completed) => {
    const taskId = task.id || task._id
    const previousValue = task.completed

    setTasks((prev) => prev.map((item) => {
      const id = item.id || item._id
      return id === taskId ? { ...item, completed } : item
    }))

    try {
      const updated = await client.update(taskId, { completed })
      setTasks((prev) => prev.map((item) => {
        const id = item.id || item._id
        if (id !== taskId) return item

        const completedValue =
          typeof updated?.completed === 'boolean' ? updated.completed : completed

        return { ...item, ...updated, completed: completedValue }
      }))
      setError(null)
    } catch (err) {
      setTasks((prev) => prev.map((item) => {
        const id = item.id || item._id
        return id === taskId ? { ...item, completed: previousValue } : item
      }))
      setError(err.message || 'No se pudo actualizar el estado de la tarea')
    }
  }

  const handleSubmit = async (values) => {
    if (selectedTask) {
      await handleUpdateTask(values)
    } else {
      await handleCreateTask(values)
    }
  }

  const displayName = useMemo(() => {
    if (!user) return ''

    const name = typeof user.name === 'string' ? user.name.trim() : ''
    if (name) return name

    return typeof user.email === 'string' ? user.email : ''
  }, [user])

  const filteredTasks = useMemo(() => {
    if (filter === 'completed') {
      return tasks.filter((task) => Boolean(task.completed))
    }

    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed)
    }

    return tasks
  }, [tasks, filter])

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <h1>Panel de tareas</h1>
          <p>Bienvenido, {displayName || 'usuario'}</p>
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
          <div className="filters">
            <button
              type="button"
              className={`chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`chip ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pendientes
            </button>
            <button
              type="button"
              className={`chip ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completadas
            </button>
          </div>
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            onEdit={setSelectedTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
          />
        </section>
      </div>
    </div>
  )
}

export default Dashboard
