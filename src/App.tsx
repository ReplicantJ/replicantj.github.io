import { ReactiveField } from './components/ReactiveField'

export default function App() {
  return (
    <>
      <header className="site-header">
        <span className="mark">◆</span>
        <span className="wordmark">Studio</span>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">MVP</p>
          <h1 id="hero-title" className="hero-title">
            Clarity
            <br />
            <span className="hero-muted">in motion</span>
          </h1>
          <p className="lede">
            A minimal static shell ready for GitHub Pages and your Squarespace DNS. Replace
            this copy when you are ready to launch.
          </p>
        </section>

        <ReactiveField />

        <section className="footer-band" aria-label="Colophon">
          <p>Built with Vite and React. Deploy on push to <code>main</code>.</p>
        </section>
      </main>
    </>
  )
}
