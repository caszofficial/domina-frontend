function TaskItem ({ task, onEdit, onDelete }) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const formattedDate = dueDate ? dueDate.toLocaleDateString() : 'Sin fecha'

  return (
    <article className="task-item">
      <header>
        <h4>{task.title}</h4>
        <span className={`status ${task.completed ? 'done' : 'pending'}`}>
          {task.completed ? 'Completada' : 'Pendiente'}
        </span>
      </header>
      {task.description && <p className="description">{task.description}</p>}
      <footer>
        <div className="meta">
          <span>Vence: {formattedDate}</span>
        </div>
        <div className="actions">
          <button className="button ghost" onClick={() => onEdit(task)}>
            Editar
          </button>
          <button className="button danger" onClick={() => onDelete(task)}>
            Eliminar
          </button>
        </div>
      </footer>
    </article>
  )
}

export default TaskItem
