import { useLocation, useNavigate } from "react-router-dom";
import "../styles/spelling.css";

import egg from "../assets/egg.svg";
import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";
import { useState } from "react";


import { exportSpellingPDF } from "../utils/exportSpelling";

function SpellingResult() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state;

  if (!resultData || !resultData.files) {
    return (
      <div>
        <h2>No results found</h2>
        <button onClick={() => navigate("/spelling")}>Go Back</button>
      </div>
    );
  }

  //Normalize function (important for matching)
  const normalize = (word) => {
    return word.toLowerCase().replace(/[^a-z']/gi, "");
  };

  return (
    <div className="file-container1">

      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="result-layout1">

        {/* LEFT TABLE */}
        <div className="table-wrapper1">
          <div className="result-table1">

             <button
              className="dl-but"
              onClick={() => exportSpellingPDF(resultData.files)}
                  >
                    download
                  </button>

            <div className="table-header1">
              <span>File Name</span>
              <span>Spelling Mistake</span>
              <span>Total Words</span>
              <span>Spelling Score</span>
            </div>

            {resultData.files.map((file, index) => (
              <div
                className="table-row1"
                key={index}
                onClick={() => setSelectedFile(file)}
                style={{ cursor: "pointer" }}
              >
                <span>{file.file}</span>
                <span>{file.misspelled}</span>
                <span>{file.total_words}</span>
                <span>{file.score}%</span>
              </div>
            ))}

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="mistake-panel1">

          <div className="nekobox1">
            <h2>Spelling Mistakes</h2>
          </div>

          <div className="mistake-box1">

            {!selectedFile ? (
              <p>Select a file to view mistakes</p>
            ) : (
              <div style={{ lineHeight: "1.8" }}>
                {(selectedFile.original_text || "")
                  .split(/(\s+)/) // keeps spaces + formatting
                  .map((token, index) => {

                    // If it's just space/newline → render normally
                    if (/^\s+$/.test(token)) {
                      return <span key={index}>{token}</span>;
                    }

                    const clean = normalize(token);

                    const isWrong =
                      (selectedFile.misspelled_words || []).includes(clean);

                    return (
                      <span
                        key={index}
                        style={{
                          color: isWrong ? "red" : "black",
                          textDecoration: isWrong ? "underline" : "none",
                        }}
                      >
                        {token}
                      </span>
                    );
                  })}
              </div>
            )}

          </div>
        </div>

      </div>

      <img className="egg2" src={egg} alt="Egg" />
    </div>
  );
}

export default SpellingResult;