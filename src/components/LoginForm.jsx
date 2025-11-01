import { useState } from 'react'

const initialState = {
  email: '',
  password: ''
}

function LoginForm ({ onSubmit, loading }) {
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
      <h2>Inicia sesión</h2>
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
          required
        />
      </label>
      <button className="button primary" type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Entrar'}
      </button>
    </form>
  )
}

export default LoginForm
