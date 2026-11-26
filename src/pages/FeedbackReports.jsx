import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import {
  createFeedbackReportJob,
  downloadFeedbackReportArchive,
  getFeedbackReportArtifactUrl,
  getFeedbackReportJob,
} from "../api/api.js";
import "../styles/feedback-reports.css";

const readSavedResults = () => {
  try {
    const saved = sessionStorage.getItem("copycatch-similarity-results");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const getRisk = (file) => {
  const status = String(file.status || "").toLowerCase();
  if (status.includes("high")) return "High Risk";
  if (status.includes("moderate")) return "Moderate";
  const score = Number(file.similarity);
  if (file.similarity !== null && file.similarity !== undefined && file.similarity !== "" && Number.isFinite(score)) return score >= 70 ? "High Risk" : score >= 40 ? "Moderate" : "Safe";
  return "Other";
};

const getFileName = (file, index) => file.file || file.filename || `Document ${index + 1}`;

const getFriendlyError = (error) => {
  const message = typeof error === "string" ? error : String(error?.message || "");
  const status = Number(error?.status);
  const normalized = message.toLowerCase();

  if (error instanceof TypeError || /failed to fetch|network|connection|load failed/.test(normalized)) {
    return "Connection interrupted. Please check your connection and try again.";
  }
  if (status === 429 || status >= 500 || /temporarily unavailable|service unavailable|rate limit|timed out|timeout/.test(normalized)) {
    return "The feedback service is temporarily unavailable. Please try again later.";
  }
  if (status === 400 || status === 422 || /invalid document|document content|could not be processed|unprocessable/.test(normalized)) {
    return "Some documents couldn't be processed. Please review the affected submissions.";
  }
  return "We couldn't generate the feedback report. Please try again.";
};

function FeedbackReports() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [files] = useState(() => (Array.isArray(location.state?.files) ? location.state.files : readSavedResults()));
  const [selectedIndexes, setSelectedIndexes] = useState(() => new Set());
  const [assignmentTitle, setAssignmentTitle] = useState("Writing Assignment");
  const [job, setJob] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState("");
  const [selectedPreview, setSelectedPreview] = useState("");

  const eligibleFiles = useMemo(() => files.map((file, index) => ({ file, index }))
    .filter(({ file }) => typeof file.original_text === "string" && file.original_text.trim() && getFileName(file)), [files]);
  const selectedFiles = eligibleFiles.filter(({ index }) => selectedIndexes.has(index));
  const total = Number(job?.progress?.total) || selectedFiles.length;
  const completed = Number(job?.progress?.completed) || 0;
  const isTerminal = job?.status === "completed" || job?.status === "failed";
  const progressPercent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const failedCount = job?.status === "failed" ? Math.max(0, total - completed) : 0;
  const completedCount = job?.status === "completed" ? total : completed;
  const pendingCount = Math.max(0, total - completedCount - failedCount);
  const displayStatus = job?.status === "completed" ? "Completed" : job?.status === "failed" ? "Failed" : "Processing";

  const counts = useMemo(() => eligibleFiles.reduce((result, { file }) => {
    const risk = getRisk(file);
    result[risk] = (result[risk] || 0) + 1;
    return result;
  }, {}), [eligibleFiles]);

  useEffect(() => {
    if (!job?.id || isTerminal) return undefined;
    let active = true;
    let polling = false;
    const poll = async () => {
      if (polling) return;
      polling = true;
      try {
        const nextJob = await getFeedbackReportJob(job.id);
        if (active) {
          setJob(nextJob);
          setError(nextJob.status === "failed" ? getFriendlyError(nextJob.error) : "");
        }
      } catch (pollError) {
        if (active) setError(getFriendlyError(pollError));
      } finally {
        polling = false;
      }
    };
    poll();
    const interval = window.setInterval(poll, 2000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [job?.id, isTerminal]);

  const toggleFile = (index) => {
    setSelectedIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectMatching = (predicate) => {
    setSelectedIndexes(new Set(eligibleFiles.filter(({ file }) => predicate(file)).map(({ index }) => index)));
  };

  const handleGenerate = async () => {
    if (submittingRef.current || isStarting || !selectedFiles.length) return;
    submittingRef.current = true;
    setError("");
    setIsStarting(true);
    try {
      const payload = {
        assignment_title: assignmentTitle.trim() || "Writing Assignment",
        texts: selectedFiles.map(({ file }) => file.original_text),
        files: selectedFiles.map(({ file, index }) => getFileName(file, index)),
      };
      const started = await createFeedbackReportJob(payload);
      if (!started.job_id) throw new Error("The backend did not return a report job ID.");
      setSelectedPreview("");
      setJob({ id: started.job_id, status: started.status || "queued", progress: { completed: 0, total: payload.texts.length }, usage: {}, artifacts: null });
    } catch (startError) {
      setError(getFriendlyError(startError));
    } finally {
      submittingRef.current = false;
      setIsStarting(false);
    }
  };

  const handleDownload = async () => {
    if (!job?.id || isDownloading) return;
    setError("");
    setIsDownloading(true);
    try {
      const archive = await downloadFeedbackReportArchive(job.id);
      const objectUrl = URL.createObjectURL(archive);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "copycatch_feedback_reports.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (downloadError) {
      setError(getFriendlyError(downloadError));
    } finally {
      setIsDownloading(false);
    }
  };

  const students = job?.students || [];
  const studentArtifacts = job?.artifacts?.student_pdfs || [];
  const previewStudent = students.find((student) => student.student_id === selectedPreview);
  const previewArtifact = studentArtifacts.find((artifact) => artifact.student_id === selectedPreview);
  const previewUrl = previewArtifact ? getFeedbackReportArtifactUrl(previewArtifact.url) : "";

  return (
    <div className="homepage-container feedback-page">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <main className="feedback-dashboard">
        <div className="feedback-page-heading">
          <div><p className="feedback-eyebrow">TEACHER TOOLS</p><h1>Feedback Reports</h1><p>Generate individualized learning feedback and downloadable reports for a class.</p></div>
          <span className="feedback-heading-mark" aria-hidden="true">✦</span>
        </div>

        <section className="feedback-stat-grid" aria-label="Class overview">
          <article className="feedback-stat-card"><span>Total documents analyzed</span><strong>{eligibleFiles.length}</strong><small>Available comparison results</small></article>
          <article className="feedback-stat-card feedback-stat-card--risk"><span>High Risk</span><strong>{counts["High Risk"] || 0}</strong><small>Review evidence and citations</small></article>
          <article className="feedback-stat-card"><span>Moderate</span><strong>{counts.Moderate || 0}</strong><small>Some overlap detected</small></article>
          <article className="feedback-stat-card"><span>Safe / Other</span><strong>{(counts.Safe || 0) + (counts.Other || 0)}</strong><small>Remaining classifications</small></article>
          <article className="feedback-stat-card"><span>Feedback reports generated</span><strong>{job?.status === "completed" ? total : completed}</strong><small>{job?.status === "completed" ? "Individual PDFs ready" : "Current job progress"}</small></article>
        </section>

        <section className="feedback-panel feedback-selection-panel">
          <div className="feedback-section-heading"><div><p className="feedback-eyebrow">REPORT SETUP</p><h2>Select comparison results</h2><p>Choose 2–30 documents with extracted text. The backend computes report similarity from these documents.</p></div><span className="feedback-selected-count">{selectedFiles.length} of {eligibleFiles.length} documents selected</span></div>
          <label className="feedback-assignment-label" htmlFor="feedback-assignment">Assignment title</label>
          <input id="feedback-assignment" className="feedback-assignment-input" value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} maxLength={120} />
          <div className="feedback-selection-controls" role="group" aria-label="Select documents by risk">
            <button type="button" onClick={() => selectMatching(() => true)}>Select All</button>
            <button type="button" onClick={() => selectMatching((file) => getRisk(file) === "High Risk")}>Select High Risk</button>
            <button type="button" onClick={() => selectMatching((file) => getRisk(file) === "Moderate")}>Select Moderate</button>
            <button type="button" onClick={() => selectMatching((file) => getRisk(file) === "Safe")}>Select Safe</button>
            <button type="button" onClick={() => setSelectedIndexes(new Set())}>Clear Selection</button>
          </div>
          <div className="feedback-document-table-wrap">
            <table className="feedback-document-table">
              <thead><tr><th scope="col">Select</th><th scope="col">Document</th><th scope="col">Risk classification</th><th scope="col">Similarity</th></tr></thead>
              <tbody>
                {eligibleFiles.map(({ file, index }) => (
                  <tr key={`${getFileName(file, index)}-${index}`}>
                    <td><input type="checkbox" aria-label={`Select ${getFileName(file, index)}`} checked={selectedIndexes.has(index)} onChange={() => toggleFile(index)} /></td>
                    <td>{getFileName(file, index)}</td>
                    <td><span className={`feedback-risk-pill feedback-risk-pill--${getRisk(file).toLowerCase().replaceAll(" ", "-")}`}>{getRisk(file)}</span></td>
                    <td>{file.similarity !== null && file.similarity !== undefined && file.similarity !== "" && Number.isFinite(Number(file.similarity)) ? `${Number(file.similarity)}%` : "—"}</td>
                  </tr>
                ))}
                {!eligibleFiles.length && <tr><td colSpan="4" className="feedback-empty-row">No comparison documents are available. Run Similarity Detection first, then open Feedback Reports from the results page.</td></tr>}
              </tbody>
            </table>
          </div>
          {eligibleFiles.length > 30 && <p className="feedback-inline-note">The backend accepts up to 30 documents per generation job.</p>}
          <div className="feedback-generate-row">
            <p>{selectedFiles.length < 2 ? "Select at least two documents to start a report job." : selectedFiles.length > 30 ? "Select no more than 30 documents." : "Reports are generated in a background job."}</p>
            <button className="feedback-primary-button" type="button" onClick={handleGenerate} disabled={isStarting || selectedFiles.length < 2 || selectedFiles.length > 30 || Boolean(job && !isTerminal)}>
              {isStarting ? "Starting…" : job && !isTerminal ? "Reports generating…" : "Generate Feedback Reports"}
            </button>
          </div>
        </section>

        {(job || error) && <section className="feedback-panel feedback-job-panel" aria-live="polite">
          <div className="feedback-section-heading"><div><p className="feedback-eyebrow">GENERATION STATUS</p><h2>{job?.status === "completed" ? "Reports ready" : job?.status === "failed" ? "Generation failed" : "Generating reports"}</h2></div><span className={`feedback-job-status feedback-job-status--${job?.status || "error"}`}>{job ? displayStatus : "Failed"}</span></div>
          {error && <p className="feedback-error" role="alert">{error}</p>}
          {job && <>
            <div className="feedback-progress-label"><span>{total} documents selected · {completedCount} of {total} reports completed</span><strong>{progressPercent}%</strong></div>
            <div className="feedback-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax={total || 1} aria-valuenow={completed}><span style={{ width: `${progressPercent}%` }} /></div>
            <div className="feedback-job-metrics"><div><span>Total selected documents</span><strong>{total}</strong></div><div><span>Completed reports</span><strong>{completedCount}</strong></div><div><span>Failed reports</span><strong>{failedCount}</strong></div><div><span>Pending reports</span><strong>{pendingCount}</strong></div></div>
            {job.status === "completed" && <button className="feedback-primary-button feedback-download-button" type="button" onClick={handleDownload} disabled={isDownloading}>{isDownloading ? "Preparing download…" : "Download All Reports (.ZIP)"}</button>}
          </>}
        </section>}

        {job?.status === "completed" && <section className="feedback-panel feedback-preview-panel">
          <div className="feedback-section-heading"><div><p className="feedback-eyebrow">INDIVIDUAL REPORTS</p><h2>Preview student PDFs</h2><p>Each report includes document information, similarity explanation, writing observations, learning recommendations, and practice activities.</p></div></div>
          <div className="feedback-preview-layout">
            <div className="feedback-student-list">
              {students.map((student) => <button type="button" key={student.student_id} className={`feedback-student-button ${selectedPreview === student.student_id ? "active" : ""}`} onClick={() => setSelectedPreview(student.student_id)}><span>{student.name || student.file}</span><small>{student.file}</small></button>)}
              {!students.length && <p className="feedback-inline-note">Student report previews were not returned by this job.</p>}
            </div>
            <div className="feedback-pdf-preview">
              {previewUrl ? <><div className="feedback-pdf-caption">{previewStudent?.file || "Individual feedback report"}</div><iframe title={`Feedback report for ${previewStudent?.file || "student"}`} src={previewUrl} /></> : <p>Select a student report to preview its PDF.</p>}
            </div>
          </div>
        </section>}

        <p className="feedback-storage-note">Jobs are held in backend memory and report files are stored locally. A backend restart can make an active job or its downloads unavailable; multiple backend workers may not share job state or artifacts.</p>
      </main>
    </div>
  );
}

export default FeedbackReports;
