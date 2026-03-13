import React, { useEffect, useState } from "react";
import { TRADE_DATA } from "../../data/tradeLogic";
import {
  ClipboardList,
  BrainCircuit,
  Save,
  Loader2,
  AlertCircle,
  X,
  Eye,
  Clock,
  Zap,
  AlertTriangle,
} from "lucide-react";
import SectionWrapper from "../SectionWrapper";
import SelectionButton from "../SelectionButton";

// 🔥 PSYCHOLOGY DATA CONSTANTS
const PSYCHOLOGY_TAGS = {
  emotions: [
    { label: "Neutral", emoji: "😐", color: "bg-gray-100 border-gray-300" },
    {
      label: "Confident",
      emoji: "🦁",
      color: "bg-blue-100 border-blue-300 text-blue-800",
    },
    {
      label: "Anxious",
      emoji: "😰",
      color: "bg-yellow-100 border-yellow-300 text-yellow-800",
    },
    {
      label: "FOMO",
      emoji: "🏃",
      color: "bg-orange-100 border-orange-300 text-orange-800",
    },
    {
      label: "Greedy",
      emoji: "🤑",
      color: "bg-green-100 border-green-300 text-green-800",
    },
    {
      label: "Revenge",
      emoji: "😡",
      color: "bg-red-100 border-red-300 text-red-800",
    },
    {
      label: "Hopeful",
      emoji: "🙏",
      color: "bg-purple-100 border-purple-300 text-purple-800",
    },
  ],
  mistakes: [
    "NO MISTAKE",
    "Early Entry",
    "Late Entry",
    "Chase Trade",
    "Stoploss Widen",
    "Early Exit",
    "Revenge Trade",
    "Oversizing",
    "No Setup (Random)",
    "Distracted",
    "System Failure",
  ],
};

const TradeForm = ({
  mode: initialMode = "LIVE",
  initialData,
  onSuccess,
  isReadOnly = false,
}) => {
  // 1. STATE MANAGEMENT
  const [mode, setMode] = useState(initialMode);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    pair: "NIFTY",
    timeframe: "5M",
    quantity: "",
    entryPrice: "",
    exitPrice: "",
    entryTime: "",
    exitTime: "",
    emotions: "Neutral",
    mistake: "NO MISTAKE",
    trend: "",
    direction: "Call",
    tradeType: "",
    setup: "",
    entryType: "",
    exitReason: "",
    result: "",
    targetLevel: "",
    notes: "",
  });

  const [appCharge, setAppCharge] = useState(40);
  const [calculations, setCalculations] = useState({
    grossPnL: 0,
    totalBrokerage: 0,
    netPnL: 0,
    pointsCaptured: 0,
    breakdown: {},
  });

  const [tradeDuration, setTradeDuration] = useState("");

  const formatToLocalISO = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  // 2. EDIT MODE POPULATION
  useEffect(() => {
    if (initialData) {
      if (initialData.mode) setMode(initialData.mode);

      let currentImages = [];
      if (initialData.imageUrls && initialData.imageUrls.length > 0) {
        currentImages = initialData.imageUrls;
      } else if (initialData.imageUrl) {
        currentImages = [initialData.imageUrl];
      }
      setExistingImages(currentImages);
      setSelectedPreview(null);
      setImageFile([]);

      const dataToPopulate = { ...initialData };
      if (dataToPopulate.date)
        dataToPopulate.date = new Date(dataToPopulate.date)
          .toISOString()
          .split("T")[0];

      if (dataToPopulate.entryTime)
        dataToPopulate.entryTime = formatToLocalISO(dataToPopulate.entryTime);
      if (dataToPopulate.exitTime)
        dataToPopulate.exitTime = formatToLocalISO(dataToPopulate.exitTime);

      dataToPopulate.entryPrice = dataToPopulate.entryPrice ?? "";
      dataToPopulate.exitPrice = dataToPopulate.exitPrice ?? "";
      dataToPopulate.quantity = dataToPopulate.quantity ?? "";

      if (
        Array.isArray(dataToPopulate.mistakes) &&
        dataToPopulate.mistakes.length > 0
      ) {
        dataToPopulate.mistake = dataToPopulate.mistakes[0];
      } else if (!dataToPopulate.mistake) {
        dataToPopulate.mistake = "NO MISTAKE";
      }

      if (!dataToPopulate.emotions && dataToPopulate.emotion) {
        dataToPopulate.emotions = dataToPopulate.emotion;
      }

      setFormData(dataToPopulate);
      if (dataToPopulate.appCharge) setAppCharge(dataToPopulate.appCharge);

      setCurrentStep(8);
    }
  }, [initialData]);

  // 3. CALCULATION LOGIC
  useEffect(() => {
    const entry = parseFloat(formData.entryPrice) || 0;
    const exit = parseFloat(formData.exitPrice) || 0;
    const qty = parseFloat(formData.quantity) || 0;
    const dir = formData.direction;

    if (entry > 0 && exit > 0 && qty > 0) {
      const isFuture = dir.includes("Fut");
      let gross = 0;
      let points = 0;

      if (["Call", "Put", "Fut Buy"].includes(dir)) {
        points = exit - entry;
        gross = points * qty;
      } else {
        points = entry - exit;
        gross = points * qty;
      }

      let buyPriceForTax = ["Call", "Put", "Fut Buy"].includes(dir)
        ? entry
        : exit;
      let sellPriceForTax = ["Call", "Put", "Fut Buy"].includes(dir)
        ? exit
        : entry;

      const turnover = entry * qty + exit * qty;
      let stt = isFuture
        ? sellPriceForTax * qty * 0.000125
        : sellPriceForTax * qty * 0.000625;
      let stampDuty = isFuture
        ? buyPriceForTax * qty * 0.00002
        : buyPriceForTax * qty * 0.00003;
      let exchangeCharge = isFuture ? turnover * 0.000019 : turnover * 0.0005;
      const sebiCharge = turnover * 0.000001;
      const gst = (parseFloat(appCharge) + exchangeCharge + sebiCharge) * 0.18;
      const totalTax =
        parseFloat(appCharge) +
        stt +
        stampDuty +
        exchangeCharge +
        sebiCharge +
        gst;

      setCalculations({
        grossPnL: gross,
        totalBrokerage: totalTax,
        netPnL: gross - totalTax,
        pointsCaptured: points,
        breakdown: { stt, stampDuty, exchangeCharge, sebiCharge, gst },
      });
    } else {
      setCalculations({
        grossPnL: 0,
        totalBrokerage: 0,
        netPnL: 0,
        pointsCaptured: 0,
        breakdown: {},
      });
    }

    if (formData.entryTime && formData.exitTime) {
      const start = new Date(formData.entryTime);
      const end = new Date(formData.exitTime);
      const diffMs = end - start;

      if (diffMs > 0) {
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor(
          (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        let durationStr = "";
        if (diffDays > 0) durationStr += `${diffDays}d `;
        if (diffHrs > 0) durationStr += `${diffHrs}h `;
        durationStr += `${diffMins}m`;

        setTradeDuration(durationStr);
      } else {
        setTradeDuration("Invalid Time");
      }
    } else {
      setTradeDuration("");
    }
  }, [
    formData.entryPrice,
    formData.exitPrice,
    formData.quantity,
    formData.direction,
    appCharge,
    formData.entryTime,
    formData.exitTime,
  ]);

  // HANDLERS
  const handleInput = (e) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelection = (field, value, nextStep) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      if (field === "setup") return { ...prev, [field]: value, entryType: "" };
      return { ...prev, [field]: value };
    });
    if (nextStep > currentStep) setCurrentStep(nextStep);
  };

  const handleFileChange = (e) => {
    if (e.target.files) setImageFile(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (isReadOnly) return;

    setIsSubmitting(true);
    try {
      const entry = parseFloat(formData.entryPrice) || 0;
      const exit = parseFloat(formData.exitPrice) || 0;
      const dir = formData.direction;
      let finalPoints = ["Call", "Put", "Fut Buy"].includes(dir)
        ? exit - entry
        : entry - exit;

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (
          [
            "mode",
            "_id",
            "createdAt",
            "updatedAt",
            "__v",
            "brokerage",
            "netPnL",
            "appCharge",
            "pointsCaptured",
            "imageUrls",
            "durationMinutes",
            "mistakes",
          ].includes(key)
        )
          return;
        data.append(key, formData[key]);
      });

      data.append("mistake", formData.mistake);
      data.append("mistakes[]", formData.mistake);

      data.append("mode", mode);
      data.append("brokerage", calculations.totalBrokerage.toFixed(2));
      data.append("netPnL", calculations.netPnL.toFixed(2));
      data.append("appCharge", appCharge);
      data.append("pointsCaptured", finalPoints.toFixed(2));

      if (formData.entryTime && formData.exitTime) {
        const durationInMinutes =
          (new Date(formData.exitTime) - new Date(formData.entryTime)) /
          (1000 * 60);
        data.append(
          "durationMinutes",
          durationInMinutes > 0 ? durationInMinutes.toFixed(2) : 0,
        );
      } else {
        data.append("durationMinutes", 0);
      }

      if (imageFile && imageFile.length > 0)
        imageFile.forEach((file) => data.append("images", file));
      if (existingImages && existingImages.length > 0)
        existingImages.forEach((url) => data.append("existingImageUrls", url));

      let url = initialData
        ? `${import.meta.env.VITE_ANALYSIS_API}/api/trades/${initialData._id}`
        : `${import.meta.env.VITE_ANALYSIS_API}/api/trades`;
      let method = initialData ? "PUT" : "POST";

      const response = await fetch(url, { method: method, body: data });
      const result = await response.json();

      if (response.ok) {
        alert(initialData ? "✅ Trade Updated!" : "✅ Trade Saved!");

        if (onSuccess) {
          const optimizedData = {
            ...initialData,
            ...formData,
            netPnL: calculations.netPnL.toFixed(2),
            brokerage: calculations.totalBrokerage.toFixed(2),
            pointsCaptured: finalPoints.toFixed(2),
          };
          onSuccess(optimizedData);
        }
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const DIRECTION_OPTIONS = [
    "Call",
    "Put",
    "Fut Buy",
    "Fut Sell",
    "Call Write",
    "Put Write",
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-100">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center mb-8 pb-4 border-b border-slate-100">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex mb-3">
          <button
            type="button"
            onClick={() => !isReadOnly && setMode("LIVE")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 ${mode === "LIVE" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <ClipboardList size={16} /> Live Journal
          </button>
          <button
            type="button"
            onClick={() => !isReadOnly && setMode("BACKTEST")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all duration-200 flex items-center gap-2 ${mode === "BACKTEST" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <BrainCircuit size={16} /> Backtesting
          </button>
        </div>
        <p className="text-sm text-gray-500">
          {isReadOnly
            ? "Viewing Trade Details (Read Only)"
            : "Recording real emotions & execution."}
        </p>
      </div>

      {/* SECTION 1 */}
      <div className={`form-section ${currentStep >= 1 ? "active" : ""}`}>
        <h3 className="section-title font-bold text-lg mb-4 text-slate-700">
          1. Basic Details & Economics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInput}
            disabled={isReadOnly}
            className="input-field border p-2 rounded disabled:bg-gray-100"
          />
          <select
            name="pair"
            value={formData.pair}
            onChange={handleInput}
            disabled={isReadOnly}
            className="input-field border p-2 rounded disabled:bg-gray-100"
          >
            <option>NIFTY</option>
            <option>BANKNIFTY</option>
            <option>FINNIFTY</option>
            <option>MIDCPNIFTY</option>
          </select>
          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleInput}
            disabled={isReadOnly}
            className="input-field border p-2 rounded disabled:bg-gray-100"
          >
            <option>5M</option>
            <option>15M</option>
            <option>1H</option>
            <option>Daily</option>
          </select>
          {!isReadOnly && (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="input-field pt-1 border p-1 rounded text-sm"
            />
          )}
        </div>

        {existingImages.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-1">
              <Eye size={12} /> Trade Screenshots:
            </p>
            <div className="flex gap-3 flex-wrap mb-4">
              {existingImages.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPreview(url)}
                  className={`relative group w-20 h-20 cursor-pointer transition-all ${selectedPreview === url ? "ring-2 ring-blue-500 scale-105" : "opacity-80 hover:opacity-100"}`}
                >
                  <img
                    src={url}
                    alt="trade preview"
                    className="w-full h-full object-cover rounded border border-slate-300 shadow-sm"
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExistingImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition z-10"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {selectedPreview && (
              <div className="relative w-full rounded-lg overflow-hidden border border-slate-300 shadow-lg bg-white mt-4 animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition z-20 backdrop-blur-sm"
                >
                  <X size={20} />
                </button>
                <img
                  src={selectedPreview}
                  alt="Full View"
                  className="w-full h-auto max-h-[600px] object-contain bg-slate-100"
                />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Entry Price
            </label>
            <input
              type="number"
              name="entryPrice"
              placeholder="0.00"
              value={formData.entryPrice}
              onChange={handleInput}
              disabled={isReadOnly}
              className="border p-2 rounded w-full font-bold disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Exit Price
            </label>
            <input
              type="number"
              name="exitPrice"
              placeholder="0.00"
              value={formData.exitPrice}
              onChange={handleInput}
              disabled={isReadOnly}
              className="border p-2 rounded w-full font-bold disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              placeholder="0.00"
              value={formData.quantity}
              onChange={handleInput}
              disabled={isReadOnly}
              className="border p-2 rounded w-full font-bold disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 flex justify-between">
              App Charge{" "}
              {!isReadOnly && (
                <span
                  onClick={() => setAppCharge(40)}
                  className="text-blue-500 cursor-pointer"
                >
                  Reset
                </span>
              )}
            </label>
            <input
              type="number"
              value={appCharge}
              onChange={(e) => setAppCharge(e.target.value)}
              disabled={isReadOnly}
              className="border p-2 rounded w-full font-bold bg-yellow-50 text-yellow-800 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div>
            <label className="text-xs font-bold text-blue-800 block mb-1">
              Entry Date & Time
            </label>
            <input
              type="datetime-local"
              name="entryTime"
              value={formData.entryTime}
              onChange={handleInput}
              disabled={isReadOnly}
              className="border border-blue-200 p-2 rounded w-full text-sm disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-blue-800 block mb-1">
              Exit Date & Time
            </label>
            <input
              type="datetime-local"
              name="exitTime"
              value={formData.exitTime}
              onChange={handleInput}
              disabled={isReadOnly}
              className="border border-blue-200 p-2 rounded w-full text-sm disabled:bg-gray-100"
            />
          </div>
          <div className="flex flex-col justify-end">
            <label className="text-xs font-bold text-blue-800 block mb-1">
              Calculated Duration
            </label>
            <div className="border border-blue-200 bg-white p-2 rounded w-full text-sm font-bold flex items-center gap-2 text-blue-700 h-[42px]">
              <Clock size={16} /> {tradeDuration || "--"}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
          <h4 className="font-bold text-slate-500 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
            <AlertCircle size={14} /> Trade Economics
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center items-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Gross P&L
              </p>
              <p
                className={`text-lg font-bold ${calculations.grossPnL >= 0 ? "text-green-600" : "text-red-500"}`}
              >
                {calculations.grossPnL.toFixed(2)}
              </p>
            </div>
            <div className="border-x border-slate-100 px-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Charges
              </p>
              <p className="text-lg font-bold text-red-500">
                -{calculations.totalBrokerage.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">
                Net P&L (Real)
              </p>
              <p
                className={`text-2xl font-extrabold ${calculations.netPnL >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {calculations.netPnL.toFixed(2)}
              </p>
            </div>
          </div>
          <div
            className={`mt-2 text-center text-xs font-bold py-1 rounded ${calculations.pointsCaptured >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            Points Captured: {calculations.pointsCaptured.toFixed(2)}
          </div>
        </div>

        {/* 🔥 PSYCHOLOGY SECTION (VISIBLE ONLY IN LIVE MODE) */}
        {mode === "LIVE" && (
          <div className="mt-6 p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
            <h4 className="font-bold text-yellow-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <BrainCircuit size={18} /> Trading Psychology (Analytics Data)
            </h4>

            {/* 1. EMOTION SELECTOR */}
            <div className="mb-4">
              <label className="text-xs font-bold text-yellow-700 block mb-2">
                How did you feel while entering?
              </label>
              <div className="flex flex-wrap gap-2">
                {PSYCHOLOGY_TAGS.emotions.map((emo) => (
                  <button
                    key={emo.label}
                    type="button"
                    onClick={() => {
                      if (isReadOnly) return;
                      setFormData((prev) => ({ ...prev, emotions: emo.label }));
                    }}
                    disabled={isReadOnly}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                      formData.emotions === emo.label
                        ? `${emo.color} shadow-sm ring-1 ring-yellow-400 scale-105`
                        : "bg-white border-slate-200 text-slate-500 hover:bg-yellow-50"
                    }`}
                  >
                    <span>{emo.emoji}</span> {emo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. MISTAKE TAGGING (SINGLE SELECT) */}
            <div>
              <label className="text-xs font-bold text-yellow-700 block mb-2">
                Did you make any mistake?
              </label>
              <div className="flex flex-wrap gap-2">
                {PSYCHOLOGY_TAGS.mistakes.map((mistake) => {
                  const isSelected = formData.mistake === mistake;
                  return (
                    <button
                      key={mistake}
                      type="button"
                      onClick={() => {
                        if (isReadOnly) return;
                        setFormData((prev) => ({ ...prev, mistake: mistake }));
                      }}
                      disabled={isReadOnly}
                      className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 ${
                        isSelected
                          ? mistake === "NO MISTAKE"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-red-100 text-red-700 border-red-300"
                          : "bg-white border-slate-200 text-slate-500 hover:border-yellow-300"
                      }`}
                    >
                      {isSelected &&
                        (mistake === "NO MISTAKE" ? (
                          <Zap size={10} />
                        ) : (
                          <AlertTriangle size={10} />
                        ))}
                      {mistake}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!isReadOnly && (
          <button
            onClick={() => setCurrentStep(2)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            Next: Market Trend 🡻
          </button>
        )}
      </div>

      {/* SECTIONS 2-7 */}
      <SectionWrapper
        title="2. Market Trend"
        step={2}
        currentStep={isReadOnly ? 2 : currentStep}
        alwaysOpen={isReadOnly}
      >
        <div className="flex gap-2">
          {TRADE_DATA.trends.map((trend) => (
            <SelectionButton
              key={trend}
              label={trend}
              isSelected={formData.trend === trend}
              onClick={() => handleSelection("trend", trend, 3)}
              disabled={isReadOnly}
            />
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper
        title="3. Direction"
        step={3}
        currentStep={isReadOnly ? 3 : currentStep}
        alwaysOpen={isReadOnly}
      >
        <div className="flex gap-2 flex-wrap">
          {DIRECTION_OPTIONS.map((dir) => (
            <SelectionButton
              key={dir}
              label={dir}
              isSelected={formData.direction === dir}
              onClick={() => handleSelection("direction", dir, 4)}
              disabled={isReadOnly}
            />
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper
        title="4. Trade Type & Setup"
        step={4}
        currentStep={isReadOnly ? 4 : currentStep}
        alwaysOpen={isReadOnly}
      >
        <div className="flex gap-2 flex-wrap mb-3">
          {TRADE_DATA.tradeTypes.map((type) => (
            <SelectionButton
              key={type}
              label={type}
              isSelected={formData.tradeType === type}
              onClick={() => setFormData({ ...formData, tradeType: type })}
              disabled={isReadOnly}
            />
          ))}
        </div>
        {formData.tradeType && (
          <div className="p-3 bg-gray-50 rounded border">
            <p className="text-xs text-gray-500 mb-2">Select Setup:</p>
            <div className="flex gap-2 flex-wrap">
              {TRADE_DATA.setups[formData.tradeType]?.map((setup) => (
                <SelectionButton
                  key={setup}
                  label={setup}
                  isSelected={formData.setup === setup}
                  onClick={() => handleSelection("setup", setup, 5)}
                  disabled={isReadOnly}
                />
              ))}
            </div>
          </div>
        )}
      </SectionWrapper>
      <SectionWrapper
        title="5. Entry Trigger"
        step={5}
        currentStep={isReadOnly ? 5 : currentStep}
        alwaysOpen={isReadOnly}
      >
        <div className="flex gap-2 flex-wrap">
          {formData.setup &&
            TRADE_DATA.entryRules[formData.setup]?.map((entry) => (
              <SelectionButton
                key={entry}
                label={entry}
                isSelected={formData.entryType === entry}
                onClick={() => handleSelection("entryType", entry, 6)}
                disabled={isReadOnly}
              />
            ))}
        </div>
      </SectionWrapper>
      <SectionWrapper
        title="6. Exit Logic"
        step={6}
        currentStep={isReadOnly ? 6 : currentStep}
        alwaysOpen={isReadOnly}
      >
        <div className="flex gap-2 flex-wrap">
          {formData.tradeType &&
            TRADE_DATA.exitRules[formData.tradeType]?.map((reason) => (
              <SelectionButton
                key={reason}
                label={reason}
                isSelected={formData.exitReason === reason}
                onClick={() => handleSelection("exitReason", reason, 7)}
                disabled={isReadOnly}
              />
            ))}
        </div>
      </SectionWrapper>
      <SectionWrapper
        title="7. Final Result"
        step={7}
        currentStep={isReadOnly ? 7 : currentStep}
        alwaysOpen={isReadOnly}
      >
        <div className="flex gap-2 flex-wrap mb-4">
          {TRADE_DATA.results.map((res) => (
            <button
              key={res}
              disabled={isReadOnly}
              onClick={() => {
                const isTarget = res === "TARGET HIT";
                setFormData((prev) => ({ ...prev, result: res }));
                if (!isTarget) setCurrentStep(8);
              }}
              className={`px-6 py-3 rounded font-bold transition-all border ${formData.result === res ? (res === "TARGET HIT" ? "bg-green-600 text-white" : res === "STOPLOSS HIT" ? "bg-red-600 text-white" : "bg-gray-700 text-white") : "bg-white text-gray-700 border-gray-300"} ${isReadOnly ? "opacity-90 cursor-default" : ""}`}
            >
              {res}
            </button>
          ))}
        </div>
        {formData.result === "TARGET HIT" && (
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <p className="text-green-800 font-medium mb-2">How much target?</p>
            <div className="flex gap-2">
              {TRADE_DATA.targets.map((tgt) => (
                <SelectionButton
                  key={tgt}
                  label={tgt}
                  isSelected={formData.targetLevel === tgt}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, targetLevel: tgt }));
                    setCurrentStep(8);
                  }}
                  disabled={isReadOnly}
                />
              ))}
            </div>
          </div>
        )}
      </SectionWrapper>

      {(currentStep === 8 || isReadOnly) && (
        <div className="mt-6">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInput}
            disabled={isReadOnly}
            className="w-full border p-3 rounded-lg bg-slate-50 mb-4 h-20 disabled:bg-gray-100 disabled:text-gray-600"
            placeholder="Final thoughts / Notes..."
          ></textarea>
          {!isReadOnly && (
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`text-white px-10 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition flex items-center gap-2 mx-auto disabled:opacity-70 ${mode === "LIVE" ? "bg-linear-to-r from-green-600 to-emerald-700" : "bg-linear-to-r from-purple-600 to-indigo-700"}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save size={20} />{" "}
                    {initialData ? "Update Trade" : `Save to ${mode}`}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TradeForm;
