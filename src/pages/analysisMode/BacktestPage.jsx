import React from "react";
import TradeForm from "../../components/forms/TradeForm";

const BacktestPage = () => {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Magic: Mode passed as BACKTEST */}
      <TradeForm mode="BACKTEST" />
    </div>
  );
};

export default BacktestPage;

