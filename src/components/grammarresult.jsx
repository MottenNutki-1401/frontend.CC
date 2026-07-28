import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/grammar.css";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import ResultsDashboard, { ScoreMeter } from "./ResultsDashboard.jsx";
import { exportGrammarPDF } from "../utils/exportGrammar";

function GrammarResult() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  if (!resultData || !resultData.files) {
    return <div><h2>No results found</h2><button onClick={() => navigate("/grammar")}>Go Back</button></div>;
  }

  const files = resultData.files;
  const totalMistakes = files.reduce((total, file) => total + (Number(file.mistakes) || 0), 0);
  const averageScore = files.length ? Math.round(files.reduce((total, file) => total + (Number(file.score) || 0), 0) / files.length) : 0;

  return (
    <div className="homepage-container">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <main className="results-page">
        <ResultsDashboard
          title="Grammar results"
          description="Review grammar scores, inspect identified issues, and download the completed report."
          onDownload={() => exportGrammarPDF(files)}
          summaryCards={[
            { label: "Documents analyzed", value: files.length, detail: "Submissions in this report" },
            { label: "Grammar issues", value: totalMistakes, detail: "Across all documents", tone: totalMistakes ? "warning" : "success" },
            { label: "Average score", value: `${averageScore}%`, detail: "Grammar quality score", tone: averageScore >= 85 ? "success" : averageScore >= 60 ? "warning" : "danger" },
          ]}
        >
          <div className="results-content-grid">
            <section className="results-table-card">
              <div className="results-table-scroll">
                <div className="results-data-table" style={{ "--results-columns": "1.55fr 1fr 1fr 1.1fr" }}>
                  <div className="results-table-header"><span>File name</span><span>Grammar issues</span><span>Total words</span><span>Grammar score</span></div>
                  {files.map((file, index) => (
                    <button className="results-table-row" key={index} onClick={() => setSelectedFile(file)}>
                      <span>{file.file}</span><span>{file.mistakes}</span><span>{file.total_words}</span><span><ScoreMeter value={file.score} /></span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside className="results-detail-card">
              <div className="results-detail-header"><p>DOCUMENT REVIEW</p><h2>Grammatical mistakes</h2></div>
              <div className="results-detail-body">
                {!selectedFile ? <p className="results-detail-empty">Select a file to view its identified grammar issues.</p> : (() => {
                  const text = selectedFile.original_text || "";
                  const issues = selectedFile.issues || [];
                  const sorted = [...issues].sort((a, b) => a.offset - b.offset);
                  const elements = [];
                  let lastIndex = 0;

                  sorted.forEach((issue, i) => {
                    const start = issue.offset;
                    const end = start + issue.length;
                    elements.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
                    elements.push(<span className="results-grammar-issue" key={`error-${i}`} title={issue.message}>{text.slice(start, end)}</span>);
                    lastIndex = end;
                  });
                  elements.push(<span key="last">{text.slice(lastIndex)}</span>);
                  return <div>{elements}</div>;
                })()}
              </div>
            </aside>
          </div>
        </ResultsDashboard>
      </main>
    </div>
  );
}

export default GrammarResult;
