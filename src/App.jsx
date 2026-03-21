import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Components
import Layout from "./components/layout/Layout";

// --- ANALYSIS MODE PAGES ---
import DashboardPage from "./pages/analysisMode/DashboardPage";
import JournalPage from "./pages/analysisMode/JournalPage";
import AnalyticsPage from "./pages/analysisMode/AnalyticsPage";
import Overview from "./pages/analysisMode/Overview";

// --- ALGO MODE PAGES (NEW) ---
import AlgoDashboard from "./pages/algoMode/AlgoDashboard"; 
import BrokersPage from "./pages/algoMode/Brokers"; 
import StrategiesPage from "./pages/algoMode/Strategies"; 
import StrategyBuilderPage from "./pages/algoMode/StrategyBuilder"; 
import BacktestPage from "./pages/algoMode/Backtest"; 
import ReportsPage from "./pages/algoMode/Reports"; 
import SubscriptionsPage from "./pages/algoMode/Subscriptions"; 

import BrokerLogin from './pages/algoMode/BrokerLogin';
// Note: Jab aage Strategies aur Brokers page banayenge to wo bhi yahi import honge

import ImportNotion from "./components/forms/ImportNotion";
import AddBrokers from "./components/algoComponents/AlgoDashboard/AddBrokers";


function App() {
  return (
   
    <BrowserRouter>
      {/* Layout sabke bahar rahega taki Sidebar hamesha dikhe */}
      <Layout>
        <Routes>
          {/* --- ANALYSIS ROUTES --- */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/tradeForm" element={<ImportNotion />} />

          {/* --- 🔥 NEW: ALGO ROUTES --- */}
          {/* Jab user Layout me Algo button dabayega to ye page dikhega */}
          <Route path="/algo-dashboard" element={<AlgoDashboard />} />
          
          {/* Future Algo Routes (Commented out for now) */}
          <Route path="/strategies" element={<StrategiesPage />} />
          <Route path="/strategy-builder" element={<StrategyBuilderPage />} />
          <Route path="/brokers" element={<BrokersPage />} />
          <Route path="/add-brokers" element={<AddBrokers />} />
          <Route path="/backtest" element={<BacktestPage />} />
          <Route path="/backtest/:strategyId" element={<BacktestPage />} />
          {/* <Route path="/algo-logs" element={<AlgoLogsPage />} /> */}
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />

          <Route path="/broker-login/:brokerId" element={<BrokerLogin />} />

          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;