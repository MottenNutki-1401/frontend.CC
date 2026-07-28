import { useState } from "react";

import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import { exportGradingPDF } from "../utils/exportGrading";
import { handleDrop, handleDragOver, handleFileChange } from "../components/dragdrop";
import { uploadFiles, getGrades } from "../api/api";
import ResultsDashboard, { ScoreMeter } from "../components/ResultsDashboard.jsx";
import "../styles/grading.css";

function Grading() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [weights, setWeights] = useState({ grammar: 40, spelling: 30, originality: 30 });

  const presets = {
    standard: { grammar: 40, spelling: 30, originality: 30 },
    grammar: { grammar: 60, spelling: 20, originality: 20 },
    balanced: { grammar: 34, spelling: 33, originality: 33 },
  };

  const handlePreset = (value) => {
    setMode(value);
    if (value !== "custom") setWeights(presets[value]);
  };

  const handleInputChange = (key, value) => {
    setWeights((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const averageGrade = results.length ? Math.round(results.reduce((sum, result) => sum + (Number(result.final_score) || 0), 0) / results.length) : 0;
  const highestGrade = results.length ? Math.max(...results.map((result) => Number(result.final_score) || 0)) : 0;
  const getGradeTone = (value) => (value >= 85 ? "success" : value >= 60 ? "warning" : "danger");

  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert("Please upload files first");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("files", files[i]);

    try {
      setLoading(true);
      const uploadData = await uploadFiles(formData);
      console.log("UPLOAD:", uploadData);
      uploadData.weights = weights;
      const gradingData = await getGrades(uploadData);
      console.log("GRADING:", gradingData);
      setResults(gradingData.results || []);
      setLoading(false);
    } catch (error) {
      console.error("Grading error:", error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFiles([]);
    setResults([]);
  };

  return (
    <div className="homepage-container">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

      <main className="grading-page">
        <section className="grading-content" aria-labelledby="grading-title">
          <div className="grading-intro">
            <p className="grading-eyebrow">COPYCATCH WORKSPACE</p>
            <h1 id="grading-title">Automated Grading</h1>
            <p>Upload student submissions, choose the grading balance, and review each submission’s scores in one place.</p>
          </div>

          <div className="grading-layout">
            <div className="grading-controls">
              <section className="grading-card" aria-labelledby="weights-title">
                <div className="grading-card-heading">
                  <h2 id="weights-title">Grading weights</h2>
                  <p>Choose a preset or customize how each criterion contributes to the final grade.</p>
                </div>

                <label className="grading-field-label" htmlFor="grading-preset">Weighting preset</label>
                <select id="grading-preset" className="preset-select" value={mode} onChange={(e) => handlePreset(e.target.value)}>
                  <option value="standard">Standard (Grammar: 40%, Spelling: 30%, Originality: 30%)</option>
                  <option value="grammar">Grammar Focus (Grammar: 60%, Spelling: 20%, Originality: 20%)</option>
                  <option value="balanced">Balanced (Grammar: 34%, Spelling: 33%, Originality: 33%)</option>
                  <option value="custom">Custom</option>
                </select>

                {mode === "custom" && (
                  <div className="weight-inputs">
                    <label className="input-row"> <span>Grammar</span> <input type="number" value={weights.grammar} onChange={(e) => handleInputChange("grammar", e.target.value)} /> </label>
                    <label className="input-row"> <span>Spelling</span> <input type="number" value={weights.spelling} onChange={(e) => handleInputChange("spelling", e.target.value)} /> </label>
                    <label className="input-row"> <span>Originality</span> <input type="number" value={weights.originality} onChange={(e) => handleInputChange("originality", e.target.value)} /> </label>
                  </div>
                )}

                <p className={`total ${total !== 100 ? "error" : ""}`}>Total: {total}%</p>
              </section>

              <section className="grading-card" aria-labelledby="files-title">
                <div className="grading-card-heading">
                  <h2 id="files-title">Student submissions</h2>
                  <p>Add the documents you want to grade.</p>
                </div>

                {files.length === 0 ? (
                  <label className="grading-dropzone" htmlFor="grading-file-input" onDrop={(e) => handleDrop(e, setFiles)} onDragOver={handleDragOver}>
                    <span className="grading-upload-icon" aria-hidden="true">↑</span>
                    <span className="grading-dropzone-title">Upload your documents</span>
                    <span className="grading-dropzone-copy">Drag and drop files here, or click to browse.</span>
                    <span className="grading-dropzone-hint">PDF, DOCX, OR TXT</span>
                  </label>
                ) : (
                  <div className="grading-file-list" aria-live="polite">
                    {files.map((file, index) => (
                      <article className="grading-file-card" key={`${file.name}-${index}`}>
                        <span className="grading-file-icon" aria-hidden="true">DOC</span>
                        <div className="grading-file-details"><strong>{file.name}</strong></div>
                        <label className="analysis-file-change" htmlFor="grading-file-input">Change</label>
                      </article>
                    ))}
                  </div>
                )}
                <input id="grading-file-input" type="file" multiple onChange={(e) => handleFileChange(e, setFiles)} className="grading-file-input" />

                <div className="grading-actions">
                  <button className="grading-primary-button" onClick={handleAnalyze} disabled={loading}>{loading ? "Checking..." : "Grade submissions"}</button>
                  <button className="grading-secondary-button" onClick={handleCancel}>Clear workspace</button>
                </div>
              </section>
            </div>

            <ResultsDashboard
              compact
              eyebrow="GRADING REPORT"
              title="Grading results"
              description="Review the completed submission scores and download the report."
              onDownload={() => exportGradingPDF(results)}
              summaryCards={[
                { label: "Submissions graded", value: results.length, detail: "Completed in this report" },
                { label: "Average final grade", value: `${averageGrade}%`, detail: "Across all submissions", tone: getGradeTone(averageGrade) },
                { label: "Highest final grade", value: `${highestGrade}%`, detail: "Best submission score", tone: getGradeTone(highestGrade) },
              ]}
            >
              <section className="results-table-card">
                <div className="results-table-scroll">
                  <div className="results-data-table" style={{ "--results-columns": "1.55fr repeat(5, minmax(82px, 1fr))" }}>
                    <div className="results-table-header">
                      <span>File name</span><span>Grammar</span><span>Spelling</span><span>Originality</span><span>Total words</span><span>Final grade</span>
                    </div>
                    {results.map((r, i) => (
                      <div className="results-table-row" key={i}>
                        <span>{r.file}</span><span><ScoreMeter value={r.grammar} /></span><span><ScoreMeter value={r.spelling} /></span><span><ScoreMeter value={r.originality} /></span><span>{r.total_words}</span><span><ScoreMeter value={r.final_score} /></span>
                      </div>
                    ))}
                    {results.length === 0 && <p className="results-empty-state">Your completed grades will appear here.</p>}
                  </div>
                </div>
              </section>
            </ResultsDashboard>
          </div>
        </section>
      </main>

      {loading && (
        <div className="grading-loading-overlay" role="status" aria-live="polite">
          <div className="grading-loading-card">
            <span className="grading-spinner" aria-hidden="true" />
            <div className="grading-loading-messages"><span>Uploading documents...</span><span>Preparing grading...</span><span>Applying criteria...</span><span>Generating results...</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grading;
