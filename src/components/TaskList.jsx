import TaskItem from './TaskItem.jsx'

function TaskList ({ tasks, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="card centered">
        <span className="spinner" aria-hidden="true" />
        <p>Cargando tareas...</p>
      </div>
    )
  }

  if (!tasks.length) {
    return (
      <div className="card centered">
        <p>No hay tareas registradas todavía.</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id || task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TaskList
