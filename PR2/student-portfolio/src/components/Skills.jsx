function Skills({ skillList }) {
  return (
    <section className="section-shell content-section skills-section" id="skills">
      <div className="section-heading"><p className="eyebrow"><span className="heading-index">02</span> MY TOOLKIT</p><h2>Things I’m learning<br /><span>to make things work.</span></h2><p className="section-subtitle">A growing set of tools and concepts I use to explore, experiment, and build.</p></div>
      <div className="skills-grid">{skillList.map((group, index) => <article className="skill-card" key={group.title}><div className="skill-card-top"><span className="skill-icon" aria-hidden="true">{group.icon}</span><span className="skill-index">0{index + 1}</span></div><h3>{group.title}</h3><ul>{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul><div className="skill-card-glow" aria-hidden="true" /></article>)}</div>
      <p className="skills-footnote"><span className="status-dot" /> Always learning, always building.</p>
    </section>
  )
}

export default Skills
