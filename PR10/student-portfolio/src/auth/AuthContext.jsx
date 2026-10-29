import { useEffect, useState } from 'react'
import taskApi from '../api.js'
import AuthContext from './context.js'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(taskApi.getToken()))

  useEffect(() => {
    let active = true
    const handleUnauthorized = () => {
      taskApi.clearToken()
      setUser(null)
      setLoading(false)
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    if (taskApi.getToken()) {
      taskApi.getMe().then((currentUser) => {
        if (active) setUser(currentUser)
      }).catch(() => {
        taskApi.clearToken()
        if (active) setUser(null)
      }).finally(() => {
        if (active) setLoading(false)
      })
    }

    return () => {
      active = false
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  async function register(credentials) {
    return taskApi.register(credentials)
  }

  async function login(credentials) {
    const result = await taskApi.login(credentials)
    setUser(result.user)
    return result.user
  }

  function logout() {
    taskApi.clearToken()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, register, login, logout }}>{children}</AuthContext.Provider>
}

export default AuthProvider
