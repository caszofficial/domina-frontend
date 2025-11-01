function TaskItem ({ task, onEdit, onDelete, onToggle }) {
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
        <label className="toggle">
          <input
            type="checkbox"
            checked={Boolean(task.completed)}
            onChange={(event) => onToggle?.(task, event.target.checked)}
          />
          <span>Marcar como {task.completed ? 'pendiente' : 'completada'}</span>
        </label>
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
