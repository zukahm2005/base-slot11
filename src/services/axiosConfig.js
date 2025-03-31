import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9191", // bạn đổi lại theo backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
