import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import "../index.css";

const HeroCarousel = () => {
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBlurred(true), 4000); // slow reveal
    return () => clearTimeout(t);
  }, []);

  const videos = [
    "/videos/clip1.mp4",
    "/videos/clip2.mp4",
    "/videos/clip3.mp4",
    "/videos/clip4.mp4",
    "/videos/clip5.mp4",
  ];

  return (
    <div className={`hero-marquee ${blurred ? "blurred" : ""}`}>
      <Marquee speed={25} gradient={false} pauseOnHover={false} autoFill>
        {videos.map((src, i) => (
          <div key={i} className="marquee-card">
            <video src={src} autoPlay loop muted playsInline preload="auto" className="marquee-video" />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default HeroCarousel;






