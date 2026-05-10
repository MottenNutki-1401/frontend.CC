const BASE_URL =  import.meta.env.VITE_API_URL;

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