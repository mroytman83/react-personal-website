import React, { useState, useEffect } from "react";
import HeroCarousel from "./components/HeroCarousel";
import IntroOverlay from "./components/IntroOverlay";
import Navbar from "./components/Navbar";
import "./index.css";

export default function App() {
  const [section, setSection] = useState("about");

  useEffect(() => {
    // smooth focus on the card when switching
    const el = document.getElementById("content-card");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [section]);

  const renderBody = () => {
    if (section === "projects")
      return (
        <>
          <h2>Projects</h2>
          <p><strong>Knoweo — Streamlit, Flask, AWS EC2, Whisper, HuggingFace</strong><br/>
          AI tool that converts course materials into short-form videos using diffusion, TTS, and LLMs on AWS; Alumni Award, Transcend 2024.</p>

          <p><strong>CNBC Finance Articles Data — Selenium, GitHub Actions</strong><br/>
          Continuously updated JSON dataset of ~2.6k CNBC finance articles since Nov 2023 for research/education.</p>

          <p><strong>Hold on to Data — YOLOv8, PyTorch, RoboFlow</strong><br/>
          Evaluated data augmentation for improving rock-climbing hold detection with YOLOv8.</p>

          <p><strong>Personal Portfolio — Node.js, Express, LangChain, Faiss</strong><br/>
          Website with SMTP contact form and a LangChain RAG chatbot using PubMed articles.</p>
        </>
      );

    if (section === "experience")
      return (
        <>
          <h2>Experience</h2>


          <p><strong>Cognite — Data Engineer (May 2025 – )</strong><br/></p>

          <p><strong>Dow Chemical Company — Software Developer (Feb 2024 – April 2025)</strong><br/></p>

          <p><strong>Cardinal Trading Group — Co-Founder & Principal Data Scientist (Sep 2022 – Dec 2023)</strong><br/></p>

          <p><strong>Equity Residential — Data Science Intern (Jun 2023 – Aug 2023)</strong><br/></p>
        </>
      );

    return (
      <>
        <h2>About Me</h2>
        <p>Software developer with a love for data, travel, and building elegant systems.</p>
      </>
    );
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
      </main>
    </>
  );
}

