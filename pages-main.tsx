import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NiceExplorer from "./app/NiceExplorer";
import "./app/globals.css";

const root = document.getElementById("root");

if (!root) throw new Error("Missing application root");

createRoot(root).render(
  <StrictMode>
    <NiceExplorer />
  </StrictMode>,
);
