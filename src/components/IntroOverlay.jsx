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
        <p>Jack of a few trades.
          <br></br>
          Master of making them work together.</p>
      </div>
    </div>
  );
};

export default IntroOverlay;

