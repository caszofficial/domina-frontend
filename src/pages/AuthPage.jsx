import { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm.jsx'
import RegisterForm from '../components/RegisterForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function AuthPage () {
  const [mode, setMode] = useState('login')
  const { login, register, loading, error, clearError } = useAuth()

  useEffect(() => {
    clearError()
  }, [mode, clearError])

  const handleLogin = async (values) => {
    await login(values)
  }

  const handleRegister = async (values) => {
    await register(values)
  }

  return (
    <div className="auth-page">
      <div className="intro">
        <h1>Domina tus tareas</h1>
        <p>
          Mantén el control de tus pendientes con una interfaz sencilla que se conecta a tu
          backend de microservicios. Registra usuarios, autentícate y gestiona tus tareas desde
          un solo lugar.
        </p>
      </div>
      <div className="forms">
        <div className="switcher" role="tablist">
          <button
            className={`switch ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
            role="tab"
            aria-selected={mode === 'login'}
          >
            Iniciar sesión
          </button>
          <button
            className={`switch ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
            role="tab"
            aria-selected={mode === 'register'}
          >
            Crear cuenta
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {mode === 'login'
          ? <LoginForm onSubmit={handleLogin} loading={loading} />
          : <RegisterForm onSubmit={handleRegister} loading={loading} />}
      </div>
    </div>
  )
}

export default AuthPage
