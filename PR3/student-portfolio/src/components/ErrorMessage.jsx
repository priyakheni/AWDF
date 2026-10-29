function ErrorMessage({ message, onRetry }) {
  return (
    <div className="api-error" role="alert">
      <span className="error-mark" aria-hidden="true">!</span>
      <div><h3>Repositories unavailable</h3><p>{message}</p></div>
      <button className="retry-button" type="button" onClick={onRetry}>Retry <span aria-hidden="true">↻</span></button>
    </div>
  )
}

export default ErrorMessage
