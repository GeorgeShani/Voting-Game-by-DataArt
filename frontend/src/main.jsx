import { createRoot } from "react-dom/client";
import { Providers } from "./utils/Providers.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Providers>
    <App />
  </Providers>
);
