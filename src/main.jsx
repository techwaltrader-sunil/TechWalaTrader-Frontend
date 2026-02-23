import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TradeProvider } from "./context/TradeContext"; // ✅ Import kiya
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ✅ App ko Provider ke andar daal diya */}
    <TradeProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </TradeProvider>
  </StrictMode>
);
