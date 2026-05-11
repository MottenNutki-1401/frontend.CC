import { useLocation, useNavigate } from "react-router-dom";
import "../styles/result.css";

import Header from "../components/header.jsx";
import Sidebar from "../components/sidebar.jsx";
import { useState } from "react";

import egg from "../assets/egg.svg";

import { exportSimilarityPDF } from "../utils/exportSimilarity";


function Result() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state;
  console.log(resultData);

  if (!resultData) {
    return (


      <div>
        <h2>No results found </h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (

    
    <div className="file-container">

  <Header toggleSidebar={() => setIsSidebarOpen(true)} />
            <Sidebar 
            isOpen={isSidebarOpen}
            closeSidebar={() => setIsSidebarOpen(false)} />

      <div className="result-table">
                <button
                    className="dl-but11"
                    onClick={() => exportSimilarityPDF(resultData.files)}
                  >
                      download
                    </button>

        <div className="table-header">
          <span>File Name</span>
          <span>Status</span>
          <span>Most Similar</span>
          <span>Similarity</span>
        </div>

        {resultData.files.map((file, index) => (
          <div className="table-row" key={index}>
            <span >{file.file}</span>

            {/* status */}
            <span >
              {file.similarity > 70 ? "High Risk" : "Safe"}
            </span>

            <span>{file.most_similar}</span>

            <span>{file.similarity}%</span>
          </div>
        ))}
      </div>
        <img className="egg2" src={egg} alt="Egg" />
    </div>
  );
}

export default Result;

