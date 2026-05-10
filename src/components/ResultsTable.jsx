function ResultsTable({ results }) {

  console.log("RESULTS:", results);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Similarity Results</h3>

      <table border="1" style={{ width: "100%", marginTop: "10px", color: "black" }}>
        <thead>
          <tr>
            <th>File</th>
            <th>Most Similar</th>
            <th>Similarity (%)</th>
          </tr>
        </thead>

        <tbody>
          {results.map((file, index) => (
            <tr key={index}>
              <td>{file.file}</td>
              <td>{file.most_similar}</td>
              <td>{Math.round(file.similarity)}%</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default ResultsTable;