// Axios
// - no need for json parsing
// - no need to use JSON.stringify() for request body
// - throws appropriate error to catch block after an API request
// - can create a custom axios instance with header appended for reuse through out the app

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
