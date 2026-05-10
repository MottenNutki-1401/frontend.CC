import { useLocation, useNavigate } from "react-router-dom";
import "../styles/grammar.css";

import egg from "../assets/egg.svg";
import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";
import { useState } from "react";

function GrammarResult() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state;

  if (!resultData || !resultData.files) {
    return (
      <div>
        <h2>No results found</h2>
        <button onClick={() => navigate("/grammar")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="file-container2">

      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="result-layout2">

        {/* LEFT TABLE */}
        <div className="table-wrapper2">
          <div className="result-table2">

            <div className="table-header2">
              <span>File Name</span>
              <span>Grammatical Mistake</span>
              <span>Total Words</span>
              <span>Grammar Score</span>
            </div>

            {resultData.files.map((file, index) => (
              <div
                className="table-row1"
                key={index}
                onClick={() => setSelectedFile(file)}
                style={{ cursor: "pointer" }}
              >
                <span>{file.file}</span>
                <span>{file.mistakes}</span>
                <span>{file.total_words}</span>
                <span>{file.score}%</span>
              </div>
            ))}

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="mistake-panel2">
          <div className="nekobox1">
            <h2>Grammatical Mistakes</h2>
            <button className="dl-but">download</button>
          </div>

          <div className="mistake-box2">

            {!selectedFile ? (
              <p>Select a file to view mistakes</p>
            ) : (
              <div>
                {(() => {
                  const text = selectedFile.original_text || "";
                  const issues = selectedFile.issues || [];

                  const sorted = [...issues].sort((a, b) => a.offset - b.offset);

                  let elements = [];
                  let lastIndex = 0;

                  sorted.forEach((issue, i) => {
                    const start = issue.offset;
                    const end = start + issue.length;

                    // normal text
                    elements.push(
                      <span key={"text-" + i}>
                        {text.slice(lastIndex, start)}
                      </span>
                    );

                    // highlighted error
                    elements.push(
                      <span
                        key={"error-" + i}
                        style={{
                          backgroundColor: "rgba(0, 106, 255, 0.26)",
                          borderBottom: "2px dotted red"
                        }}
                        title={issue.message}
                      >
                        {text.slice(start, end)}
                      </span>
                    );

                    lastIndex = end;
                  });

                  // remaining text
                  elements.push(
                    <span key="last">
                      {text.slice(lastIndex)}
                    </span>
                  );

                  return elements;
                })()}
              </div>
            )}

          </div>
        </div>

      </div>

      <img className="egg2" src={egg} alt="Egg" />
    </div>
  );
}

export default GrammarResult;