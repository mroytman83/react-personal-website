import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../index.css";

const HeroCarousel = () => {
  const videos = [
    "/videos/clip1.mp4",
    "/videos/clip2.mp4",
    "/videos/clip3.mp4",
    "/videos/clip4.mp4",
    "/videos/clip5.mp4",
  ];

  return (
    <div className="hero-carousel">
      <Carousel
        autoPlay
        infiniteLoop
        interval={3000}
        transitionTime={800}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        showArrows={false}
        swipeable={false}
        stopOnHover={false}
      >
        {videos.map((src, i) => (
          <div key={i} className="carousel-card">
            <video
              src={src}
              loop={true}
              muted={true}
              autoPlay={true}
              playsInline={true}
              preload="metadata"
              className="carousel-video"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;




