import React from "react";
import "../index.css";

export default function Navbar({ onSelect }) {
  return (
    <nav className="sidebar-fixed">
      <ul>
        <li><button className="navlink" onClick={() => onSelect("about")}>About Me</button></li>
        <li><button className="navlink" onClick={() => onSelect("projects")}>Projects</button></li>
        <li><button className="navlink" onClick={() => onSelect("experience")}>Experience</button></li>
        <li><button className="navlink" onClick={() => onSelect("blog")}>Blog</button></li>
      </ul>
    </nav>
  );
}
