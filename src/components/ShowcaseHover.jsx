// ShowcaseHover.jsx
import React, { useEffect, useState } from "react";
import "../index.css";

export default function ShowcaseHover() {
  const [activeId, setActiveId] = useState(null);
  const [canHover, setCanHover] = useState(true);


  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);

    const handler = (e) => setCanHover(e.matches);


    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const projects = [
    {
      id: "mma",
      title:
        "Live MMA Tracking Analytics — YOLOv8, DeepSORT, Kafka, Docker, Flask, D3.js",
      desc:
        "Real-time fight tracking and streaming analytics with per-frame action detection and a live dashboard.",
      gif: "/code_gifs/mma.gif",
    },
    {
      id: "knoweo",
      title: "Knoweo — Streamlit, Flask, AWS EC2, Whisper, HuggingFace",
      desc:
        "AI tool that converts course materials into short-form videos using diffusion, TTS, and LLMs on AWS; Alumni Award, Transcend 2024.",
      gif: "/code_gifs/knoweo.gif",
    },
    {
      id: "cnbc",
      title: "CNBC Finance Articles Data — Selenium, GitHub Actions",
      desc:
        "Continuously updated JSON dataset of ~2.6k CNBC finance articles since Nov 2023 for research/education.",
      gif: "/code_gifs/cnbc.gif",
    },
    {
      id: "climbing",
      title: "Hold on to Data — YOLOv8, PyTorch, RoboFlow",
      desc:
        "Evaluated data augmentation for improving rock-climbing hold detection with YOLOv8.",
      gif: "/code_gifs/climbing.gif",
    },
  ];

  const showGif = (id) => setActiveId(id);
  const hideGif = () => setActiveId(null);
  const toggleGif = (id) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <>
      {projects.map((p) => (
        <p key={p.id} className="project">
          <strong
            className="project-title"

            onMouseEnter={canHover ? () => showGif(p.id) : undefined}
            onMouseLeave={canHover ? hideGif : undefined}

            onClick={!canHover ? () => toggleGif(p.id) : undefined}

            role={!canHover ? "button" : undefined}
            tabIndex={!canHover ? 0 : undefined}
            onKeyDown={
              !canHover
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") toggleGif(p.id);
                    if (e.key === "Escape") hideGif();
                  }
                : undefined
            }
          >
            {p.title}

            {p.gif && activeId === p.id && (
              <img
                src={p.gif}
                alt=""
                aria-hidden="true"
                className="project-gif"
                loading="lazy"
              />
            )}
          </strong> 

          <br />
          {p.desc}
        </p>
      ))}
    </>
  );
}

