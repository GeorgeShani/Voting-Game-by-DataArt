import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true, // Ensures cookies (auth token) are sent
  headers: { "Content-Type": "application/json" },
});
