import { useState } from "react";
import "./App.css";

const missions = [
  { icon: "🏠", title: "Home" },
  { icon: "🔎", title: "Spot Fake Websites" },
  { icon: "🧩", title: "Collect the Clues" },
  { icon: "🛡️", title: "Website Lab" },
  { icon: "🎯", title: "Detective Challenge" },
  { icon: "💡", title: "What Would You Do?" },
  { icon: "🏆", title: "My Achievements" },
  { icon: "⭐", title: "About the Project" },
];

const clues = [
  {
    icon: "🔗",
    title: "Check the URL",
    color: "cyan",
    text: "Fake websites may use misspellings, extra words, or strange addresses.",
    example: "Example: amaz0n instead of amazon",
    tip: "Read the address carefully before trusting a website.",
  },
  {
    icon: "🎁",
    title: "Unbelievable Prizes",
    color: "orange",
    text: "Messages promising free phones or huge prizes may be tricks.",
    example: "Example: You won a FREE phone! Click now!",
    tip: "Stop and ask a trusted adult before clicking.",
  },
  {
    icon: "🔐",
    title: "Secret Information",
    color: "purple",
    text: "Suspicious websites may ask for passwords or verification codes.",
    example: "Example: Enter your password to claim a prize.",
    tip: "Never share your password or verification codes.",
  },
  {
    icon: "⚠️",
    title: "Urgent Warnings",
    color: "pink",
    text: "Scammers may scare you into acting quickly without thinking.",
    example: "Example: Your account will close in 2 minutes!",
    tip: "Pause. Do not let scary messages rush you.",
  },
];

const websites = [
  {
    id: 1,
    name: "Prize Planet",
    address: "prize-planet.example",
    icon: "🎁",
    safe: false,
    description: "CONGRATULATIONS! You won a FREE tablet!",
    clues: [
      "A prize you did not enter to win",
      "Asks for personal information",
      "Pressures you to act quickly",
    ],
  },
  {
    id: 2,
    name: "Friendly Library",
    address: "library.example",
    icon: "📚",
    safe: true,
    description: "Explore books, stories, and reading activities.",
    clues: [
      "The address matches the displayed organization",
      "No unexpected prize or urgent threat",
      "Does not ask for your password to browse",
    ],
  },
  {
    id: 3,
    name: "Game Bonus",
    address: "free-game-bonus.example",
    icon: "🎮",
    safe: false,
    description: "Get unlimited coins! Enter your password now!",
    clues: [
      "Requests a password for a free reward",
      "Makes an unrealistic promise",
      "Uses pressure to make you act",
    ],
  },
  {
    id: 4,
    name: "School Learning Hub",
    address: "learning.example",
    icon: "🎓",
    safe: true,
    description: "Read lessons and practice your school skills.",
    clues: [
      "Clear educational purpose",
      "No suspicious prize message",
      "No unexpected request for secret information",
    ],
  },
];

const quizQuestions = [
  {
    question:
      "A website says you won a phone you never entered to win. What should you do?",
    options: [
      "Click immediately",
      "Ask a trusted adult and do not click",
      "Enter your password",
    ],
    correct: 1,
    explanation:
      "Unexpected prizes are a common warning sign. Stop and ask a trusted adult.",
  },
  {
    question:
      "What should you do if a website asks for your password to claim a prize?",
    options: [
      "Share the password",
      "Use your friend's password",
      "Do not share it and leave the site",
    ],
    correct: 2,
    explanation:
      "Your password is secret. Never share it to claim a prize.",
  },
  {
    question: "Which website address deserves extra attention?",
    options: [
      "An address with misspellings or strange extra words",
      "An address you checked with a trusted adult",
      "A school website you reached from a known source",
    ],
    correct: 0,
    explanation:
      "Misspellings and unusual addresses can be warning signs. Check carefully.",
  },
  {
    question:
      "A pop-up says your account will close in two minutes. What is best?",
    options: [
      "Panic and click",
      "Pause and check with a trusted adult",
      "Give it your verification code",
    ],
    correct: 1,
    explanation:
      "Urgent threats are often used to rush people into unsafe decisions.",
  },
];

const scenarios = [
  {
    icon: "🎮",
    title: "A free game reward",
    text:
      "A pop-up promises 10,000 free game coins if you enter your password.",
    options: [
      "Enter my password",
      "Close it and ask an adult",
      "Send it to my friends",
    ],
    correct: 1,
    feedback:
      "Correct! A free reward is not worth risking your account.",
  },
  {
    icon: "📩",
    title: "A strange message",
    text:
      "You receive a message from an unknown sender asking you to open a link.",
    options: [
      "Open it quickly",
      "Reply with my details",
      "Do not open it; ask a trusted adult",
    ],
    correct: 2,
    feedback:
      "Great choice! Unknown links should be treated carefully.",
  },
  {
    icon: "🔑",
    title: "A secret code",
    text:
      "Someone online asks you to send them the code sent to your phone.",
    options: [
      "Keep the code secret",
      "Send it to them",
      "Post it in a game chat",
    ],
    correct: 0,
    feedback:
      "Exactly! Verification codes are private and should never be shared.",
  },
];

/* Sound effects generated in the browser. No audio files are needed. */
function playAnswerSound(isCorrect) {
  let audio;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    audio = new AudioContextClass();

    if (audio.state === "suspended") {
      audio.resume().catch(() => {});
    }

    const now = audio.currentTime;

    const playTone = (
      frequency,
      delay,
      duration,
      volume = 0.12,
      type = "sine"
    ) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const startTime = now + delay;

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(
        volume,
        startTime + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration + 0.02);
    };

    if (isCorrect) {
      // Celebratory sound for a correct answer.
      playTone(523.25, 0, 0.2, 0.13);
      playTone(659.25, 0.12, 0.2, 0.13);
      playTone(783.99, 0.24, 0.24, 0.14);
      playTone(1046.5, 0.38, 0.32, 0.16);

      // Short noise bursts imitate a small round of applause.
      [0, 0.13, 0.26, 0.39, 0.52].forEach((delay) => {
        const length = Math.floor(audio.sampleRate * 0.065);
        const buffer = audio.createBuffer(
          1,
          length,
          audio.sampleRate
        );
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
          data[i] =
            (Math.random() * 2 - 1) * (1 - i / length);
        }

        const source = audio.createBufferSource();
        const filter = audio.createBiquadFilter();
        const gain = audio.createGain();

        source.buffer = buffer;
        filter.type = "highpass";
        filter.frequency.value = 900;

        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.exponentialRampToValueAtTime(
          0.11,
          now + delay + 0.006
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + delay + 0.07
        );

        source.connect(filter);
        filter.connect(gain);
        gain.connect(audio.destination);
        source.start(now + delay);
      });
    } else {
      // Soft descending sound for a wrong answer.
      playTone(220, 0, 0.18, 0.13, "triangle");
      playTone(165, 0.16, 0.24, 0.12, "triangle");
    }

    window.setTimeout(() => {
      if (audio && audio.state !== "closed") {
        audio.close().catch(() => {});
      }
    }, 1500);
  } catch (error) {
    // The game continues if the browser cannot play the sound.
    if (audio && audio.state !== "closed") {
      audio.close().catch(() => {});
    }
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [openedClues, setOpenedClues] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [siteResult, setSiteResult] = useState(null);
  const [siteAnswers, setSiteAnswers] = useState({});
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [quizCounted, setQuizCounted] = useState([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioChoice, setScenarioChoice] = useState(null);
  const [scenarioCorrect, setScenarioCorrect] = useState([]);
  const [scenarioCounted, setScenarioCounted] = useState([]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(0, Math.min(7, page)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSite = (site) => {
    setSelectedSite(site);
    setSiteResult(null);
  };

  const checkSite = (isSafe) => {
    if (!selectedSite) return;

    const correct = isSafe === selectedSite.safe;

    setSiteResult(correct ? "correct" : "wrong");
    playAnswerSound(correct);

    setSiteAnswers((previous) => ({
      ...previous,
      [selectedSite.id]: correct,
    }));
  };

  const question = quizQuestions[quizIndex];
  const scenario = scenarios[scenarioIndex];

  const answerQuiz = (index) => {
    if (quizCorrect) return;

    setQuizChoice(index);
    playAnswerSound(index === question.correct);

    if (index === question.correct) {
      setQuizCorrect(true);

      if (!quizCounted.includes(quizIndex)) {
        setQuizScore((score) => score + 1);
        setQuizCounted((previous) => [...previous, quizIndex]);
      }
    } else {
      setQuizCorrect(false);
    }
  };

  const nextQuestion = () => {
    if (!quizCorrect) return;

    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((index) => index + 1);
      setQuizChoice(null);
      setQuizCorrect(false);
    } else {
      goToPage(5);
    }
  };

  const answerScenario = (index) => {
    if (scenarioCorrect.includes(scenarioIndex)) return;

    setScenarioChoice(index);
    playAnswerSound(index === scenario.correct);

    if (index === scenario.correct) {
      setScenarioCorrect((previous) => [...previous, scenarioIndex]);

      if (!scenarioCounted.includes(scenarioIndex)) {
        setScenarioCounted((previous) => [
          ...previous,
          scenarioIndex,
        ]);
      }
    }
  };

  const nextScenario = () => {
    if (!scenarioCorrect.includes(scenarioIndex)) return;

    if (scenarioIndex < scenarios.length - 1) {
      setScenarioIndex((index) => index + 1);
      setScenarioChoice(null);
    } else {
      goToPage(6);
    }
  };

  const totalScore = quizScore + scenarioCounted.length;
  const totalPossible = quizQuestions.length + scenarios.length;

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => goToPage(0)}>
          <span className="brand-icon">🕵️</span>
          <span>
            <strong>CYBER DETECTIVE</strong>
            <small>DIGITAL SAFETY ACADEMY</small>
          </span>
        </button>

        <div className="safety-badge">🛡️ STAY SAFE ONLINE</div>
      </header>

      <nav className="mission-nav" aria-label="Mission navigation">
        {missions.map((mission, index) => (
          <button
            key={mission.title}
            className={
              currentPage === index
                ? "nav-mission active"
                : "nav-mission"
            }
            onClick={() => goToPage(index)}
            title={mission.title}
          >
            <span>{mission.icon}</span>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </button>
        ))}
      </nav>

      <main>
        {currentPage === 0 && (
          <>
            <section className="hero">
              <div className="hero-text">
                <span className="eyebrow">
                  ✦ YOUR MISSION STARTS HERE
                </span>

                <h1>
                  Think Smart.
                  <br />
                  <span>Spot the Fake!</span>
                </h1>

                <p>
                  Become a digital detective! Explore suspicious websites,
                  collect clues, solve challenges, and learn how to stay safe
                  online.
                </p>

                <button
                  className="start-button"
                  onClick={() => goToPage(1)}
                >
                  START ADVENTURE <span>→</span>
                </button>

                <div className="hero-stats">
                  <div>
                    <strong>08</strong>
                    <small>Learning Missions</small>
                  </div>
                  <div>
                    <strong>🔍</strong>
                    <small>Clues to Discover</small>
                  </div>
                  <div>
                    <strong>🏆</strong>
                    <small>Become a Hero</small>
                  </div>
                </div>
              </div>

              <div className="hero-art">
                <div className="glow glow-one" />
                <div className="glow glow-two" />
                <div className="floating-item lock">🔒</div>
                <div className="floating-item shield">🛡️</div>

                <div className="detective-card">
                  <div className="browser-bar">
                    <span>● ● ●</span>
                    <span>SECURE DETECTIVE LAB</span>
                  </div>

                  <div className="detective-character">🕵️‍♂️</div>

                  <div className="status-card">
                    <span className="status-check">✓</span>
                    <div>
                      <strong>Detective Ready!</strong>
                      <small>Your mission awaits.</small>
                    </div>
                  </div>
                </div>

                <div className="floating-item star">⭐</div>
                <div className="sparkle sparkle-one">✦</div>
                <div className="sparkle sparkle-two">✧</div>
              </div>
            </section>

            <section className="missions">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">YOUR MISSION MAP</span>
                  <h2>Choose Your Next Mission</h2>
                </div>

                <span className="mission-count">8 MISSIONS</span>
              </div>

              <div className="mission-grid">
                {missions.slice(1).map((mission, index) => (
                  <button
                    className="mission-card"
                    key={mission.title}
                    onClick={() => goToPage(index + 1)}
                  >
                    <span className="mission-number">
                      {String(index + 2).padStart(2, "0")}
                    </span>
                    <span className="mission-icon">{mission.icon}</span>
                    <strong>{mission.title}</strong>
                    <span className="mission-arrow">↗</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {currentPage === 1 && (
          <section className="content-page">
            <PageHeading
              number="02"
              title="Spot Fake Websites"
              subtitle="Learn to recognize warning signs before you click."
              icon="🔎"
            />

            <div className="clue-grid">
              {clues.map((clue, index) => (
                <button
                  key={clue.title}
                  className={`clue-card ${clue.color} ${
                    openedClues.includes(index) ? "expanded" : ""
                  }`}
                  onClick={() =>
                    setOpenedClues((previous) =>
                      previous.includes(index)
                        ? previous.filter((item) => item !== index)
                        : [...previous, index]
                    )
                  }
                >
                  <span className="clue-icon">{clue.icon}</span>
                  <span className="clue-number">
                    WARNING SIGN 0{index + 1}
                  </span>
                  <strong>{clue.title}</strong>
                  <p>{clue.text}</p>
                  <span className="clue-example">{clue.example}</span>

                  {openedClues.includes(index) && (
                    <span className="clue-tip">
                      💡 Detective tip: {clue.tip}
                    </span>
                  )}

                  <span className="expand-label">
                    {openedClues.includes(index)
                      ? "SHOW LESS −"
                      : "DISCOVER MORE +"}
                  </span>
                </button>
              ))}
            </div>

            <SafetyRule />

            <PageButtons
              back={() => goToPage(0)}
              next={() => goToPage(2)}
              nextText="COLLECT THE CLUES"
            />
          </section>
        )}

        {currentPage === 2 && (
          <section className="content-page">
            <PageHeading
              number="03"
              title="Collect the Clues"
              subtitle="Open each evidence card and learn what a detective should notice."
              icon="🧩"
            />

            <div className="evidence-grid">
              {[
                {
                  icon: "🌐",
                  title: "Compare the Domain",
                  text: "Look closely at the full website address, not just the logo or page title.",
                  detail:
                    "Detective test: compare the domain with an address from an official source. Watch for extra words, swapped letters, or unusual endings.",
                },
                {
                  icon: "📞",
                  title: "Check Contact Details",
                  text: "Look for clear, believable ways to contact the organization.",
                  detail:
                    "Detective test: missing, vague, or inconsistent contact details are a reason to pause and verify the site independently.",
                },
                {
                  icon: "📜",
                  title: "Review the Site Information",
                  text: "Check whether the About, Help, and Privacy information makes sense.",
                  detail:
                    "Detective test: copied text, broken links, or information that names a different company can be warning clues.",
                },
                {
                  icon: "🧭",
                  title: "Verify Before You Trust",
                  text: "A professional design or a lock icon alone does not prove a site is genuine.",
                  detail:
                    "Detective test: leave the page and reach the organization through a trusted bookmark or a trusted adult. Never enter real private information to test a site.",
                },
              ].map((item, index) => (
                <EvidenceCard key={item.title} item={item} index={index} />
              ))}
            </div>

            <div className="mission-note">
              <span>🧠</span>
              <div>
                <strong>Remember the detective method</strong>
                <p>
                  Stop, look carefully, check the clues, and ask a trusted
                  adult if something feels wrong.
                </p>
              </div>
            </div>

            <PageButtons
              back={() => goToPage(1)}
              next={() => goToPage(3)}
              nextText="ENTER WEBSITE LAB"
            />
          </section>
        )}

        {currentPage === 3 && (
          <section className="content-page">
            <PageHeading
              number="04"
              title="Website Lab"
              subtitle="Inspect safe, fictional website simulations. No real accounts or passwords are used."
              icon="🛡️"
            />

            {!selectedSite ? (
              <div className="site-grid">
                {websites.map((site) => (
                  <button
                    className="site-card"
                    key={site.id}
                    onClick={() => openSite(site)}
                  >
                    <div className="site-window">
                      <div className="site-dots">● ● ●</div>
                      <span className="site-big-icon">{site.icon}</span>
                      <strong>{site.name}</strong>
                      <small>{site.address}</small>
                    </div>

                    <span className="inspect-button">
                      INSPECT WEBSITE ↗
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="site-inspector">
                <div className="sim-browser">
                  <div className="sim-browser-top">
                    <span>● ● ●</span>
                    <small>SIMULATED WEBSITE — FOR LEARNING ONLY</small>
                  </div>

                  <div className="sim-address">
                    🔒 {selectedSite.address}
                  </div>

                  <div
                    className={`sim-content mock-site mock-site-${selectedSite.id}`}
                  >
                    <div className="mock-site-brand">
                      <span className="site-big-icon">
                        {selectedSite.icon}
                      </span>
                      <span className="mock-site-label">
                        PRACTICE WEBSITE
                      </span>
                    </div>

                    <h2>{selectedSite.name}</h2>
                    <p>{selectedSite.description}</p>

                    {selectedSite.id === 1 && (
                      <div className="mock-promo">
                        <span>🎉 SPECIAL WINNER NOTICE 🎉</span>
                        <strong>YOU WON A FREE TABLET!</strong>
                        <small>
                          Claim now — offer expires in 2 minutes!
                        </small>
                        <span className="mock-fake-cta">
                          CLAIM MY PRIZE
                        </span>
                      </div>
                    )}

                    {selectedSite.id === 2 && (
                      <div className="mock-library-row">
                        <div>
                          📘 <strong>Story Corner</strong>
                          <small>Read a new story</small>
                        </div>
                        <div>
                          🧠 <strong>Word Games</strong>
                          <small>Practice vocabulary</small>
                        </div>
                        <div>
                          🌟 <strong>Book Picks</strong>
                          <small>Discover a book</small>
                        </div>
                      </div>
                    )}

                    {selectedSite.id === 3 && (
                      <div className="mock-game-panel">
                        <strong>🎮 BONUS COINS UNLOCKED?</strong>
                        <span>
                          Enter your password to receive unlimited coins.
                        </span>
                        <div className="mock-fake-cta">
                          UNLOCK FREE COINS
                        </div>
                      </div>
                    )}

                    {selectedSite.id === 4 && (
                      <div className="mock-learning-row">
                        <span>📚 LESSONS</span>
                        <span>✏️ PRACTICE</span>
                        <span>🏅 PROGRESS</span>
                      </div>
                    )}

                    <div className="clue-list">
                      {selectedSite.clues.map((clue) => (
                        <div key={clue}>🔎 {clue}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <h3>Is this website trustworthy?</h3>

                <div className="classify-buttons">
                  <button
                    className="classify safe"
                    onClick={() => checkSite(true)}
                  >
                    ✓ LOOKS TRUSTWORTHY
                  </button>

                  <button
                    className="classify danger"
                    onClick={() => checkSite(false)}
                  >
                    ⚠ SUSPICIOUS WEBSITE
                  </button>
                </div>

                {siteResult && (
                  <div
                    className={
                      siteResult === "correct"
                        ? "feedback success"
                        : "feedback error"
                    }
                  >
                    <strong>
                      {siteResult === "correct"
                        ? "Great detective work!"
                        : "Not quite! Inspect the clues again."}
                    </strong>
                    <p>
                      {siteResult === "correct"
                        ? "You classified this simulation correctly. Remember, real websites must be checked carefully too."
                        : "Look for unexpected prizes, strange requests, and pressure to act quickly. Try again!"}
                    </p>
                  </div>
                )}

                <div className="inline-actions">
                  <button
                    className="nav-button secondary"
                    onClick={() => {
                      setSelectedSite(null);
                      setSiteResult(null);
                    }}
                  >
                    ← BACK TO WEBSITE LIST
                  </button>

                  {siteResult === "correct" && (
                    <button
                      className="nav-button primary"
                      onClick={() => {
                        setSelectedSite(null);
                        setSiteResult(null);
                      }}
                    >
                      INSPECT ANOTHER →
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="mission-note">
              <span>🔐</span>
              <div>
                <strong>Safe simulation</strong>
                <p>
                  These are fictional practice pages. Never enter real
                  passwords or personal information into suspicious websites.
                </p>
              </div>
            </div>

            <PageButtons
              back={() => goToPage(2)}
              next={() => goToPage(4)}
              nextText="START THE CHALLENGE"
            />
          </section>
        )}

        {currentPage === 4 && (
          <section className="content-page">
            <PageHeading
              number="05"
              title="Detective Challenge"
              subtitle="Choose the safest answer. If you get it wrong, read the tip and try again."
              icon="🎯"
            />

            <div className="quiz-panel">
              <div className="quiz-progress">
                <span>
                  QUESTION {quizIndex + 1} OF {quizQuestions.length}
                </span>
                <span>{quizScore} CORRECT</span>
              </div>

              <div className="progress-track">
                <div
                  style={{
                    width: `${
                      ((quizIndex + 1) / quizQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>

              <h2>{question.question}</h2>

              <div className="answer-list">
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    className={`answer-option ${
                      quizChoice === index
                        ? index === question.correct
                          ? "answer-right"
                          : "answer-wrong"
                        : ""
                    }`}
                    disabled={quizCorrect}
                    onClick={() => answerQuiz(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>

              {quizChoice !== null && (
                <div
                  className={
                    quizCorrect ? "feedback success" : "feedback error"
                  }
                >
                  <strong>
                    {quizCorrect
                      ? "Correct! Well done! ⭐"
                      : "Try again, detective! 🔎"}
                  </strong>
                  <p>{question.explanation}</p>

                  {!quizCorrect && (
                    <button
                      className="retry-button"
                      onClick={() => setQuizChoice(null)}
                    >
                      TRY AGAIN
                    </button>
                  )}
                </div>
              )}

              {quizCorrect && (
                <button
                  className="nav-button primary full-button"
                  onClick={nextQuestion}
                >
                  {quizIndex === quizQuestions.length - 1
                    ? "CONTINUE TO SCENARIOS →"
                    : "NEXT QUESTION →"}
                </button>
              )}
            </div>

            <div className="page-buttons">
              <button
                className="nav-button secondary"
                onClick={() => goToPage(3)}
              >
                ← PREVIOUS
              </button>
              <span className="nav-hint">
                Answer each question correctly to unlock the next step.
              </span>
            </div>
          </section>
        )}

        {currentPage === 5 && (
          <section className="content-page">
            <PageHeading
              number="06"
              title="What Would You Do?"
              subtitle="Practice making safe choices in everyday online situations."
              icon="💡"
            />

            <div className="quiz-panel">
              <div className="quiz-progress">
                <span>
                  SCENARIO {scenarioIndex + 1} OF {scenarios.length}
                </span>
                <span>{scenarioCounted.length} SOLVED</span>
              </div>

              <div className="scenario-illustration">{scenario.icon}</div>
              <h2>{scenario.title}</h2>
              <p className="scenario-text">{scenario.text}</p>

              <div className="answer-list">
                {scenario.options.map((option, index) => (
                  <button
                    key={option}
                    disabled={scenarioCorrect.includes(scenarioIndex)}
                    className={`answer-option ${
                      scenarioChoice === index
                        ? index === scenario.correct
                          ? "answer-right"
                          : "answer-wrong"
                        : ""
                    }`}
                    onClick={() => answerScenario(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>

              {scenarioChoice !== null && (
                <div
                  className={
                    scenarioCorrect.includes(scenarioIndex)
                      ? "feedback success"
                      : "feedback error"
                  }
                >
                  <strong>
                    {scenarioCorrect.includes(scenarioIndex)
                      ? "Smart choice! ⭐"
                      : "Not the safest choice. Try again."}
                  </strong>
                  <p>
                    {scenarioCorrect.includes(scenarioIndex)
                      ? scenario.feedback
                      : "Think about your privacy and safety. Never share secrets or rush to open unknown links."}
                  </p>

                  {!scenarioCorrect.includes(scenarioIndex) && (
                    <button
                      className="retry-button"
                      onClick={() => setScenarioChoice(null)}
                    >
                      TRY AGAIN
                    </button>
                  )}
                </div>
              )}

              {scenarioCorrect.includes(scenarioIndex) && (
                <button
                  className="nav-button primary full-button"
                  onClick={nextScenario}
                >
                  {scenarioIndex === scenarios.length - 1
                    ? "VIEW MY RESULTS →"
                    : "NEXT SCENARIO →"}
                </button>
              )}
            </div>

            <div className="page-buttons">
              <button
                className="nav-button secondary"
                onClick={() => goToPage(4)}
              >
                ← PREVIOUS
              </button>
              <span className="nav-hint">
                Solve each scenario to reveal your results.
              </span>
            </div>
          </section>
        )}

        {currentPage === 6 && (
          <section className="content-page">
            <PageHeading
              number="07"
              title="My Achievements"
              subtitle="Every safe choice makes you a stronger digital detective."
              icon="🏆"
            />

            <div className="achievement-panel">
              <div className="trophy">🏆</div>
              <span className="eyebrow">YOUR CURRENT SCORE</span>

              <div className="score-number">
                {totalScore}
                <span> / {totalPossible}</span>
              </div>

              <p>
                Correct answers across the detective challenge and real-life
                scenarios.
              </p>

              <div className="progress-track">
                <div
                  style={{
                    width: `${(totalScore / totalPossible) * 100}%`,
                  }}
                />
              </div>

              <div className="achievement-badges">
                <div>
                  <span>🔎</span>
                  <strong>Clue Finder</strong>
                  <small>Explore the warning signs</small>
                </div>
                <div>
                  <span>🛡️</span>
                  <strong>Safety Learner</strong>
                  <small>Practice safer choices</small>
                </div>
                <div>
                  <span>⭐</span>
                  <strong>Digital Detective</strong>
                  <small>Keep learning every day</small>
                </div>
              </div>
            </div>

            <PageButtons
              back={() => goToPage(5)}
              next={() => goToPage(7)}
              nextText="ABOUT THE PROJECT"
            />
          </section>
        )}

        {currentPage === 7 && (
          <section className="content-page">
            <PageHeading
              number="08"
              title="About the Project"
              subtitle="A digital safety learning adventure for young internet users."
              icon="⭐"
            />

            <div className="about-panel credits-panel">
              <div className="about-symbol">🕵️‍♀️</div>
              <span className="eyebrow">
                INTERACTIVE EDUCATIONAL PROJECT
              </span>
              <h2>CYBER DETECTIVE KIDS</h2>
              <p className="credits-subtitle">
                An Interactive Cybersecurity Learning Experience
              </p>

              <div className="about-features">
                <div>🎨 <strong>Visual Learning</strong></div>
                <div>🧩 <strong>Interactive Missions</strong></div>
                <div>🛡️ <strong>Digital Safety Skills</strong></div>
              </div>

              <div className="credits-divider" />

              <div className="credits-block">
                <span className="credits-label">PROJECT PREPARED BY</span>
                <h3>Fatma Elzahraa Bakhit</h3>
              </div>

              <div className="credits-block supervisors-block">
                <span className="credits-label">
                  UNDER THE SUPERVISION OF
                </span>
                <h3>Dr. Nermin Nasr</h3>
                <h3>Dr. Hossam Hamdy</h3>
              </div>

              <div className="credits-motto">
                LEARN <span>•</span> INVESTIGATE <span>•</span> STAY SAFE
              </div>
            </div>

            <PageButtons
              back={() => goToPage(6)}
              next={() => goToPage(0)}
              nextText="BACK TO HOME"
            />
          </section>
        )}
      </main>

      <footer className="footer">
        <span>🛡️ LEARN SMART. STAY SAFE.</span>
        <span>Every click is a chance to make a safer choice.</span>
      </footer>
    </div>
  );
}

function PageHeading({ number, title, subtitle, icon }) {
  return (
    <div className="page-heading">
      <div className="heading-icon">{icon}</div>
      <span className="eyebrow">MISSION {number} / 08</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function PageButtons({ back, next, nextText }) {
  return (
    <div className="page-buttons">
      <button className="nav-button secondary" onClick={back}>
        ← PREVIOUS
      </button>
      <button className="nav-button primary" onClick={next}>
        {nextText} →
      </button>
    </div>
  );
}

function SafetyRule() {
  return (
    <div className="mission-note">
      <span>🛡️</span>
      <div>
        <strong>Detective Rule #1</strong>
        <p>
          When in doubt, do not click. Ask a trusted adult for help.
        </p>
      </div>
    </div>
  );
}

function EvidenceCard({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      className={`evidence-card ${open ? "expanded" : ""}`}
      onClick={() => setOpen(!open)}
    >
      <span className="evidence-icon">{item.icon}</span>
      <span className="clue-number">EVIDENCE 0{index + 1}</span>
      <strong>{item.title}</strong>
      <p>{item.text}</p>

      {open && (
        <div className="evidence-detail">💡 {item.detail}</div>
      )}

      <span className="expand-label">
        {open ? "CLOSE −" : "EXAMINE CLUE +"}
      </span>
    </button>
  );
}

export default App;