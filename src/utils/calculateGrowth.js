// utils/calculateGrowth.js

export const calculateGrowth = (current, previous) => {
  // 1. अगर पिछला डेटा 0 है, तो हम तुलना नहीं कर सकते (Infinity से बचने के लिए)
  if (previous === 0) {
    return { percent: 0, isPositive: true, text: "No Prev Data" };
  }

  // 2. ग्रोथ का फॉर्मूला
  const difference = current - previous;
  const growthPercent = (difference / previous) * 100;

  // 3. डेटा return करना
  return {
    percent: Math.abs(growthPercent).toFixed(2), // सिर्फ नंबर (e.g., 20.50)
    isPositive: growthPercent >= 0, // क्या यह पॉजिटिव है?
    rawVal: growthPercent // असली वैल्यू (+ या -)
  };
};