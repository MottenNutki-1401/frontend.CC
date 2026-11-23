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

function Passage({ text, matches, side, currentIndex, selectedRef }) {
  const ranges = matches.map((match, matchIndex) => ({
    range: match[side], type: match.type, matchIndex,
  })).filter(({ range }) => range.start < text.length && range.end <= text.length)
    .sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end);

  // Non-overlapping segments keep each source character rendered exactly once.
  // Prefer the selected range when backend ranges overlap.
  const segments = [];
  let cursor = 0;
  while (cursor < text.length) {
    const selected = ranges.find(({ range, matchIndex }) => matchIndex === currentIndex && range.start <= cursor && range.end > cursor);
    const active = selected || ranges.find(({ range }) => range.start <= cursor && range.end > cursor);
    if (active) {
      const end = Math.min(active.range.end, ...ranges.filter(({ range, matchIndex }) => matchIndex !== active.matchIndex && range.start > cursor).map(({ range }) => range.start), text.length);
      segments.push({ start: cursor, end, match: active });
      cursor = end;
    } else {
      const nextStart = ranges.find(({ range }) => range.start > cursor)?.range.start ?? text.length;
      segments.push({ start: cursor, end: nextStart, match: null });
      cursor = nextStart;
    }
  }

  return (
    <pre className="comparison-document-text">
      {segments.map(({ start, end, match }, index) => match ? (
        <mark
          key={`${start}-${end}-${match.matchIndex}`}
          ref={match.matchIndex === currentIndex ? selectedRef : null}
          className={`comparison-highlight comparison-highlight--${match.type}${match.matchIndex === currentIndex ? " comparison-highlight--selected" : ""}`}
        >{text.slice(start, end)}</mark>
      ) : <span key={`text-${start}-${end}-${index}`}>{text.slice(start, end)}</span>)}
    </pre>
  );
}

function ComparisonViewer({ file, onClose, viewerRef }) {
  const matches = getValidMatches(file.matches);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sourceText = typeof file.original_text === "string" ? file.original_text : "";
  const matchedText = typeof file.matched_text === "string" ? file.matched_text : "";
  const sourceMatchRef = useRef(null);
  const matchedMatchRef = useRef(null);

  useEffect(() => {
    sourceMatchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    matchedMatchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentIndex]);

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
      <p className="comparison-legend"><span className="comparison-highlight comparison-highlight--exact">Exact match</span><span className="comparison-highlight comparison-highlight--near_exact">Near-exact match</span></p>
      {!matches.length && <p className="comparison-no-matches">No eligible matching passages were returned for this document pair.</p>}
      <div className="comparison-columns">
        <article><h3>{file.file}</h3><Passage text={sourceText} matches={matches} side="source" currentIndex={currentIndex} selectedRef={sourceMatchRef} /></article>
        <article><h3>{file.most_similar}</h3><Passage text={matchedText} matches={matches} side="matched" currentIndex={currentIndex} selectedRef={matchedMatchRef} /></article>
      </div>
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
