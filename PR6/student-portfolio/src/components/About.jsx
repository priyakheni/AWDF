const highlights = [
  { number: '01', title: 'Areas of interest', text: 'Artificial intelligence, machine learning, and the stories data can tell.' },
  { number: '02', title: 'Learning goals', text: 'Strengthen my foundations and turn new concepts into practical projects.' },
  { number: '03', title: 'Development focus', text: 'Build thoughtful, accessible web experiences with React and modern tools.' },
]

function About() {
  return (
    <section className="section-shell content-section" id="about">
      <div className="section-heading"><p className="eyebrow"><span className="heading-index">01</span> A LITTLE ABOUT ME</p><h2>Curious mind.<br /><span>Builder at heart.</span></h2></div>
      <div className="about-layout">
        <div className="about-intro"><span className="about-quote" aria-hidden="true">“</span><p>I’m an engineering student at CHARUSAT University, drawn to the space where technology meets real human needs. I enjoy exploring how intelligent systems work and creating software that makes ideas tangible.</p><p>Right now, I’m learning by doing: experimenting with data and AI concepts, and growing my skills as a web developer one project at a time.</p><div className="about-signature"><span className="signature-rule" /> PRIYA KHENI <span>·</span> STUDENT &amp; BUILDER</div></div>
        <div className="about-cards">{highlights.map((item) => <article className="info-card" key={item.number}><span className="info-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="info-arrow" aria-hidden="true">↗</span></article>)}</div>
      </div>
    </section>
  )
}

export default About
