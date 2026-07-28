import "../styles/analysis-upload.css";

const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / (1024 ** unitIndex);

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

function AnalysisUpload({
  eyebrow = "COPYCATCH WORKSPACE",
  title,
  description,
  files,
  fileInputId,
  onDrop,
  onDragOver,
  onFileChange,
  onAnalyze,
  onRemove,
  analyzeLabel,
  loadingLabel,
  loading,
}) {
  return (
    <main className="analysis-upload-page">
      <section className="analysis-upload-content" aria-labelledby={`${fileInputId}-title`}>
        <div className="analysis-upload-intro">
          <p className="analysis-upload-eyebrow">{eyebrow}</p>
          <h1 id={`${fileInputId}-title`}>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="analysis-upload-card">
          {files.length === 0 ? (
            <label
              className="analysis-dropzone"
              htmlFor={fileInputId}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <span className="analysis-upload-icon" aria-hidden="true">↑</span>
              <span className="analysis-dropzone-title">Upload your documents</span>
              <span className="analysis-dropzone-copy">Drag and drop files here, or click to browse.</span>
              <span className="analysis-dropzone-hint">PDF, DOCX, OR TXT</span>
            </label>
          ) : (
            <div className="analysis-file-list" aria-live="polite">
              {files.map((file, index) => (
                <article className="analysis-file-card" key={`${file.name}-${index}`}>
                  <span className="analysis-file-icon" aria-hidden="true">DOC</span>
                  <div className="analysis-file-details">
                    <strong>{file.name}</strong>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <label className="analysis-file-change" htmlFor={fileInputId}>Change</label>
                </article>
              ))}
            </div>
          )}

          <input
            id={fileInputId}
            type="file"
            multiple
            onChange={onFileChange}
            className="analysis-file-input"
          />

          <div className="analysis-actions">
            <button className="analysis-primary-button" onClick={onAnalyze} disabled={loading}>
              {loading ? loadingLabel : analyzeLabel}
            </button>
            {files.length > 0 && (
              <button className="analysis-secondary-button" onClick={onRemove} disabled={loading}>
                Remove files
              </button>
            )}
          </div>
        </div>
      </section>

      {loading && (
        <div className="analysis-loading-overlay" role="status" aria-live="polite">
          <div className="analysis-loading-card">
            <span className="analysis-spinner" aria-hidden="true" />
            <div className="analysis-loading-messages">
              <span>Uploading documents...</span>
              <span>Preparing analysis...</span>
              <span>{loadingLabel}</span>
              <span>Generating results...</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AnalysisUpload;
