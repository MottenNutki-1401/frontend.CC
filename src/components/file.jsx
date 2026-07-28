import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadFiles, getSimilarity } from "../api/api";
import { handleDrop, handleDragOver, handleFileChange } from "./dragdrop";
import "../styles/file.css";

import Header from "./header.jsx";
import Sidebar from "./sidebar.jsx";
import AnalysisUpload from "./AnalysisUpload.jsx";

function File() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => setFiles([]);

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("No files selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const uploadData = await uploadFiles(formData);
      const simData = await getSimilarity(uploadData);
      const results = simData.results || simData;
      navigate("/result", { state: { files: results } });
    } catch (error) {
      console.error("Similarity error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container similarity-page">
      <Header toggleSidebar={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      <AnalysisUpload
        title="Similarity Detection"
        description="Upload student submissions to identify matching content and review possible similarities in one place."
        files={files}
        fileInputId="similarity-file-input"
        onDrop={(event) => handleDrop(event, setFiles)}
        onDragOver={handleDragOver}
        onFileChange={(event) => handleFileChange(event, setFiles)}
        onAnalyze={handleUpload}
        onRemove={handleCancel}
        analyzeLabel="Analyze similarity"
        loadingLabel="Checking for similarities..."
        loading={loading}
      />
    </div>
  );
}

export default File;
