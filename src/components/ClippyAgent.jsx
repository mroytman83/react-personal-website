import { useEffect, useRef } from "react";
import { initAgent } from "clippyjs";
import Merlin from "clippyjs/agents/merlin";

function muteSounds(agent) {
  if (!agent._animator) return;
  agent._animator._sounds = {};
  agent._animator._playSound = () => {};
}

export default function ClippyAgent({ onUnlock }) {
  const triesRef = useRef(0);
  const dismissedRef = useRef(false);
  const timersRef = useRef([]);

  const clearPendingTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const scheduleTimer = (fn, delay) => {
    const id = setTimeout(() => {
      timersRef.current = timersRef.current.filter((timerId) => timerId !== id);
      fn();
    }, delay);
    timersRef.current.push(id);
    return id;
  };

  const dismissMerlin = (agent) => {
    dismissedRef.current = true;
    clearPendingTimers();
    const message = "Coward! You dare not answer?";
    if (!agent.play("GestureDown")) agent.animate();
    agent.speak(message);

    const speechMs = message.split(/\s+/).length * 200 + 2000;
    scheduleTimer(() => {
      agent.hide(false, () => agent.dispose());
    }, speechMs + 500);
  };

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

      sphinx += changed_alphabet[proper_alphabet_dict[letter]];
    }

    return sphinx;
  }

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) {
      console.log("Skipping Clippy on mobile (audio autoplay is blocked).");
      return;
    }

    // random delay between 1–3 minutes
    const randomDelay = Math.floor(Math.random() * (180000 - 60000 + 1)) + 60000;
    // const randomDelay = 100;

    let loadedAgent = null;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        loadedAgent = await initAgent(Merlin);
        if (cancelled || dismissedRef.current) {
          loadedAgent.dispose();
          return;
        }

        muteSounds(loadedAgent);
        loadedAgent.show();

        const x = window.innerWidth - 200;
        const y = window.innerHeight - 250;
        loadedAgent.moveTo(x, y);

        const cipher = generateQuestion();
        const greetings = [
          "Greetings, traveler. I bring you a puzzle.",
          "Ah, we meet again. I have a challenge for you.",
          "Hark! A cipher awaits your keen mind.",
        ];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        loadedAgent.speak(`${greeting} Solve this ciphered question: ${cipher}`);

        scheduleTimer(() => {
          if (!dismissedRef.current) ask(loadedAgent, cipher);
        }, 10000);
      } catch (err) {
        console.warn("Failed to load ClippyJS", err);
      }
    }, randomDelay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearPendingTimers();
      loadedAgent?.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time mount init
  }, []);

  const ask = (a, cipher) => {
    if (dismissedRef.current) return;

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
      dismissMerlin(a);
    };
    cancel.onclick = handleCancel;

    submit.onclick = () => {
      const answer = input.value.trim().toLowerCase();
      const correct = (process.env.REACT_APP_SPHINX_ANSW || "").toLowerCase();

      if (!answer) return;
      closeModal();

      if (answer === correct) {
        onUnlock?.();
        a.speak("Correct! You are wise indeed.");
        a.animate();
        a.hide();
      } else {
        const newTries = triesRef.current + 1;
        triesRef.current = newTries;

        if (newTries >= 3) {
          dismissedRef.current = true;
          clearPendingTimers();
          a.speak("Foolish mortal. Farewell!");
          a.play("GetAttention");
          a.hide(false, () => a.dispose());
        } else {
          if (newTries === 1) {
            a.speak("Wrong! Try again... Here's a hint: it's a Caesar cipher.");
          } else if (newTries === 2) {
            a.speak("Wrong again! Hint two: check your browser console — I logged something useful.");
          } else {
            a.speak("Wrong! Try again...");
          }

          scheduleTimer(() => {
            if (dismissedRef.current) return;
            a.speak(`Solve this ciphered question: ${cipher}`);
            scheduleTimer(() => {
              if (!dismissedRef.current) ask(a, cipher);
            }, 10000);
          }, 8000);
        }
      }
    };
  };

  return null;
}
