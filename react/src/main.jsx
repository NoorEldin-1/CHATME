import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import store from "./store/store.js";

export const BASE_URL = `http://127.0.0.1:8000/api/`;
export const FILE_URL = `http://localhost:8000`;

export const formatRelativeTime = (dateString) => {
  if (!dateString) return "Invalid date";

  const now = new Date();
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Invalid date";

  const diffInSeconds = Math.floor((now - date) / 1000);

  const units = [
    { label: "year", seconds: 365 * 24 * 60 * 60 },
    { label: "month", seconds: 30 * 24 * 60 * 60 },
    { label: "week", seconds: 7 * 24 * 60 * 60 },
    { label: "day", seconds: 24 * 60 * 60 },
    { label: "hour", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value > 0) {
      return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
