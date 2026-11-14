import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import "../styles/result.css";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import ResultsDashboard from "../components/ResultsDashboard.jsx";
import ResultsTable from "../components/ResultsTable.jsx";
import { exportSimilarityPDF } from "../utils/exportSimilarity";

const getValidMatches = (matches) => (Array.isArray(matches) ? matches : []).filter((match) => {
  const validRange = (range) => range && Number.isInteger(range.start) && Number.isInteger(range.end)
    && range.start >= 0 && range.end > range.start && typeof range.text === "string";
  return (match.type === "exact" || match.type === "near_exact")
    && validRange(match.source) && validRange(match.matched);
});

function Passage({ text, range, type }) {
  if (typeof text !== "string" || !range || range.end > text.length || text.slice(range.start, range.end) !== range.text) {
    return (
      <div className="comparison-document-text">
        {typeof text === "string" && text ? <pre>{text}</pre> : <mark className={`comparison-highlight comparison-highlight--${type}`}>{range?.text || "Passage text is unavailable."}</mark>}
        <small>Showing the matched passage returned by the API; full document text is not included in this result.</small>
      </div>
    );
  }
  return (
    <pre className="comparison-document-text">
      {text.slice(0, range.start)}
      <mark className={`comparison-highlight comparison-highlight--${type}`}>{text.slice(range.start, range.end)}</mark>
      {text.slice(range.end)}
    </pre>
  );
}

function ComparisonViewer({ file, onClose, viewerRef }) {
  const matches = getValidMatches(file.matches);
  const [currentIndex, setCurrentIndex] = useState(0);
  const match = matches[currentIndex];
  const sourceText = file.original_text ?? file.text;
  const matchedText = file.most_similar_original_text ?? file.most_similar_text;

  return (
    <section ref={viewerRef} className="comparison-viewer" aria-label="Document comparison">
      <div className="comparison-viewer-heading">
        <div><p>DOCUMENT COMPARISON</p><h2>{file.file} <span>and</span> {file.most_similar}</h2></div>
        <button type="button" className="comparison-close" onClick={onClose}>Close</button>
      </div>
      <div className="comparison-navigation">
        <span>{matches.length ? `Match ${currentIndex + 1} of ${matches.length}` : "0 matches"}</span>
        <div>
          <button type="button" onClick={() => setCurrentIndex((currentIndex - 1 + matches.length) % matches.length)} disabled={!matches.length || currentIndex === 0}>Previous</button>
          <button type="button" onClick={() => setCurrentIndex((currentIndex + 1) % matches.length)} disabled={!matches.length || currentIndex === matches.length - 1}>Next</button>
        </div>
      </div>
      {!matches.length ? <p className="comparison-no-matches">No eligible matching passages were returned for this document pair.</p> : (
        <>
          <p className="comparison-legend"><span className="comparison-highlight comparison-highlight--exact">Exact match</span><span className="comparison-highlight comparison-highlight--near_exact">Near-exact match</span></p>
          <div className="comparison-columns">
            <article><h3>{file.file}</h3><Passage text={sourceText} range={match.source} type={match.type} /></article>
            <article><h3>{file.most_similar}</h3><Passage text={matchedText} range={match.matched} type={match.type} /></article>
          </div>
        </>
      )}
    </section>
  );
}

function Result() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const viewerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state;

  useEffect(() => {
    if (selectedFile) {
      viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedFile]);

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
          <ResultsTable results={files} onSelectFile={setSelectedFile} />
          {selectedFile && <ComparisonViewer key={`${selectedFile.file}-${selectedFile.most_similar}`} file={selectedFile} onClose={() => setSelectedFile(null)} viewerRef={viewerRef} />}
        </ResultsDashboard>
      </main>
    </div>
  );
}

export default Result;
