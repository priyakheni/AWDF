import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="site-footer"><Link className="footer-brand" to="/"><span className="brand-mark">P<span>.</span></span><span>MADE WITH CURIOSITY</span></Link><nav aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/projects">Projects</Link><Link to="/contact">Contact</Link></nav><span className="copyright">© {currentYear} Priya Kheni</span><Link className="back-top" to="/" aria-label="Back to home">↑</Link></footer>
  )
}

export default Footer
