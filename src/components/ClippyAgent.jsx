import { useEffect, useState } from "react";

export default function ClippyAgent() {
  const [agent, setAgent] = useState(null);
  const [tries, setTries] = useState(0);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(true);

  function generateQuestion() {
    const question = (process.env.REACT_APP_MY_VAR || "").toLowerCase();
    const min = 1,
      max = 25;
    const shift_value = Math.floor(Math.random() * (max - min + 1)) + min;

    const alphabet = [..."abcdefghijklmnopqrstuvwxyz"];
    const proper_alphabet_dict = {};
    const changed_alphabet = [
      ...("abcdefghijklmnopqrstuvwxyz".substr(shift_value) +
        "abcdefghijklmnopqrstuvwxyz".substr(0, shift_value)),
    ];

    console.log(shift_value);

    for (let i = 0; i < alphabet.length; i++) {
      proper_alphabet_dict[alphabet[i]] = i;
    }

    let sphinx = "";
    for (let letter of question) {
      // preserve spaces or punctuation
      if (!/^[a-z]$/.test(letter)) {
        sphinx += letter;
        continue;
      }

      let shifted_index = proper_alphabet_dict[letter] + shift_value;
      if (shifted_index >= 26) {
        sphinx += changed_alphabet[shifted_index - 26];
      } else {
        sphinx += changed_alphabet[shifted_index];
      }
    }

    return sphinx;
  }

  useEffect(() => {
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      console.log("Skipping Clippy on mobile (audio autoplay is blocked).");
      return;
    }

    // random delay between 1–3 minutes
    const randomDelay =  Math.floor(Math.random() * (180000 - 60000 + 1)) + 60000;

    const timer = setTimeout(() => {
      if (!window.clippy) return console.warn("⚠️ ClippyJS not loaded");

      window.CLIPPY_CDN =
        "https://cdn.jsdelivr.net/gh/pi0/clippyjs@master/assets/agents/";

      window.clippy.load("Merlin", (a) => {
        a._playSound = () => Promise.resolve(); 
        a.play = () => {};                      
        a._sounds = {};

        a.show();

        const x = window.innerWidth - 200;
        const y = window.innerHeight - 250;
        a.moveTo(x, y);

        setAgent(a);
        setActive(true);

        const cipher = generateQuestion();

        // random greetings
        const greetings = [
          "Greetings, traveler. I bring you a puzzle.",
          "Ah, we meet again. I have a challenge for you.",
          "Hark! A cipher awaits your keen mind.",
        ];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        a.speak(`${greeting} Solve this ciphered question: ${cipher}`);

        // keep Clippy showing the cipher longer before prompting
        setTimeout(() => ask(a, cipher), 10000);
      });
    }, randomDelay);

    return () => clearTimeout(timer);
  }, []);

  const ask = (a, cipher) => {
    if (!visible) return;

    const modal = document.createElement("div");
    modal.className = "clippy-modal";
    modal.innerHTML = `
      <div class="clippy-dialog">
        <h3>Clippy's Challenge </h3>
        <p>Enter your answer to the following ciphered question: <strong>${cipher}</strong></p>
        <small><i>All lowercase, with spaces preserved</i></small><br><br>
        <input type="text" id="clippy-input" placeholder="Type here..." />
        <div class="clippy-buttons">
          <button id="clippy-submit">Submit</button>
          <button id="clippy-cancel">Quit</button>
        </div>
      </div>
    `;

    Object.assign(modal.style, {
      position: "fixed",
      inset: 0,
      background: "rgba(255,255,255,0.08)", 
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    });

    const dialog = modal.querySelector(".clippy-dialog");
    Object.assign(dialog.style, {
      background: "#ffffffd0",
      borderRadius: "12px",
      padding: "2rem 2.5rem",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      maxWidth: "360px",
      width: "90%",
      fontFamily: "Inter, sans-serif",
    });

    document.body.appendChild(modal);

    const input = modal.querySelector("#clippy-input");
    const submit = modal.querySelector("#clippy-submit");
    const cancel = modal.querySelector("#clippy-cancel");
    input.focus();

    const closeModal = () => modal.remove();

    const handleCancel = () => {
      closeModal();
      a.play("GestureDown");
      a.speak("Coward! You dare not answer?");
      setTimeout(() => {
        a.hide();
        setActive(false);
        setVisible(false);
      }, 2000);
    };
    cancel.onclick = handleCancel;

    submit.onclick = () => {
      const answer = input.value.trim().toLowerCase();
      const correct = (process.env.REACT_APP_SPHINX_ANSW || "").toLowerCase();

      if (!answer) return;
      closeModal();

      if (answer === correct) {
        a.speak("Correct! You are wise indeed.");
        a.animate();
        a.hide();
      } else {
        const newTries = tries + 1;
        setTries(newTries);

        if (newTries >= 3) {
          a.speak("Foolish mortal. Farewell!");
          a.play("GetAttention");
          setTimeout(() => {
            a.hide();
            setActive(false);
            setVisible(false);
          }, 2500);
        } else {
          // progressive hints
          if (newTries === 1) {
            a.speak("Wrong! Try again... Here's a hint: it's a Caesar cipher.");
          } else if (newTries === 2) {
            a.speak("Wrong again! Hint two: check your browser console — I logged something useful.");
          } else {
            a.speak("Wrong! Try again...");
          }

          // re-ask after hint
          setTimeout(() => {
            a.speak(`Solve this ciphered question: ${cipher}`);
            setTimeout(() => ask(a, cipher), 10000);
          }, 8000);
        }
      }
    };
  };

  return null;
}




