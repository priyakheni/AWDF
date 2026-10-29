import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="not-found section-shell">
      <p className="eyebrow"><span className="heading-index">404</span> PAGE NOT FOUND</p>
      <h1>This route is <span>off the map.</span></h1>
      <p>The page you’re looking for doesn’t exist. Head back home to keep exploring the portfolio.</p>
      <Link className="button button-primary" to="/">Back to home <span aria-hidden="true">→</span></Link>
    </main>
  )
}

export default NotFound
