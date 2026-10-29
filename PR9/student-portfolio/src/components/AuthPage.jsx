import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth.js'

function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { login, register, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    if (user) navigate('/projects', { replace: true })
  }, [user, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setFieldErrors({})
    const credentials = { email: email.trim(), password }

    try {
      if (isRegister) {
        await register(credentials)
        navigate('/login', { replace: true, state: { notice: 'Your account is ready. Sign in to open your tasks.' } })
      } else {
        await login(credentials)
        navigate(location.state?.from || '/projects', { replace: true })
      }
    } catch (submitError) {
      setError(submitError.message)
      setFieldErrors(submitError.fields || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="route-page auth-route">
      <section className="section-shell auth-layout">
        <div className="auth-intro"><p className="eyebrow"><span className="heading-index">07</span> PRACTICAL 7 · SECURE ACCESS</p><h1>{isRegister ? <>Make it <span>yours.</span></> : <>Welcome <span>back.</span></>}</h1><p>{isRegister ? 'Create an account to keep your tasks private and ready wherever you left them.' : 'Sign in to pick up where you left off. Your tasks are waiting for you.'}</p><div className="auth-points"><span><i>01</i> Private workspace</span><span><i>02</i> Saved with MongoDB</span><span><i>03</i> Secure sign-in</span></div></div>
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <div className="auth-card-heading"><span className="auth-card-mark" aria-hidden="true">⌘</span><div><p className="eyebrow">{isRegister ? 'CREATE ACCOUNT' : 'ACCOUNT ACCESS'}</p><h2>{isRegister ? 'Get started' : 'Sign in'}</h2></div></div>
          {location.state?.notice && !isRegister && <p className="auth-notice" role="status">{location.state.notice}</p>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <label className="auth-field">Email address<input type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" maxLength={254} required aria-invalid={Boolean(fieldErrors.email)} />{fieldErrors.email && <span className="auth-field-error">{fieldErrors.email}</span>}</label>
          <label className="auth-field">Password<input type="password" name="password" autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'} minLength={8} maxLength={72} required aria-invalid={Boolean(fieldErrors.password)} />{fieldErrors.password && <span className="auth-field-error">{fieldErrors.password}</span>}</label>
          <button className="button button-primary auth-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span></button>
          <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to the task manager?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
        </form>
      </section>
    </main>
  )
}

export default AuthPage
