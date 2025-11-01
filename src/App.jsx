import React, { useState, useEffect } from "react";
import HeroCarousel from "./components/HeroCarousel";
import IntroOverlay from "./components/IntroOverlay";
import Navbar from "./components/Navbar";
import BlogLoader from "./components/BlogLoader"; // 👈 new
import "./index.css";

export default function App() {
  const [section, setSection] = useState("about");

  // smooth scroll only when switching, not on initial load
  useEffect(() => {
    if (section !== "about") {
      const el = document.getElementById("content-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [section]);

  const renderBody = () => {
    switch (section) {
      case "projects":
        return (
          <>
            <h2>Projects</h2>

            <p>
              <strong>Knoweo — Streamlit, Flask, AWS EC2, Whisper, HuggingFace</strong><br />
              AI tool that converts course materials into short-form videos using diffusion,
              TTS, and LLMs on AWS; Alumni Award, Transcend 2024.
            </p>

            <p>
              <strong>CNBC Finance Articles Data — Selenium, GitHub Actions</strong><br />
              Continuously updated JSON dataset of ~2.6k CNBC finance articles since Nov 2023
              for research/education.
            </p>

            <p>
              <strong>Hold on to Data — YOLOv8, PyTorch, RoboFlow</strong><br />
              Evaluated data augmentation for improving rock-climbing hold detection with YOLOv8.
            </p>

            <p>
              <strong>Personal Portfolio — Node.js, Express, LangChain, Faiss</strong><br />
              Website with SMTP contact form and a LangChain RAG chatbot using PubMed articles.
            </p>
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
              Posts rendered directly from <code>/src/posts</code> using Markdown.
            </p>
            <div id="blog-container"></div>
          </>
        );

      default:
        return (
          <>
            <h2>About Me</h2>
            <p>
              Software developer and data engineer passionate about building elegant, scalable systems.
              Experienced across data modeling, backend engineering, and creative AI tools.
            </p>
          </>
        );
    }
  };

  return (
    <>
      <Navbar onSelect={setSection} />

      <main>
        <section className="hero-section">
          <HeroCarousel />
          <IntroOverlay />
        </section>

        <section id="content-card" className="card fade-in visible">
          {renderBody()}
        </section>

        {/* Only load blog markdowns when in Blog view */}
        {section === "blog" && <BlogLoader />}
      </main>
    </>
  );
}


