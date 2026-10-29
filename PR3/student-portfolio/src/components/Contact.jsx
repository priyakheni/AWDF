import { useState } from 'react'

const contactDetails = { email: '', github: '', linkedin: '' }

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [showHelp, setShowHelp] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setSubmitted(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="section-shell contact-section" id="contact">
      <div className="contact-glow" aria-hidden="true" />
      <p className="eyebrow"><span className="heading-index">05</span> OPEN TO GOOD IDEAS</p>
      <h2>Have an idea?<br /><span>Let’s build something meaningful.</span></h2>
      <p className="contact-copy">I’m always glad to connect with curious people and talk about technology, learning, or a project worth exploring.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Your name" required />
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} placeholder="What would you like to talk about?" maxLength={500} rows={5} required />
        <div className="message-meta"><span>{formData.message || 'Your message will appear here as you type.'}</span><span className="character-count">{formData.message.length}/500</span></div>
        <button className="button button-primary form-submit" type="submit">Send message <span aria-hidden="true">↗</span></button>
        {submitted && <p className="form-feedback" role="status">Thanks, {formData.name}! Your message is ready. This demo does not send data to a server.</p>}
      </form>

      <div className="help-area">
        <button className="copy-button" type="button" aria-expanded={showHelp} onClick={() => setShowHelp(!showHelp)}>{showHelp ? 'Hide help' : 'Show help'}</button>
        {showHelp && <p className="help-copy">Enter your name and a valid email, then write a message of up to 500 characters. This practical demonstrates React state in the browser.</p>}
      </div>

      <div className="contact-actions">{contactDetails.email ? <a className="button button-primary contact-email" href={`mailto:${contactDetails.email}`}>Say hello <span aria-hidden="true">↗</span></a> : <span className="button button-primary contact-email is-placeholder" aria-label="Email address not configured">Email address to be added <span aria-hidden="true">↗</span></span>}</div>
      <div className="social-links"><a href={contactDetails.github || '#contact'} aria-disabled={!contactDetails.github} onClick={(event) => !contactDetails.github && event.preventDefault()}>GitHub <span aria-hidden="true">↗</span></a><span className="social-divider">·</span><a href={contactDetails.linkedin || '#contact'} aria-disabled={!contactDetails.linkedin} onClick={(event) => !contactDetails.linkedin && event.preventDefault()}>LinkedIn <span aria-hidden="true">↗</span></a><span className="social-note">Profile links coming soon</span></div>
    </section>
  )
}

export default Contact
