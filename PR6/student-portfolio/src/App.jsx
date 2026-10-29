import { Link, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Tasks from './components/Tasks.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import NotFound from './components/NotFound.jsx'

const skillList = [
  { title: 'Programming', icon: '</>', items: ['C++', 'Python', 'JavaScript'] },
  { title: 'Frontend', icon: '◈', items: ['HTML', 'CSS', 'React'] },
  { title: 'Data & AI', icon: '⌘', items: ['Python-based data analysis', 'Machine learning fundamentals'] },
  { title: 'Tools', icon: '⌁', items: ['Git', 'GitHub', 'VS Code'] },
]

const projects = [
  {
    title: 'Elixora', eyebrow: 'AI · HEALTHCARE', description: 'An AI-assisted healthcare project exploring how thoughtful technology can support better experiences.', tags: ['AI / ML', 'Healthcare'], visual: 'elixora', mark: '✳', status: 'Project details coming soon',
  },
  {
    title: 'CareerViewX', eyebrow: 'CAREER · ANALYTICS', description: 'A career analytics and insights project built around making information easier to explore.', tags: ['Analytics', 'Data'], visual: 'career', mark: '↗', status: 'Project details coming soon',
  },
  {
    title: 'Student Portfolio', eyebrow: 'WEB · PERSONAL', description: 'A personal space to share what I’m learning, the projects I’m building, and where I’m headed.', tags: ['React', 'CSS', 'Vite'], visual: 'portfolio', mark: '⌘', status: 'You’re here',
  },
]

function HomePage() {
  return (
    <>
      <main>
        <section className="hero section-shell" id="home">
          <div className="hero-orb orb-one" aria-hidden="true" />
          <div className="hero-orb orb-two" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow availability"><span className="status-dot" /> Engineering Student <span className="eyebrow-separator">|</span> Exploring AI &amp; ML</p>
            <h1>Turning ideas into <span>intelligent</span> experiences.</h1>
            <p className="hero-description">I’m <strong>Priya Kheni</strong>, an engineering student curious about AI, machine learning, data science, and building useful things for the web.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/projects">Explore my work <span aria-hidden="true">↗</span></Link>
              <Link className="button button-quiet" to="/contact">Let’s connect <span aria-hidden="true">→</span></Link>
            </div>
            <div className="hero-note"><span className="note-line" /> Curious by nature. Building as I learn.</div>
          </div>
          <div className="hero-art" aria-label="Abstract illustration of a connected digital network" role="img">
            <div className="art-grid" />
            <div className="orbit orbit-outer" /><div className="orbit orbit-inner" />
            <span className="node node-a" /><span className="node node-b" /><span className="node node-c" /><span className="node node-d" />
            <div className="core"><span className="core-glyph">✳</span><span className="core-label">IDEAS → INTELLIGENCE</span></div>
            <div className="art-caption"><span className="caption-dot" /> SYSTEMS THINKING <span className="caption-divider">/</span> HUMAN FIRST</div>
            <div className="floating-chip chip-top"><span>01</span> LEARN</div>
            <div className="floating-chip chip-bottom"><span>02</span> BUILD</div>
          </div>
          <a className="scroll-cue" href="#about"><span className="scroll-wheel" /> Scroll to explore</a>
        </section>
        <About />
        <Skills skillList={skillList} />
        <Projects projects={projects} />
        <Education />
        <Contact />
      </main>
    </>
  )
}

function ProjectsPage() {
  return <Tasks />
}

function ContactPage() {
  return <main className="route-page"><Contact /></main>
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
