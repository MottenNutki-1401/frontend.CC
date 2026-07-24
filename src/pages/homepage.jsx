import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/homepage.css";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";

import egg from "../assets/egg.svg";
import learn from "../assets/learn.svg";

import File from "../components/file.jsx";
import Spelling from "../pages/spelling.jsx";
import Grammar from "../pages/grammar.jsx";

function Homepage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <Header
        toggleSidebar={() => setIsSidebarOpen(true)}
        variant="dashboard"
      />
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <main className="home-dashboard">
        <section className="home-content" aria-labelledby="home-title">
          <div className="home-intro">
            <p className="home-eyebrow">COPYCATCH WORKSPACE</p>
            <h1 id="home-title">Where would you like to begin?</h1>
            <p>
              Select a tool to review submissions, support academic integrity, and
              give students clearer feedback.
            </p>
          </div>

          <div className="feature-grid">
            <button
              className="feature-card"
              type="button"
              onClick={() => navigate("/file")}
            >
              <span className="feature-icon" aria-hidden="true">↔</span>
              <span className="feature-card-copy">
                <span className="feature-title">Similarity Detection</span>
                <span className="feature-description">
                  Compare submissions and identify overlapping content.
                </span>
              </span>
              <span className="feature-arrow" aria-hidden="true">→</span>
            </button>

            <button
              className="feature-card"
              type="button"
              onClick={() => navigate("/spelling")}
            >
              <span className="feature-icon" aria-hidden="true">Aa</span>
              <span className="feature-card-copy">
                <span className="feature-title">Spelling Checker</span>
                <span className="feature-description">
                  Find spelling issues across student submissions.
                </span>
              </span>
              <span className="feature-arrow" aria-hidden="true">→</span>
            </button>

            <button
              className="feature-card"
              type="button"
              onClick={() => navigate("/grammar")}
            >
              <span className="feature-icon" aria-hidden="true">✓</span>
              <span className="feature-card-copy">
                <span className="feature-title">Grammar Checker</span>
                <span className="feature-description">
                  Highlight grammar issues and improve written clarity.
                </span>
              </span>
              <span className="feature-arrow" aria-hidden="true">→</span>
            </button>

            <button
              className="feature-card"
              type="button"
              onClick={() => navigate("/grading")}
            >
              <span className="feature-icon" aria-hidden="true">%</span>
              <span className="feature-card-copy">
                <span className="feature-title">Automated Grading</span>
                <span className="feature-description">
                  Assess work consistently with your chosen criteria.
                </span>
              </span>
              <span className="feature-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <aside className="home-artwork" aria-label="Academic review illustration">
          <img className="home-egg" src={egg} alt="" aria-hidden="true" />
          <img
            className="home-learn-illustration"
            src={learn}
            alt="Student reviewing academic work"
          />
        </aside>
      </main>
    </div>
  );
}

export default Homepage;
