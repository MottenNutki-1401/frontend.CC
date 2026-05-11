import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/spelling.css";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";

import { handleDrop, handleDragOver, handleFileChange } from "../components/dragdrop"; 
import { uploadFiles, getSpelling } from "../api/api"; // 

import egg from "../assets/egg.svg";
import book2 from "../assets/book2.png";

function Spelling() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  // FIXED HANDLE UPLOAD
  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first!");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // STEP 1: upload files
      const uploadData = await uploadFiles(formData);
      console.log("UPLOAD:", uploadData);

      // STEP 2: spelling analysis
      const spellData = await getSpelling(uploadData);
      console.log("SPELL DATA:", spellData);

      // STEP 3: navigate with correct data
      navigate("/SpellingResult", {
        state: {
          files: spellData.results //IMPORTANT
        }
      });

    } catch (error) {
      console.error("Spelling error:", error);
      alert("Something went wrong!");
    }
  };

  const handleCancel = () => {
    setFiles([]);
  };

  return (
    <div className="homepage-container">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="file-container">
        <div className="upload-box">
          <h1 className="meow">Spelling checker</h1>
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
              onChange={(e) => handleFileChange(e, setFiles)}
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
            Check
          </button>

          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        <img className="egg1" src={egg} alt="Egg" />
        <img className="books" src={book2} alt="books" />
      </div>
    </div>
  );
}

export default Spelling;