import "../styles/results-dashboard.css";

const getScoreTone = (value) => {
  const score = Number(value) || 0;
  if (score >= 85) return "success";
  if (score >= 60) return "warning";
  return "danger";
};

export function ScoreMeter({ value }) {
  const score = Math.max(0, Math.min(100, Number(value) || 0));
  const tone = getScoreTone(score);

  return (
    <div className={`result-score-meter result-score-meter--${tone}`} aria-label={`${score}%`}>
      <span className="result-score-meter-bar"><span style={{ width: `${score}%` }} /></span>
      <strong>{score}%</strong>
    </div>
  );
}

export function ResultBadge({ children, tone = "neutral" }) {
  return <span className={`result-badge result-badge--${tone}`}>{children}</span>;
}

function ResultsDashboard({
  eyebrow = "COPYCATCH WORKSPACE",
  title,
  description,
  summaryCards,
  onDownload,
  children,
  compact = false,
}) {
  const Heading = compact ? "h2" : "h1";

  return (
    <section className={`results-dashboard ${compact ? "results-dashboard--compact" : ""}`}>
      <div className="results-dashboard-intro">
        <div>
          <p className="results-dashboard-eyebrow">{eyebrow}</p>
          <Heading>{title}</Heading>
          {description && <p>{description}</p>}
        </div>
        <button className="results-download-button" onClick={onDownload}>Download Report</button>
      </div>

      <div className="results-summary-grid">
        {summaryCards.map((card) => (
          <article className="results-summary-card" key={card.label}>
            <p>{card.label}</p>
            <strong className={card.tone ? `results-summary-value results-summary-value--${card.tone}` : "results-summary-value"}>{card.value}</strong>
            {card.detail && <span>{card.detail}</span>}
          </article>
        ))}
      </div>

      {children}
    </section>
  );
}

export default ResultsDashboard;
