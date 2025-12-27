import React from "react";
import "../index.css";
import { FiGithub, FiLinkedin} from "react-icons/fi";


const socialLinks = [
  {
    id: 1,
    icon: <FiGithub />,
    url: "https://github.com/mroytman83",
    label: "GitHub",
  },
  {
    id: 2,
    icon: <FiLinkedin />,
    url: "https://www.linkedin.com/in/michael-j-roytman",
    label: "LinkedIn",
  },
];
 
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-divider" />
      <div className="footer-inner">
        <p className="footer-title">My Socials</p>

        <ul className="footer-socials">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            </li>
          ))}
        </ul>

        <p className="footer-copy">
          © {new Date().getFullYear()} Michael Roytman
        </p>
      </div>
    </footer>
  );
}

export default Footer;
