function ActionButtons({ onAnalyze, onSpelling }) {
  return (
    <div style={{ marginTop: "10px" }}>
      
      <button
        onClick={onAnalyze}
        style={{
          backgroundColor: "#1a73e8",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          marginRight: "10px"
        }}
      >
        Analyze Similarity
      </button>

      <button
        onClick={onSpelling}
        style={{
          backgroundColor: "#34a853",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Check Spelling
      </button>

    </div>
  );
}

export default ActionButtons;