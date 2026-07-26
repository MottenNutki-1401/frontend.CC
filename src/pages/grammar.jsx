import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/grammar.css";

import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";

import {
  handleDrop,
  handleDragOver,
  handleFileChange
} from "../components/dragdrop";

import {
  uploadFiles,
  getGrammar
} from "../api/api";

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / (1024 ** unitIndex);

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

function Grammar() {

  const [isSidebarOpen, setIsSidebarOpen]
    = useState(false);

  const [files, setFiles]
    = useState([]);

  const [loading, setLoading]
    = useState(false);

  const navigate = useNavigate();

  const handleUpload = async () => {

    if (files.length === 0) {

      alert("Please select files first!");

      return;
    }

    setLoading(true);

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {

      formData.append("files", files[i]);
    }

    try {

      // upload
      const uploadData =
        await uploadFiles(formData);

      console.log("UPLOAD:", uploadData);

      // grammar analysis
      const grammarData =
        await getGrammar(uploadData);

      console.log("GRAMMAR:", grammarData);

      navigate("/grammar-result", {

        state: {

          files: grammarData.results
        }
      });

    } catch (error) {

      console.error("Grammar error:", error);

      alert("Something went wrong!");

    } finally {

      setLoading(false);
    }
  };

  const handleCancel = () => {

    setFiles([]);
  };

  return (

    <div className="homepage-container">

      <Header
        toggleSidebar={() =>
          setIsSidebarOpen(true)
        }
      />

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() =>
          setIsSidebarOpen(false)
        }
      />

      <main className="grammar-upload-page">
        <section className="grammar-upload-content" aria-labelledby="grammar-title">
          <div className="grammar-upload-intro">
            <p className="grammar-upload-eyebrow">COPYCATCH WORKSPACE</p>
            <h1 id="grammar-title">Grammar Checker</h1>
            <p>
              Upload documents to identify grammar and punctuation issues, then
              review clearer writing recommendations in one place.
            </p>
          </div>

          <div className="grammar-upload-card">
            {files.length === 0 ? (
              <label
                className="grammar-dropzone"
                htmlFor="grammar-file-input"
                onDrop={(e) => handleDrop(e, setFiles)}
                onDragOver={handleDragOver}
              >
                <span className="grammar-upload-icon" aria-hidden="true">↑</span>
                <span className="grammar-dropzone-title">Upload your documents</span>
                <span className="grammar-dropzone-copy">
                  Drag and drop files here, or click to browse.
                </span>
                <span className="grammar-dropzone-hint">PDF, DOCX, or TXT</span>
              </label>
            ) : (
              <div className="grammar-file-list" aria-live="polite">
                {files.map((file, index) => (
                  <article className="grammar-file-card" key={index}>
                    <span className="grammar-file-icon" aria-hidden="true">DOC</span>
                    <div className="grammar-file-details">
                      <strong>{file.name}</strong>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                    <label className="grammar-file-change" htmlFor="grammar-file-input">
                      Change
                    </label>
                  </article>
                ))}
              </div>
            )}

            <input
              id="grammar-file-input"
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, setFiles)}
              className="grammar-file-input"
            />

            <div className="grammar-actions">
              <button
                className="grammar-analyze-button"
                onClick={handleUpload}
                disabled={loading}
              >
                Analyze Grammar
              </button>

              {files.length > 0 && (
                <button
                  className="grammar-secondary-button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Remove files
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {loading && (
        <div className="grammar-loading-overlay" role="status" aria-live="polite">
          <div className="grammar-loading-card">
            <span className="grammar-spinner" aria-hidden="true" />
            <div className="grammar-loading-messages">
              <span>Uploading document...</span>
              <span>Preparing analysis...</span>
              <span>Checking grammar...</span>
              <span>Reviewing punctuation...</span>
              <span>Generating results...</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Grammar;
