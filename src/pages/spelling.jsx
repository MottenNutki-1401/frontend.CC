import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/spelling.css";
import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import AnalysisUpload from "../components/AnalysisUpload.jsx";
import { handleDrop, handleDragOver, handleFileChange } from "../components/dragdrop";
import { uploadFiles, getSpelling } from "../api/api";

function Spelling() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select files first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const uploadData = await uploadFiles(formData);
      const spellData = await getSpelling(uploadData);
      navigate("/SpellingResult", { state: { files: spellData.results } });
    } catch (error) {
      console.error("Spelling error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container spelling-page">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <AnalysisUpload
        title="Spelling Checker"
        description="Upload documents to find spelling issues and review clear correction suggestions in one place."
        files={files}
        fileInputId="spelling-file-input"
        onDrop={(event) => handleDrop(event, setFiles)}
        onDragOver={handleDragOver}
        onFileChange={(event) => handleFileChange(event, setFiles)}
        onAnalyze={handleUpload}
        onRemove={() => setFiles([])}
        analyzeLabel="Check spelling"
        loadingLabel="Checking spelling..."
        loading={loading}
      />
    </div>
  );
}

export default Spelling;
