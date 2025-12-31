import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroCarousel from "./components/HeroCarousel";
import IntroOverlay from "./components/IntroOverlay";
import Navbar from "./components/Navbar";
import ClippyAgent from "./components/ClippyAgent";
import BlogLoader from "./components/BlogLoader";
import Footer from "./components/Footer";
import ShowcaseHover from "./components/ShowcaseHover";
import "./index.css";

export default function App() {
  const [section, setSection] = useState("about");
  const bodyRef = useRef(null);
  const isAnimatingRef = useRef(false);

  
  useEffect(() => {
    if (section !== "about") {
      const el = document.getElementById("content-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [section]);

  const handleSelect = (next) => {
    if (next === section) return;

    const el = bodyRef.current;
    if (!el) {
      setSection(next);
      return;
    }

    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // OUT -> SWAP -> IN
    gsap
      .timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      })
      .to(el, {
        autoAlpha: 0,
        y: -10,
        filter: "blur(6px)",
        duration: 0.18,
        overwrite: true,
      })
      .add(() => setSection(next))
      .to(el, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.28,
        clearProps: "filter",
      });
  };

  const renderBody = () => {
    switch (section) {
      case "projects":
        return (
          <>
            <h2>Projects</h2>
            <p>Hover over the title of the project or tap if on mobile, to see a preview.</p>
            <ShowcaseHover />
          </>
          );

      case "experience":
        return (
          <>
            <h2>Experience</h2>

            <p>
              <strong>Cognite — Data Engineer (May 2025 – Present)</strong><br />
              Building large-scale data models and automation pipelines in Cognite Data Fusion.
            </p>

            <p>
              <strong>Dow Chemical Company — Software Developer (Feb 2024 – Apr 2025)</strong><br />
              Deployed Shiny web apps, automated upgrades for 20+ apps, and built session
              tracking for analytics.
            </p>

            <p>
              <strong>Cardinal Trading Group — Co-Founder & Principal Data Scientist (Sep 2022 – Dec 2023)</strong><br />
              Co-founded a student-run quant fund and created automated trading and NLP research
              systems.
            </p>

            <p>
              <strong>Equity Residential — Data Science Intern (Jun 2023 – Aug 2023)</strong><br />
              Built NL→SQL agents for Snowflake and automated property data analysis pipelines.
            </p>
          </>
        );

      case "blog":
        return (
          <>
            <h2>Blog</h2>
            <p style={{ marginBottom: "1rem" }}>
              Just sharing my thoughts on existence once in a while
            </p>
            <div id="blog-container"></div>
          </>
        );

      default:
        return (
          <>
            <h2>About Me</h2>
            <p>
              Software developer passionate about building elegant and scalable data-centric systems.
              Experienced across data modeling, backend engineering, and creative AI tools.
              <br/><br/>
              Outside of work, I spend time on strength and movement training, and slow things down by exploring the outdoors, traveling, and learning languages.
            </p>
          </>
        );
    }
  };

  return (
    <>
      <Navbar onSelect={handleSelect} />

      <div className="page">
        <main>
          <section className="hero-section">
            <HeroCarousel />
            <IntroOverlay />
          </section>

          <section id="content-card" className="card fade-in visible">
            {/* Wrap just the swappable content */}
            <div ref={bodyRef}>
              {renderBody()}
            </div>
          </section>

          {/* BlogLoader stays tied to section (works fine) */}
          {section === "blog" && <BlogLoader />}

          {process.env.REACT_APP_MY_VAR && <ClippyAgent />}
        </main>

        <Footer />
      </div>
    </>
  );
}



