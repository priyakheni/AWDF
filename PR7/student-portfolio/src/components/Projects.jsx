function ProjectCard({ project, index }) {
  return (
    <article className={`project-card ${project.visual}`}>
      <div className="project-visual"><div className="project-visual-grid" /><span className="project-orbit" /><span className="project-mark" aria-hidden="true">{project.mark}</span><span className="project-count">0{index + 1} / 03</span><span className="visual-label">{project.eyebrow}</span></div>
      <div className="project-content"><div className="project-title-row"><h3>{project.title}</h3><span className="project-arrow" aria-hidden="true">↗</span></div><p>{project.description}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links"><span className="project-placeholder" aria-label="Project link placeholder"><span className="placeholder-dot" /> {project.status}</span><span className="project-availability">LINKS TO BE ADDED</span></div></div>
    </article>
  )
}

function Projects({ projects = [] }) {
  return (
    <section className="section-shell content-section projects-section" id="projects">
      <div className="section-heading projects-heading"><div><p className="eyebrow"><span className="heading-index">03</span> SELECTED WORK</p><h2>Small steps.<br /><span>Meaningful builds.</span></h2></div><p className="section-subtitle">A few ideas in progress, shaped by curiosity and the things I’m learning.</p></div>
      <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</div>
    </section>
  )
}

export default Projects
