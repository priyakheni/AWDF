import { useState } from 'react'

const contactDetails = { email: '', github: '', linkedin: '' }

function Contact() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    if (!contactDetails.email) return
    try {
      await navigator.clipboard.writeText(contactDetails.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch { setCopied(false) }
  }
  return (
    <section className="section-shell contact-section" id="contact">
      <div className="contact-glow" aria-hidden="true" /><p className="eyebrow"><span className="heading-index">05</span> OPEN TO GOOD IDEAS</p><h2>Have an idea?<br /><span>Let’s build something meaningful.</span></h2><p className="contact-copy">I’m always glad to connect with curious people and talk about technology, learning, or a project worth exploring.</p>
      <div className="contact-actions">{contactDetails.email ? <a className="button button-primary contact-email" href={`mailto:${contactDetails.email}`}>Say hello <span aria-hidden="true">↗</span></a> : <span className="button button-primary contact-email is-placeholder" aria-label="Email address not configured">Email address to be added <span aria-hidden="true">↗</span></span>}{contactDetails.email ? <button className="copy-button" type="button" onClick={copyEmail}>{copied ? 'Copied ✓' : 'Copy email'}</button> : <span className="copy-button copy-disabled" aria-label="Copy email unavailable until configured">Configure email to enable copy</span>}</div>
      <div className="social-links"><a href={contactDetails.github || '#contact'} aria-disabled={!contactDetails.github} onClick={(event) => !contactDetails.github && event.preventDefault()}>GitHub <span aria-hidden="true">↗</span></a><span className="social-divider">·</span><a href={contactDetails.linkedin || '#contact'} aria-disabled={!contactDetails.linkedin} onClick={(event) => !contactDetails.linkedin && event.preventDefault()}>LinkedIn <span aria-hidden="true">↗</span></a><span className="social-note">Profile links coming soon</span></div>
    </section>
  )
}

export default Contact
