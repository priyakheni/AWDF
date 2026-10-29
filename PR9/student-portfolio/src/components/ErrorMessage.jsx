function ErrorMessage({ message, onRetry, title = 'Something went wrong' }) {
  return (
    <div className="api-error" role="alert">
      <span className="error-mark" aria-hidden="true">!</span>
      <div><h3>{title}</h3><p>{message}</p></div>
      {onRetry && <button className="retry-button" type="button" onClick={onRetry}>Retry <span aria-hidden="true">↻</span></button>}
    </div>
  )
}

export default ErrorMessage
