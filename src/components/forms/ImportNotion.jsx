import React, { useState } from "react";
import JSZip from "jszip";
import axios from "axios";
import {
  UploadCloud,
  FileText,
  Loader,
  Database,
  AlertCircle,
} from "lucide-react";

const ImportNotion = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ trades: 0, imagesFound: 0 });
  const [parsedData, setParsedData] = useState([]);
  const [zipContent, setZipContent] = useState(null);

  const addLog = (msg, type = "info") => {
    setLogs((prev) => [...prev, { msg, type }]);
  };

  // --- 1. ROBUST PARSER (Space Remover Fix) ---
  const parseMarkdownData = (text) => {
    const data = {};
    const lines = text.split("\n");
    lines.forEach((line) => {
      const parts = line.split(":");
      if (parts.length >= 2) {
        // 🔥 KEY NORMALIZATION: Remove ALL spaces inside key (e.g., "ENTRY TIME" -> "ENTRYTIME")
        const key = parts[0].trim().toUpperCase().replace(/\s+/g, "");

        let value = parts.slice(1).join(":").trim();

        // Clean Numbers
        if (
          [
            "NETP&L",
            "GROSSP&L",
            "BUYPRICE",
            "SELLPRICE",
            "QUANTITY",
            "TOTALBROKERAGE",
            "P&LINPOINT",
          ].includes(key)
        ) {
          value = parseFloat(value.replace(/[₹,]/g, ""));
        }
        if (key && value !== "") data[key] = value;
      }
    });
    return data;
  };

  // --- 2. FILE SCANNING ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setLogs([]);
    setStats({ trades: 0, imagesFound: 0 });
    setParsedData([]);

    try {
      addLog(`📂 Reading ZIP...`, "info");
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      setZipContent(content);

      const allPaths = Object.keys(content.files);
      const allMdFiles = allPaths.filter(
        (path) =>
          path.endsWith(".md") &&
          !path.startsWith("__MACOSX") &&
          !path.includes("Export Summary"),
      );

      addLog(`🔍 Scanning ${allMdFiles.length} MD files...`, "info");

      const validTrades = [];
      let totalImages = 0;

      for (const mdPath of allMdFiles) {
        const mdFile = content.files[mdPath];
        const mdText = await mdFile.async("string");
        const data = parseMarkdownData(mdText);

        let is2025 = false;
        if (data["YEAR"] == "2025") is2025 = true;
        else if (data["DATE"]) {
          const d = new Date(data["DATE"]);
          if (!isNaN(d) && d.getFullYear() === 2025) is2025 = true;
        }

        if (!is2025) continue;

        // EXTRACT LINKS
        const imageLinks = [];
        const regex = /!\[.*?\]\((.*?)\)/g;
        let match;
        while ((match = regex.exec(mdText)) !== null) {
          imageLinks.push(decodeURIComponent(match[1]));
        }

        // Resolve Paths
        const pathParts = mdPath.split("/");
        pathParts.pop();
        const currentDir = pathParts.join("/");

        const resolvedImagePaths = imageLinks
          .map((link) => {
            let fullPath = currentDir ? `${currentDir}/${link}` : link;
            if (content.files[fullPath]) return fullPath;
            const filenameOnly = link.split("/").pop();
            return (
              allPaths.find(
                (p) => p.endsWith(filenameOnly) && p.includes(currentDir),
              ) || null
            );
          })
          .filter((p) => p !== null);

        totalImages += resolvedImagePaths.length;
        const title = mdText.split("\n")[0].replace("#", "").trim();

        validTrades.push({
          id: mdPath,
          title: title,
          raw_data: data,
          imagePaths: resolvedImagePaths,
        });
      }

      setStats({ trades: validTrades.length, imagesFound: totalImages });
      setParsedData(validTrades);

      if (validTrades.length > 0) {
        addLog(
          `🎉 Ready to import ${validTrades.length} trades. Click Upload button.`,
          "success",
        );
      } else {
        addLog(`⚠️ No 2025 trades found.`, "warning");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      addLog(`Error: ${error.message}`, "error");
      setLoading(false);
    }
  };

  // --- 3. FINAL UPLOAD ---
  const handleFinalUpload = async () => {
    if (!parsedData.length || !zipContent) return;

    setUploading(true);
    setProgress(0);
    addLog("🚀 Starting Cloud Upload...", "info");

    const finalPayload = [];
    let completed = 0;

    // 🔥 CLOUDINARY CONFIG
    const UPLOAD_PRESET = "tech_wala_preset";
    const CLOUD_NAME = "dezvz0ivv";

    // Helpers
    const getSafeDate = (dateStr) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return new Date();
      return d;
    };

    const toTitleCase = (str) => {
      if (!str) return "";
      return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const getStandardPair = (rawName) => {
      if (!rawName) return "UNKNOWN";
      const upperName = rawName.toUpperCase().trim();
      const mappings = {
        MIDCAP: "MIDCPNIFTY",
        NIFTY: "NIFTY",
        BANKNIFTY: "BANKNIFTY",
        FINNIFTY: "FINNIFTY",
        SENSEX: "SENSEX",
        BANKEX: "BANKEX",
      };
      return mappings[upperName] || upperName;
    };

    const safeNum = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // 🔥 TIME COMBINER LOGIC (Smart PM Fix)
    const combineDateAndTime = (dateObj, timeStr) => {
      if (!dateObj || !timeStr) return null;
      try {
        const combined = new Date(dateObj);
        let [hours, minutes] = timeStr.trim().split(":").map(Number);

        if (isNaN(hours) || isNaN(minutes)) return null;

        // Notion "03:24" logic -> Convert to 15:24 if it's afternoon trade
        if (hours >= 1 && hours <= 6) {
          hours += 12;
        }
        combined.setHours(hours, minutes, 0, 0);
        return combined;
      } catch (e) {
        return null;
      }
    };

    for (const trade of parsedData) {
      const imageUrls = [];

      for (const imgPath of trade.imagePaths) {
        try {
          const imgFile = zipContent.files[imgPath];
          const blob = await imgFile.async("blob");
          const formData = new FormData();
          formData.append("file", blob);
          formData.append("upload_preset", UPLOAD_PRESET);
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData,
          );
          imageUrls.push(res.data.secure_url);
        } catch (err) {
          console.error("Image Upload Failed", err);
        }
      }

      // B. Prepare MongoDB Object
      const baseDate = getSafeDate(trade.raw_data["DATE"]);

      // 🔥 KEY FIX: Using normalized keys (No spaces)
      const entryTimeStr = trade.raw_data["ENTRYTIME"];
      const exitTimeStr = trade.raw_data["EXITTIME"];

      let finalEntryDateTime = combineDateAndTime(baseDate, entryTimeStr);
      let finalExitDateTime = combineDateAndTime(baseDate, exitTimeStr);

      // Calculate Duration
      let durationMinutes = 0;
      if (finalEntryDateTime && finalExitDateTime) {
        const diffMs = finalExitDateTime - finalEntryDateTime;
        if (diffMs > 0) {
          durationMinutes = parseFloat((diffMs / (1000 * 60)).toFixed(2));
        }
      }

      // 🚨 SAFETY CHECK: Agar Time Null hai, to Duration bhi 0 kar do
      // Taki MongoDB me galat data na jaye
      if (!finalEntryDateTime || !finalExitDateTime) {
        durationMinutes = 0;
        finalEntryDateTime = null; // Ensure strict null
        finalExitDateTime = null; // Ensure strict null
      }

      // Swap Logic
      const rawDirection = trade.raw_data["DIRECTIONS"] || "";
      const isShort = rawDirection.toUpperCase().includes("WRITE");

      let finalEntryPrice, finalExitPrice;
      if (isShort) {
        finalEntryPrice = safeNum(trade.raw_data["SELLPRICE"]);
        finalExitPrice = safeNum(trade.raw_data["BUYPRICE"]);
      } else {
        finalEntryPrice = safeNum(trade.raw_data["BUYPRICE"]);
        finalExitPrice = safeNum(trade.raw_data["SELLPRICE"]);
      }

      const mongoObject = {
        symbol: trade.title,
        date: baseDate,

        entryTime: finalEntryDateTime,
        exitTime: finalExitDateTime,
        durationMinutes: durationMinutes,

        mode:
          trade.raw_data["TRADETYPE"]?.toUpperCase() === "PAPER"
            ? "BACKTEST"
            : "LIVE",
        pair: getStandardPair(trade.raw_data["INDEXNAME"]),
        timeframe: trade.raw_data["TIMEFRAME"] || "5M",

        quantity: safeNum(trade.raw_data["QUANTITY"]),
        entryPrice: finalEntryPrice,
        exitPrice: finalExitPrice,

        netPnL: safeNum(trade.raw_data["NETP&L"]),
        brokerage: safeNum(trade.raw_data["TOTALBROKERAGE"]),
        pointsCaptured: safeNum(trade.raw_data["P&LINPOINT"]),

        tradeType: toTitleCase(trade.raw_data["TRADETYPE"]),
        setup: trade.raw_data["TRADESETUP"],

        mistake: "",
        notes: trade.raw_data["REMARK"] || "",

        imageUrls: imageUrls,
        imageUrl: imageUrls[0] || "",

        result:
          safeNum(trade.raw_data["NETP&L"]) > 0 ? "TARGET HIT" : "STOPLOSS HIT",
        // direction: isShort ? 'SHORT' : (rawDirection.toUpperCase().includes('CALL') ? 'LONG' : 'SHORT'),
        direction: toTitleCase(trade.raw_data["DIRECTIONS"]) || "",

        trend: "Sideways",
        session: "NO_SESSION",
        rr: 0,
        roi: 0,
        entryType: trade.raw_data["ENTRYTYPE"] || "Direct",
        exitReason: toTitleCase(trade.raw_data["RESULT"]) || "Manual",
      };

      finalPayload.push(mongoObject);

      completed++;
      setProgress(Math.round((completed / parsedData.length) * 100));
    }

    // C. Send to Backend
    try {
      addLog(`📡 Sending ${finalPayload.length} trades to Database...`, "info");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trades/bulk-import`,
        finalPayload,
      );
      addLog("✅ ALL DATA IMPORTED SUCCESSFULLY!", "success");
      alert("Import Complete!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      addLog(
        `❌ Backend Error: ${err.response?.data?.message || err.message}`,
        "error",
      );
    }

    setUploading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Database className="text-blue-600" /> Notion Final Import (v4.0 Fixed)
      </h2>

      {!uploading ? (
        <div className="mb-6 p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 flex flex-col items-center justify-center text-center">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="hidden"
            id="zip-upload"
            disabled={loading}
          />
          <label
            htmlFor="zip-upload"
            className="cursor-pointer flex flex-col items-center w-full"
          >
            {loading ? (
              <Loader className="animate-spin text-blue-600 mb-2" size={32} />
            ) : (
              <FileText className="text-blue-500 mb-2" size={32} />
            )}
            <span className="text-sm font-bold text-slate-700">
              {loading ? "Analyzing ZIP..." : "Select Notion Export ZIP"}
            </span>
          </label>
        </div>
      ) : (
        <div className="mb-6 p-8 bg-slate-50 rounded-lg text-center">
          <Loader
            className="animate-spin text-blue-600 mb-4 mx-auto"
            size={40}
          />
          <h3 className="text-lg font-bold text-slate-700">
            Uploading Images & Data...
          </h3>
          <div className="w-full bg-slate-200 rounded-full h-4 mt-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{progress}% Complete</p>
        </div>
      )}

      {stats.trades > 0 && (
        <div className="flex gap-4 mb-4">
          <div className="flex-1 bg-green-50 p-3 rounded border border-green-100">
            <p className="text-xs font-bold text-slate-500">TRADES FOUND</p>
            <h3 className="text-xl font-bold text-slate-800">{stats.trades}</h3>
          </div>
          <div className="flex-1 bg-blue-50 p-3 rounded border border-blue-100">
            <p className="text-xs font-bold text-slate-500">IMAGES LINKED</p>
            <h3 className="text-xl font-bold text-slate-800">
              {stats.imagesFound}
            </h3>
          </div>
        </div>
      )}

      <div className="bg-slate-900 text-slate-300 p-3 rounded-lg h-32 overflow-y-auto text-xs font-mono mb-4">
        {logs.map((l, i) => (
          <p
            key={i}
            className={`mb-1 ${l.type === "error" ? "text-red-400" : l.type === "success" ? "text-green-400" : "text-slate-300"}`}
          >
            {"> " + l.msg}
          </p>
        ))}
      </div>

      {parsedData.length > 0 && !loading && !uploading && (
        <button
          onClick={handleFinalUpload}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg flex justify-center items-center gap-2"
        >
          <UploadCloud size={20} />
          Start Final Upload
        </button>
      )}
    </div>
  );
};

export default ImportNotion;
