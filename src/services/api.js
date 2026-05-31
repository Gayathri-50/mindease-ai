import axios from "axios";

const API = axios.create({
  baseURL: "https://mindease-ai-mtzh.onrender.com/api",
});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    // FIX: Use standard "Bearer <token>" format
    req.headers.authorization = `Bearer ${token}`;
  }

  return req;

});

export default API;