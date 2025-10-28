import React, { useEffect, useState } from "react";
import "../index.css";

const IntroOverlay = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 4000); // match blur
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <div className={`overlay ${visible ? "show" : ""}`}>
      <div className="overlay-box">
        <h1>Hi, I'm Michael</h1>
        <p>Traveler • Programmer • Athlete • Polyglot</p>
      </div>
    </div>
  );
};

export default IntroOverlay;

