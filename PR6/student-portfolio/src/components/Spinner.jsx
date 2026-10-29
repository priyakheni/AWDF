function Spinner({ label = 'Loading' }) {
  return <div className="api-spinner" role="status"><span className="spinner-ring" aria-hidden="true" /><span>{label}</span></div>
}

export default Spinner
