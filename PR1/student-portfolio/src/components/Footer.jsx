const currentYear = new Date().getFullYear()

function Footer({ navigation }) {
  return (
    <footer className="site-footer"><a className="footer-brand" href="#home"><span className="brand-mark">P<span>.</span></span><span>MADE WITH CURIOSITY</span></a><nav aria-label="Footer navigation">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><span className="copyright">© {currentYear} Priya Kheni</span><a className="back-top" href="#home" aria-label="Back to top">↑</a></footer>
  )
}

export default Footer
