import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./app/Router.jsx";
import Providers from "./app/Providers.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <Router />
    </Providers>
  </StrictMode>
);
