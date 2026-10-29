import { Navigate, useLocation } from 'react-router-dom'
import useAuth from './useAuth.js'
import Spinner from '../components/Spinner.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <main className="route-page"><div className="section-shell"><Spinner label="Checking your session" /></div></main>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

export default ProtectedRoute
