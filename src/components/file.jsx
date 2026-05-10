import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFiles, getSimilarity } from "../api/api";
import { handleDrop, handleDragOver, handleFileChange } from "./dragdrop";

import "../styles/file.css";
import egg from "../assets/egg.svg";
import book2 from "../assets/book2.png";

import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";



function File({ setPage }) {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCancel = () => {
  setFiles([]);
};

const handleUpload = async () => {
  if (files.length === 0) {
    alert("No files selected");
    return;
  }

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  try {
    const uploadData = await uploadFiles(formData);

    const simData = await getSimilarity(uploadData);

    console.log("SIM:", simData);

    //  USE YOUR WORKING LOGIC
    const results = simData.results || simData;

    // SEND TO RESULT PAGE
    navigate("/result", {
      state: {
        files: results
      }
    });

  } catch (error) {
    console.error("Similarity error:", error);
  }
};
return (
  <>
    <Header toggleSidebar={() => setIsSidebarOpen(true)} />
    
    <Sidebar
      isOpen={isSidebarOpen}
      closeSidebar={() => setIsSidebarOpen(false)}
    />

    <div className="file-container">
      <div className="upload-box">
        <h1 className="meow">Similarity Detection</h1>
        <h2 className="title">Upload Student Submissions</h2>

        <div
          className="drop-area"
          onDrop={(e) => handleDrop(e, setFiles)}
          onDragOver={handleDragOver}
        >
          <p>Drop files here or click to choose files</p>

          <input
            type="file"
            multiple
            onChange={(e) => {
              console.log(e.target.files);
              handleFileChange(e, setFiles);
            }}
            className="file-input"
          />
        </div>

        {files.length > 0 && (
          <div className="file-list">
            {files.map((file, index) => (
              <div className="file-item" key={index}>
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="btns">
        <button className="compare-btn" onClick={handleUpload}>
          ANALYZE
        </button>

        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>

      <img className="egg1" src={egg} alt="Egg" />
      <img className="books" src={book2} alt="books" />
    </div>
  </>
);
}

export default File;