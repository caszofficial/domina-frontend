import { useEffect, useState } from 'react'

const initialState = {
  title: '',
  description: ''
}

function TaskForm ({ onSubmit, loading, onCancel, task }) {
  const [values, setValues] = useState(initialState)

  useEffect(() => {
    if (task) {
      setValues({
        title: task.title || '',
        description: task.description || ''
      })
    } else {
      setValues(initialState)
    }
  }, [task])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await onSubmit(values)

      if (!task) {
        setValues(initialState)
      }
    } catch (_error) {
      // El componente contenedor se encarga de manejar los errores.
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{task ? 'Editar tarea' : 'Nueva tarea'}</h3>
      <label className="form-field">
        <span>Título</span>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Ej. Preparar informe"
          required
        />
      </label>
      <label className="form-field">
        <span>Descripción</span>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows="3"
          placeholder="Detalles adicionales"
        />
      </label>
      <div className="form-actions">
        {onCancel && (
          <button className="button ghost" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : task ? 'Actualizar' : 'Crear tarea'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
