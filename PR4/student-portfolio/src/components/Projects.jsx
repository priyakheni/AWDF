import { useEffect, useMemo, useState } from 'react'
import Spinner from './Spinner.jsx'
import ErrorMessage from './ErrorMessage.jsx'

function ProjectCard({ project, index }) {
  return (
    <article className={`project-card ${project.visual}`}>
      <div className="project-visual"><div className="project-visual-grid" /><span className="project-orbit" /><span className="project-mark" aria-hidden="true">{project.mark}</span><span className="project-count">0{index + 1} / 03</span><span className="visual-label">{project.eyebrow}</span></div>
      <div className="project-content"><div className="project-title-row"><h3>{project.title}</h3><span className="project-arrow" aria-hidden="true">↗</span></div><p>{project.description}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links"><span className="project-placeholder" aria-label="Project link placeholder"><span className="placeholder-dot" /> {project.status}</span><span className="project-availability">LINKS TO BE ADDED</span></div></div>
    </article>
  )
}

function RepositoryCard({ repository }) {
  return (
    <article className="repository-card">
      <div className="repository-card-top"><span className="repository-mark" aria-hidden="true">⌘</span><span className="repository-type">PUBLIC REPOSITORY</span></div>
      <h3>{repository.name}</h3>
      <a className="repository-link" href={repository.html_url} target="_blank" rel="noreferrer">View on GitHub <span aria-hidden="true">↗</span></a>
      <div className="repository-meta"><span><span className="star-icon" aria-hidden="true">☆</span> {repository.stargazers_count} {repository.stargazers_count === 1 ? 'star' : 'stars'}</span><span className="repository-language">{repository.language || 'Repository'}</span></div>
    </article>
  )
}

function Projects({ projects = [], githubUsername }) {
  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(Boolean(githubUsername))
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!githubUsername) {
      setLoading(false)
      setError('Add your GitHub username to load your public repositories.')
      return undefined
    }

    const controller = new AbortController()
    async function fetchRepositories() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?type=public&sort=updated&per_page=100`, { signal: controller.signal })
        if (!response.ok) throw new Error(response.status === 404 ? 'That GitHub user could not be found.' : `GitHub returned an error (${response.status}).`)
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error('GitHub returned an unexpected response.')
        setRepositories(data)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message || 'Could not load repositories. Please try again.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchRepositories()
    return () => controller.abort()
  }, [githubUsername, retryCount])

  const filteredRepositories = useMemo(() => repositories.filter((repository) => repository.name.toLowerCase().includes(search.trim().toLowerCase())), [repositories, search])

  if (!githubUsername) {
    return <section className="section-shell content-section projects-section" id="projects"><div className="section-heading projects-heading"><div><p className="eyebrow"><span className="heading-index">03</span> SELECTED WORK</p><h2>Small steps.<br /><span>Meaningful builds.</span></h2></div><p className="section-subtitle">A few ideas in progress, shaped by curiosity and the things I’m learning.</p></div><div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</div></section>
  }

  return (
    <section className="section-shell content-section projects-section" id="projects">
      <div className="section-heading projects-heading"><div><p className="eyebrow"><span className="heading-index">03</span> PRACTICAL 3 · REST API</p><h2>Projects from<br /><span>GitHub.</span></h2></div><p className="section-subtitle">A live look at public repositories from <a className="github-profile-link" href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer">@{githubUsername} ↗</a></p></div>
      <div className="repository-toolbar"><label className="repository-search"><span aria-hidden="true">⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search repositories by name" aria-label="Search repositories by name" /></label><span className="repository-count">{loading ? 'SYNCING REPOSITORIES' : `${filteredRepositories.length} ${filteredRepositories.length === 1 ? 'REPOSITORY' : 'REPOSITORIES'}`}</span></div>
      {loading ? <Spinner label="Loading public repositories" /> : error ? <ErrorMessage message={error} onRetry={() => setRetryCount((count) => count + 1)} /> : filteredRepositories.length ? <div className="repository-grid">{filteredRepositories.map((repository) => <RepositoryCard key={repository.id} repository={repository} />)}</div> : <div className="repository-empty"><span className="empty-mark" aria-hidden="true">⌕</span><h3>No repositories found</h3><p>{repositories.length ? 'Try a different search term.' : 'This GitHub profile has no public repositories yet.'}</p></div>}
    </section>
  )
}

export default Projects
