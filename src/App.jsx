import React from 'react'
import HeroCarousel from './components/HeroCarousel'
import IntroOverlay from './components/IntroOverlay'
import Navbar from './components/Navbar'
import './index.css'

export default function App() {
  return (
    <main>
      <section className="hero-section">
        <HeroCarousel />
        <IntroOverlay />
      </section>

      <div className="layout">
        <Navbar />
        <section id="about" className="about-section">
          <h2>About Me</h2>
          <p>
            Software developer with a love for data, travel, and building elegant systems.
          </p>
      </section>
      </div>
    </main>
  )
}
