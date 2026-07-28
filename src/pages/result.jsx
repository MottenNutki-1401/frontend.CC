import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/result.css";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import ResultsDashboard, { ResultBadge, ScoreMeter } from "../components/ResultsDashboard.jsx";
import { exportSimilarityPDF } from "../utils/exportSimilarity";

function Result() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  if (!resultData) {
    return <div><h2>No results found</h2><button onClick={() => navigate("/")}>Go Back</button></div>;
  }

  const files = resultData.files || [];
  const highRiskFiles = files.filter((file) => Number(file.similarity) > 70).length;
  const averageSimilarity = files.length ? Math.round(files.reduce((total, file) => total + (Number(file.similarity) || 0), 0) / files.length) : 0;

  return (
    <div className="homepage-container">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <main className="results-page">
        <ResultsDashboard
          title="Similarity results"
          description="Review document matches and identify submissions that may need a closer look."
          onDownload={() => exportSimilarityPDF(files)}
          summaryCards={[
            { label: "Documents analyzed", value: files.length, detail: "Submissions in this report" },
            { label: "High-risk matches", value: highRiskFiles, detail: "Similarity above 70%", tone: highRiskFiles ? "danger" : "success" },
            { label: "Average similarity", value: `${averageSimilarity}%`, detail: "Across all documents", tone: averageSimilarity > 70 ? "danger" : "warning" },
          ]}
        >
          <section className="results-table-card">
            <div className="results-table-scroll">
              <div className="results-data-table" style={{ "--results-columns": "1.55fr 0.9fr 1.55fr 1fr" }}>
                <div className="results-table-header"><span>File name</span><span>Status</span><span>Most similar</span><span>Similarity</span></div>
                {files.map((file, index) => {
                  const highRisk = Number(file.similarity) > 70;
                  return (
                    <div className="results-table-row" key={index}>
                      <span>{file.file}</span>
                      <span><ResultBadge tone={highRisk ? "danger" : "success"}>{highRisk ? "High Risk" : "Safe"}</ResultBadge></span>
                      <span>{file.most_similar}</span>
                      <span><ScoreMeter value={file.similarity} /></span>
                    </div>
                  );
                })}
                {files.length === 0 && <p className="results-empty-state">No similarity results are available.</p>}
              </div>
            </div>
          </section>
        </ResultsDashboard>
      </main>
    </div>
  );
}

export default Result;
