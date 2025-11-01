import { useState } from 'react'

const initialState = {
  name: '',
  email: '',
  password: ''
}

function RegisterForm ({ onSubmit, loading }) {
  const [values, setValues] = useState(initialState)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Crea tu cuenta</h2>
      <label className="form-field">
        <span>Nombre completo</span>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
        />
      </label>
      <label className="form-field">
        <span>Correo electrónico</span>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="tu@correo.com"
          required
        />
      </label>
      <label className="form-field">
        <span>Contraseña</span>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="••••••••"
          minLength="6"
          required
        />
      </label>
      <button className="button" type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Registrarme'}
      </button>
    </form>
  )
}

export default RegisterForm
