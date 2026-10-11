import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from "axios";
axios.defaults.withCredentials = true;

// Empty string = same origin. /api and /uploads are proxied to the backend
// by vite.config.js in dev and by vercel.json in production.
export const backend_server = "";

ReactDOM.createRoot(document.getElementById("root")).render(<App></App>);