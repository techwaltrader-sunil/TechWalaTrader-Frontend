// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { TradeProvider } from "./context/TradeContext"; // ✅ Import kiya
// import { ThemeProvider } from './context/ThemeContext';

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     {/* ✅ App ko Provider ke andar daal diya */}
//     <TradeProvider>
//       <ThemeProvider>
//         <App />
//       </ThemeProvider>
//     </TradeProvider>
//   </StrictMode>
// );



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TradeProvider } from "./context/TradeContext"; 
import { ThemeProvider } from './context/ThemeContext';

// 👇 1. यहाँ नया Context इम्पोर्ट करें
import { TradingModeProvider } from "./context/TradingModeContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TradeProvider>
      <ThemeProvider>
        
        {/* 👇 2. App को TradingModeProvider के अंदर रैप कर दें */}
        <TradingModeProvider>
          <App />
        </TradingModeProvider>
        
      </ThemeProvider>
    </TradeProvider>
  </StrictMode>
);
