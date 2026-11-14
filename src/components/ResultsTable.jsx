import { ResultBadge, ScoreMeter } from "./ResultsDashboard.jsx";

function ResultsTable({ results, onSelectFile }) {
  return (
    <section className="results-table-card">
      <div className="results-table-scroll">
        <div className="results-data-table" style={{ "--results-columns": "1.55fr 0.9fr 1.55fr 1fr" }}>
          <div className="results-table-header">
            <span>FILE NAME</span>
            <span>Status</span>
            <span>Most similar</span>
            <span>Similarity</span>
          </div>
          {results.map((file, index) => {
            const highRisk = Number(file.similarity) > 70;
            return (
              <div className="results-table-row" key={index}>
                <span>
                  <button
                    type="button"
                    className="comparison-file-link"
                    onClick={() => onSelectFile(file)}
                  >
                    {file.file}
                  </button>
                </span>
                <span><ResultBadge tone={highRisk ? "danger" : "success"}>{highRisk ? "High Risk" : "Safe"}</ResultBadge></span>
                <span>{file.most_similar}</span>
                <span><ScoreMeter value={file.similarity} /></span>
              </div>
            );
          })}
          {results.length === 0 && <p className="results-empty-state">No similarity results are available.</p>}
        </div>
      </div>
    </section>
  );
}

export default ResultsTable;
