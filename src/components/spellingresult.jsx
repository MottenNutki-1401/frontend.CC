import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/spelling.css";
import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";
import ResultsDashboard, { ScoreMeter } from "./ResultsDashboard.jsx";
import { exportSpellingPDF } from "../utils/exportSpelling";

function SpellingResult() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  if (!resultData || !resultData.files) {
    return <div><h2>No results found</h2><button onClick={() => navigate("/spelling")}>Go Back</button></div>;
  }

  const files = resultData.files;
  const totalMistakes = files.reduce((total, file) => total + (Number(file.misspelled) || 0), 0);
  const averageScore = files.length ? Math.round(files.reduce((total, file) => total + (Number(file.score) || 0), 0) / files.length) : 0;
  const normalize = (word) => word.toLowerCase().replace(/[^a-z']/gi, "");

  return (
    <div className="homepage-container">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <main className="results-page">
        <ResultsDashboard
          title="Spelling results"
          description="Review spelling scores, inspect flagged words, and download the completed report."
          onDownload={() => exportSpellingPDF(files)}
          summaryCards={[
            { label: "Documents analyzed", value: files.length, detail: "Submissions in this report" },
            { label: "Spelling issues", value: totalMistakes, detail: "Across all documents", tone: totalMistakes ? "warning" : "success" },
            { label: "Average score", value: `${averageScore}%`, detail: "Spelling quality score", tone: averageScore >= 85 ? "success" : averageScore >= 60 ? "warning" : "danger" },
          ]}
        >
          <div className="results-content-grid">
            <section className="results-table-card">
              <div className="results-table-scroll">
                <div className="results-data-table" style={{ "--results-columns": "1.55fr 1fr 1fr 1.1fr" }}>
                  <div className="results-table-header"><span>File name</span><span>Spelling issues</span><span>Total words</span><span>Spelling score</span></div>
                  {files.map((file, index) => (
                    <button className="results-table-row" key={index} onClick={() => setSelectedFile(file)}>
                      <span>{file.file}</span><span>{file.misspelled}</span><span>{file.total_words}</span><span><ScoreMeter value={file.score} /></span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside className="results-detail-card">
              <div className="results-detail-header"><p>DOCUMENT REVIEW</p><h2>Spelling mistakes</h2></div>
              <div className="results-detail-body">
                {!selectedFile ? <p className="results-detail-empty">Select a file to view its flagged spelling issues.</p> : (
                  <div>
                    {(selectedFile.original_text || "").split(/(\s+)/).map((token, index) => {
                      if (/^\s+$/.test(token)) return <span key={index}>{token}</span>;
                      const clean = normalize(token);
                      const isWrong = (selectedFile.misspelled_words || []).includes(clean);
                      return <span className={isWrong ? "results-spelling-issue" : ""} key={index}>{token}</span>;
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </ResultsDashboard>
      </main>
    </div>
  );
}

export default SpellingResult;
