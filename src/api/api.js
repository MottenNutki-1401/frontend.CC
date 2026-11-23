const BASE_URL =  import.meta.env.VITE_API_URL;

const feedbackReportsUrl = (path = "") => `${BASE_URL}/feedback-reports${path}`;

const readApiResponse = async (response) => {
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const data = await response.json();
      message = data.detail || data.message || message;
    } catch {
      // Keep the status-based message when the server did not return JSON.
    }
    throw new Error(message);
  }
  return response;
};

export const createFeedbackReportJob = async (payload) => {
  const response = await readApiResponse(await fetch(feedbackReportsUrl("/jobs"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));
  return response.json();
};

export const getFeedbackReportJob = async (jobId) => {
  const response = await readApiResponse(await fetch(feedbackReportsUrl(`/jobs/${encodeURIComponent(jobId)}`)));
  return response.json();
};

export const downloadFeedbackReportArchive = async (jobId) => {
  const response = await readApiResponse(await fetch(feedbackReportsUrl(`/jobs/${encodeURIComponent(jobId)}/download`)));
  return response.blob();
};

export const getFeedbackReportArtifactUrl = (artifactPath) => {
  if (!artifactPath) return "";
  return new URL(artifactPath, `${BASE_URL.replace(/\/$/, "")}/`).toString();
};

// upload files
export const uploadFiles = async (formData) => {
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData
  });
  return res.json();
};

// similarity
export const getSimilarity = async (data) => {
  const res = await fetch(`${BASE_URL}/similarity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

// spelling
export const getSpelling = async (data) => {
  const res = await fetch(`${BASE_URL}/spelling`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

//grammar 
export const getGrammar = async (data) => {
  const res = await fetch(`${BASE_URL}/grammar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};

//grading
export const getGrades = async (data) => {
  const res = await fetch(`${BASE_URL}/grading`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)
  });

  return res.json();
};
