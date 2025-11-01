import { useAuth } from './context/AuthContext.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App () {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-loading">
        <span className="spinner" aria-hidden="true" />
        <p>Cargando sesión...</p>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <AuthPage />
}

export default App
