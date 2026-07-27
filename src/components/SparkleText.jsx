// sourced from https://www.cssscript.com/star-sparkle-text/


import { useEffect, useRef } from "react";

const MAX_STARS = 25;
const STAR_INTERVAL = 16;
const MAX_STAR_LIFE = 2.5;
const MIN_STAR_LIFE = 0.8;
const MAX_STAR_SIZE = 24;
const MIN_STAR_SIZE = 10;
const MIN_STAR_TRAVEL_X = 40;
const MIN_STAR_TRAVEL_Y = 30;

const MONO_COLORS = ["#111", "#444", "#666", "#888", "rgba(17,17,17,0.35)"];

function random(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomMinus() {
  return Math.random() > 0.5 ? 1 : -1;
}

function randomMonoColor() {
  return MONO_COLORS[random(MONO_COLORS.length - 1, 0)];
}

function createStar(container) {
  const size = random(MAX_STAR_SIZE, MIN_STAR_SIZE);
  const x = random(container.offsetWidth * 0.75, container.offsetWidth * 0.25);
  const y = container.offsetHeight / 2 - size / 2;
  const xDir = randomMinus();
  const yDir = randomMinus();
  const xMaxTravel = xDir === -1 ? x : container.offsetWidth - x - size;
  const yMaxTravel = container.offsetHeight / 2 - size;
  const xTravel = random(xMaxTravel, MIN_STAR_TRAVEL_X);
  const yTravel = random(yMaxTravel, MIN_STAR_TRAVEL_Y);
  const xEnd = x + xTravel * xDir;
  const yEnd = y + yTravel * yDir;
  const life = random(MAX_STAR_LIFE * 10, MIN_STAR_LIFE * 10) / 10;

  const el = document.createElement("div");
  el.className = "sparkle-text__star";
  el.style.setProperty("--start-left", `${x}px`);
  el.style.setProperty("--start-top", `${y}px`);
  el.style.setProperty("--end-left", `${xEnd}px`);
  el.style.setProperty("--end-top", `${yEnd}px`);
  el.style.setProperty("--star-life", `${life}s`);
  el.style.setProperty("--star-life-num", String(life));
  el.style.setProperty("--star-size", `${size}px`);
  el.style.setProperty("--star-color", randomMonoColor());

  container.appendChild(el);

  const timeout = setTimeout(() => {
    el.remove();
  }, life * 1000);

  return {
    life,
    dispose: () => {
      clearTimeout(timeout);
      el.remove();
    },
  };
}

export default function SparkleText({ children, active, className = "" }) {
  const containerRef = useRef(null);
  const starCountRef = useRef(0);
  const pendingStarsRef = useRef([]);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const interval = setInterval(() => {
      if (starCountRef.current >= MAX_STARS) return;

      starCountRef.current++;
      const star = createStar(container);
      pendingStarsRef.current.push(star);

      setTimeout(() => {
        starCountRef.current--;
        pendingStarsRef.current = pendingStarsRef.current.filter((s) => s !== star);
      }, star.life * 1000);
    }, STAR_INTERVAL);

    return () => {
      clearInterval(interval);
      pendingStarsRef.current.forEach((s) => s.dispose());
      pendingStarsRef.current = [];
      starCountRef.current = 0;
      container.querySelectorAll(".sparkle-text__star").forEach((node) => node.remove());
    };
  }, [active]);

  return (
    <span
      ref={containerRef}
      className={`sparkle-text ${active ? "sparkle-text--active" : ""} ${className}`.trim()}
    >
      <span className="sparkle-text__label">{children}</span>
    </span>
  );
}
