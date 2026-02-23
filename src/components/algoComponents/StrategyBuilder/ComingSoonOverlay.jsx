import React from 'react';
const ComingSoonOverlay = () => (
  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center border border-slate-700 rounded-xl">
    <div className="bg-white text-slate-900 px-6 py-3 rounded-lg shadow-xl text-center">
       <h4 className="font-bold text-lg">Coming Soon...</h4>
       <p className="text-xs text-gray-500 font-medium">Feature available shortly</p>
    </div>
  </div>
);
export default ComingSoonOverlay;