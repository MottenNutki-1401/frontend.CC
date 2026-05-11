import { useState } from "react";

import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";

import { exportGradingPDF } from "../utils/exportGrading";

import {
  handleDrop,
  handleDragOver,
  handleFileChange,
} from "../components/dragdrop";

import { uploadFiles, getGrades } from "../api/api";

import "../styles/grading.css";
import egg from "../assets/egg.svg";

function Grading() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [files, setFiles] = useState([]);

  const [results, setResults] = useState([]);

  const [mode, setMode] = useState("standard");

  //load
  const [loading, setLoading] = useState(false);

  // WEIGHTS
  const [weights, setWeights] = useState({
    grammar: 40,
    spelling: 30,
    originality: 30,
  });

  // PRESETS
  const presets = {

    standard: {
      grammar: 40,
      spelling: 30,
      originality: 30,
    },

    grammar: {
      grammar: 60,
      spelling: 20,
      originality: 20,
    },

    balanced: {
      grammar: 34,
      spelling: 33,
      originality: 33,
    },
  };

  // PRESET CHANGE
  const handlePreset = (value) => {

    setMode(value);

    if (value !== "custom") {
      setWeights(presets[value]);
    }
  };

  // CUSTOM INPUT CHANGE
  const handleInputChange = (key, value) => {

    setWeights((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  // TOTAL %
  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  // ANALYZE
  const handleAnalyze = async () => {

    if (files.length === 0) {

      alert("Please upload files first");

      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {

      formData.append("files", files[i]);
    }

    try {
       //loading
       setLoading(true);
      // upload endpoint
      const uploadData = await uploadFiles(formData);

      console.log("UPLOAD:", uploadData);

      // attach weights
      uploadData.weights = weights;

      // grading endpoint
      const gradingData = await getGrades(uploadData);

      console.log("GRADING:", gradingData);

      // set results
      setResults(gradingData.results || []);

      //loading false
      setLoading(false);

    } catch (error) {

      console.error("Grading error:", error);
      setLoading(false);

    }
  };

  // CANCEL
  const handleCancel = () => {

    setFiles([]);

    setResults([]);
  };

  return (

    <div className="homepage-container">

      <Header toggleSidebar={() => setIsSidebarOpen(true)} />

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="grading-layout">

        {/* LEFT SIDE */}
        <div className="grading-left">

          {/* TOP BAR */}
          <div className="top-bar">

            <h1 className="title11">
              Automated Grading
            </h1>

            <div className="top-bar">

                      <button
                      className="compare-btn1"
                      onClick={handleAnalyze}
                      disabled={loading}
                         >
                      {loading ? "Checking..." : "Check"}
                    </button>

              <button
                className="cancel-btn1"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>
          </div>

          {/* WEIGHT SYSTEM */}
          <div className="weight-box">

            <div className="weight-header">

              <h2>Grading Weights</h2>

              <p>
                Choose a preset or customize
              </p>

            </div>

            {/* DROPDOWN */}
            <select
              className="preset-select"
              value={mode}
              onChange={(e) => handlePreset(e.target.value)}
            >

              <option value="standard">
                Standard (Grammar: 40%, Spelling: 30%, Originality: 30%)
              </option>

              <option value="grammar">
                Grammar Focus (Grammar: 60%, Spelling: 20%, Originality: 20%)
              </option>

              <option value="balanced">
                Balanced (Grammar: 34%, Spelling: 33%, Originality: 33%)
              </option>

              <option value="custom">
                Custom
              </option>

            </select>

            {/* CUSTOM INPUTS */}
            {mode === "custom" && (

              <div className="weight-inputs">

                {/* GRAMMAR */}
                <div className="input-row">

                  <span>Grammar</span>

                  <input
                    type="number"
                    value={weights.grammar}
                    onChange={(e) =>
                      handleInputChange("grammar", e.target.value)
                    }
                  />

                </div>

                {/* SPELLING */}
                <div className="input-row">

                  <span>Spelling</span>

                  <input
                    type="number"
                    value={weights.spelling}
                    onChange={(e) =>
                      handleInputChange("spelling", e.target.value)
                    }
                  />

                </div>

                {/* ORIGINALITY */}
                <div className="input-row">

                  <span>Originality</span>

                  <input
                    type="number"
                    value={weights.originality}
                    onChange={(e) =>
                      handleInputChange("originality", e.target.value)
                    }
                  />

                </div>

              </div>
            )}

            {/* TOTAL */}
            <p className={`total ${total !== 100 ? "error" : ""}`}>

              Total: {total}%

            </p>

          </div>

          {/* UPLOAD */}
          <div className="upload-box1">

            <div className="weight-header">

              <h1>Files</h1>

              <p>
                Drop files here or click to choose
              </p>

            </div>

            {/* DROP AREA */}
            {files.length === 0 && (

              <div
                className="drop-area"
                onDrop={(e) => handleDrop(e, setFiles)}
                onDragOver={handleDragOver}
              >

                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e, setFiles)}
                  className="file-input"
                />

              </div>
            )}

            {/* FILE LIST */}
            {files.length > 0 && (

              <div className="file-list">

                {files.map((file, i) => (

                  <div key={i} className="file-item">

                    {file.name}

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
              {/* RIGHT SIDE */}
              <div className="grading-right">

                <div className="grading-result-table">

                  {/* TABLE HEADER */}
                  <div className="grading-table-header">

                    <span>File Name</span>

                    <span>Grammar</span>

                    <span>Spelling</span>

                    <span>Originality</span>

                    <span>Total Words</span>

                    <span>Final Grade</span>

                  </div>

                  {/* RESULTS */}
                  {results.map((r, i) => (

                    <div className="grading-table-row" key={i}>

                      <span>{r.file}</span>

                      <span>{r.grammar}%</span>

                      <span>{r.spelling}%</span>

                      <span>{r.originality}%</span>

                      <span>{r.total_words}</span>

                      <span>{r.final_score}%</span>

                    </div>
                  ))}

                </div>

              </div>

      </div>

          <button
          className="dl-but11"
          onClick={() => exportGradingPDF(results)}
        >
          Download
        </button>

    </div>
  );
}

export default Grading;