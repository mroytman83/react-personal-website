import React, { useEffect, useState } from "react";
import "../index.css";

const IntroOverlay = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 17000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`overlay ${visible ? "show" : ""}`}>
      <div className="overlay-box">
        <h1>Hi, I'm Michael</h1>
        <p>I like coding and being active </p>
      </div>
    </div>
  );
};

export default IntroOverlay;

