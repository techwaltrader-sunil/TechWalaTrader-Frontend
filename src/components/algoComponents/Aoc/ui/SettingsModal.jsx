// import React from 'react';
// import { Pencil, X } from 'lucide-react';

// export const SettingsModal = ({ 
//     selectedOverlay, 
//     fibSettings, 
//     setFibSettings, 
//     setShowSettingsModal, 
//     applySettingsToChart 
// }) => {
//     if (!selectedOverlay) return null;

//     return (
//         <div className="absolute inset-0 z-[100] flex items-center justify-center bg-transparent pointer-events-auto">
//             {/* 🎯 'settings-modal' क्लास ताकि बाहर क्लिक करने पर यह बंद हो सके */}
//             <div 
//                 className="settings-modal bg-white rounded-lg shadow-2xl w-[450px] flex flex-col border border-gray-200"
//                 onClick={(e) => e.stopPropagation()} 
//                 onMouseDown={(e) => e.stopPropagation()}
//             >
//                 {/* 📌 Header */}
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                         <h2 className="text-base font-semibold text-gray-800">
//                             {selectedOverlay.name === 'customFib' ? 'Fib retracement' : 'Settings'}
//                         </h2>
//                         <Pencil size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
//                     </div>
//                     <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-700">
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* 📌 Tabs */}
//                 <div className="flex items-center gap-6 px-4 pt-2 border-b border-gray-200 text-sm">
//                     <button className="pb-2 font-medium text-blue-600 border-b-2 border-blue-600">Style</button>
//                     <button className="pb-2 text-gray-600 hover:text-gray-800">Coordinates</button>
//                     <button className="pb-2 text-gray-600 hover:text-gray-800">Visibility</button>
//                 </div>

//                 {/* 📌 Body (Style Tab Content) */}
//                 <div className="px-4 py-4 max-h-[400px] overflow-y-auto custom-scrollbar text-sm">
                    
//                     <div className="flex items-center gap-4 mb-4">
//                         <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-28">
//                             <input 
//                                 type="checkbox" 
//                                 checked={fibSettings.trendLine.checked} 
//                                 onChange={(e) => setFibSettings({...fibSettings, trendLine: {...fibSettings.trendLine, checked: e.target.checked}})} 
//                                 className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
//                             />
//                             Trend line
//                         </label>
//                         <div className="w-6 h-6 rounded border border-gray-300 cursor-pointer" style={{ backgroundColor: fibSettings.trendLine.color }}></div>
//                         <div className="px-2 py-1 border border-gray-300 rounded cursor-pointer text-gray-500 font-bold tracking-widest leading-none">----</div>
//                     </div>

//                     <div className="flex items-center gap-4 mb-4">
//                         <span className="text-gray-700 w-28">Levels line</span>
//                         <div className="px-2 py-1 border border-gray-300 rounded cursor-pointer w-12 text-center text-gray-700">—</div>
//                         <div className="px-2 py-1 border border-gray-300 rounded cursor-pointer w-10 text-center font-bold">—</div>
//                     </div>

//                     <div className="flex items-center gap-4 mb-6">
//                         <span className="text-gray-700 w-28">Extend</span>
//                         <select className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700 bg-white">
//                             <option>Don't extend</option>
//                             <option>Extend left</option>
//                             <option>Extend right</option>
//                             <option>Extend both</option>
//                         </select>
//                     </div>

//                     {/* Fibonacci Levels Grid */}
//                     <div className="grid grid-cols-2 gap-x-6 gap-y-3">
//                         {fibSettings.levels.map((level, index) => (
//                             <div key={level.id} className="flex items-center gap-2">
//                                 <input 
//                                     type="checkbox" 
//                                     checked={level.checked} 
//                                     onChange={() => {
//                                         const newLevels = [...fibSettings.levels];
//                                         newLevels[index].checked = !newLevels[index].checked;
//                                         setFibSettings({ ...fibSettings, levels: newLevels });
//                                     }}
//                                     className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
//                                 />
//                                 <input 
//                                     type="text" 
//                                     value={level.value} 
//                                     readOnly
//                                     className={`w-16 border rounded px-1.5 py-1 text-gray-700 outline-none ${level.checked ? 'border-gray-300 bg-white' : 'border-transparent bg-transparent text-gray-400'}`} 
//                                 />
//                                 <label className={`relative w-6 h-6 rounded border border-gray-200 cursor-pointer overflow-hidden flex items-center justify-center ${level.checked ? 'opacity-100' : 'opacity-40'}`}>
//                                     <input 
//                                         type="color" 
//                                         value={level.color}
//                                         disabled={!level.checked}
//                                         onChange={(e) => {
//                                             const newLevels = [...fibSettings.levels];
//                                             newLevels[index].color = e.target.value;
//                                             setFibSettings({ ...fibSettings, levels: newLevels });
//                                         }}
//                                         className="absolute -top-4 -left-4 w-14 h-14 opacity-0 cursor-pointer" 
//                                     />
//                                     <div className="w-full h-full pointer-events-none" style={{ backgroundColor: level.color }}></div>
//                                 </label>
//                             </div>
//                         ))}
//                     </div>

//                     {/* 🎯 NEW ADVANCED CONTROLS (Below the Grid) */}
//                     <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-5">
                        
//                         {/* Use one color */}
//                         <div className="flex items-center gap-4">
//                             <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-32">
//                                 <input type="checkbox" checked={fibSettings.useOneColor} onChange={(e) => setFibSettings({...fibSettings, useOneColor: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                 Use one color
//                             </label>
//                             <label className={`relative w-6 h-6 rounded border border-gray-200 cursor-pointer overflow-hidden flex items-center justify-center ${fibSettings.useOneColor ? 'opacity-100' : 'opacity-40'}`}>
//                                 <input type="color" value={fibSettings.oneColor} disabled={!fibSettings.useOneColor} onChange={(e) => setFibSettings({...fibSettings, oneColor: e.target.value})} className="absolute -top-4 -left-4 w-14 h-14 opacity-0 cursor-pointer" />
//                                 <div className="w-full h-full pointer-events-none" style={{ backgroundColor: fibSettings.oneColor }}></div>
//                             </label>
//                         </div>

//                         {/* Background with Opacity Slider */}
//                         <div className="flex items-center gap-4">
//                             <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-32">
//                                 <input type="checkbox" checked={fibSettings.showBackground} onChange={(e) => setFibSettings({...fibSettings, showBackground: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                 Background
//                             </label>
//                             <input 
//                                 type="range" min="0" max="1" step="0.05" 
//                                 disabled={!fibSettings.showBackground} 
//                                 value={fibSettings.backgroundOpacity} 
//                                 onChange={(e) => setFibSettings({...fibSettings, backgroundOpacity: parseFloat(e.target.value)})} 
//                                 className={`w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 ${!fibSettings.showBackground && 'opacity-40'}`} 
//                             />
//                         </div>

//                         {/* Reverse */}
//                         <div className="flex items-center gap-4">
//                             <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-32">
//                                 <input type="checkbox" checked={fibSettings.reverse} onChange={(e) => setFibSettings({...fibSettings, reverse: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                 Reverse
//                             </label>
//                         </div>

//                         {/* Prices & Levels Visibility */}
//                         <div className="flex items-center gap-6">
//                             <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
//                                 <input type="checkbox" checked={fibSettings.showPrices} onChange={(e) => setFibSettings({...fibSettings, showPrices: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                 Prices
//                             </label>
//                             <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
//                                 <input type="checkbox" checked={fibSettings.showLevels} onChange={(e) => setFibSettings({...fibSettings, showLevels: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                 Levels
//                             </label>
//                         </div>

//                         {/* Font Size */}
//                         <div className="flex items-center gap-4">
//                             <span className="text-gray-700 w-32">Font size</span>
//                             <select 
//                                 value={fibSettings.fontSize} 
//                                 onChange={(e) => setFibSettings({...fibSettings, fontSize: parseInt(e.target.value)})} 
//                                 className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700 bg-white cursor-pointer"
//                             >
//                                 <option value={10}>10</option>
//                                 <option value={11}>11</option>
//                                 <option value={12}>12</option>
//                                 <option value={14}>14</option>
//                                 <option value={16}>16</option>
//                             </select>
//                         </div>

//                         {/* 🌟 Labels Alignment (Left/Center/Right & Top/Middle/Bottom) */}
//                         <div className="flex items-center gap-4">
//                             <span className="text-gray-700 w-32">Labels</span>
//                             <div className="flex items-center gap-2">
//                                 <select 
//                                     value={fibSettings.textAlign} 
//                                     onChange={(e) => setFibSettings({...fibSettings, textAlign: e.target.value})} 
//                                     className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700 bg-white cursor-pointer w-24"
//                                 >
//                                     <option value="left">Left</option>
//                                     <option value="center">Center</option>
//                                     <option value="right">Right</option>
//                                 </select>
//                                 <select 
//                                     value={fibSettings.textBaseline} 
//                                     onChange={(e) => setFibSettings({...fibSettings, textBaseline: e.target.value})} 
//                                     className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700 bg-white cursor-pointer w-24"
//                                 >
//                                     <option value="bottom">Top</option>
//                                     <option value="middle">Middle</option>
//                                     <option value="top">Bottom</option>
//                                 </select>
//                             </div>
//                         </div>

//                     </div>
//                 </div>

//                 {/* 📌 Footer */}
//                 <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
//                     <button className="border border-gray-300 px-3 py-1.5 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
//                         Template
//                     </button>
//                     <div className="flex items-center gap-2">
//                         <button onClick={() => setShowSettingsModal(false)} className="px-4 py-1.5 rounded text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
//                             Cancel
//                         </button>
//                         <button onClick={applySettingsToChart} className="px-4 py-1.5 rounded text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">
//                             Ok
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// import React, { useState } from 'react';
// import { Pencil, X } from 'lucide-react';

// export const SettingsModal = ({ 
//     selectedOverlay, 
//     fibSettings, 
//     setFibSettings, 
//     drawingConfig,       
//     updateOverlayStyle,  
//     setShowSettingsModal, 
//     applySettingsToChart 
// }) => {
//     const [activeTab, setActiveTab] = useState('Style');

//     if (!selectedOverlay) return null;

//     // 🎯 यहाँ Circle के लिए भी एक कंडीशन बना दी
//     const isFib = selectedOverlay.name === 'customFib';
//     const isRect = selectedOverlay.name === 'rect';
//     const isCircle = selectedOverlay.name === 'circle';

//     return (
//         <div className="absolute inset-0 z-[100] flex items-center justify-center bg-transparent pointer-events-auto">
//             <div 
//                 className="settings-modal bg-white rounded-lg shadow-2xl w-[450px] flex flex-col border border-gray-200"
//                 onClick={(e) => e.stopPropagation()} 
//                 onMouseDown={(e) => e.stopPropagation()}
//             >
//                 {/* 📌 Header */}
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                         <h2 className="text-base font-semibold text-gray-800">
//                             {isFib ? 'Fib retracement' : isRect ? 'Rectangle' : isCircle ? 'Circle' : 'Settings'}
//                         </h2>
//                         <Pencil size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
//                     </div>
//                     <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-700">
//                         <X size={20} />
//                     </button>
//                 </div>

//                 {/* 📌 Tabs (Rectangle और Circle दोनों के लिए 'Text' टैब दिखेगा) */}
//                 <div className="flex items-center gap-6 px-4 pt-2 border-b border-gray-200 text-sm">
//                     <button onClick={() => setActiveTab('Style')} className={`pb-2 ${activeTab === 'Style' ? 'font-medium text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>Style</button>
                    
//                     {/* 🌟 'isRect || isCircle' कर दिया ताकि दोनों में Text टैब आए */}
//                     {(isRect || isCircle) && (
//                         <button onClick={() => setActiveTab('Text')} className={`pb-2 ${activeTab === 'Text' ? 'font-medium text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>Text</button>
//                     )}
                    
//                     <button className="pb-2 text-gray-600 hover:text-gray-800">Coordinates</button>
//                     <button className="pb-2 text-gray-600 hover:text-gray-800">Visibility</button>
//                 </div>

//                 {/* 📌 Body */}
//                 <div className="px-4 py-4 max-h-[400px] overflow-y-auto custom-scrollbar text-sm">
                    
//                     {/* 🎛️ FIBONACCI STYLE SETTINGS */}
//                     {activeTab === 'Style' && isFib && (
//                         // ... (Fibonacci वाला पुराना कोड वैसे ही रहेगा) ...
//                         <div className="flex flex-col gap-4">
//                             <div className="flex items-center gap-4">
//                                 <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-28">
//                                     <input type="checkbox" checked={fibSettings.trendLine.checked} onChange={(e) => setFibSettings({...fibSettings, trendLine: {...fibSettings.trendLine, checked: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
//                                     Trend line
//                                 </label>
//                                 <div className="w-6 h-6 rounded border border-gray-300 cursor-pointer" style={{ backgroundColor: fibSettings.trendLine.color }}></div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
//                                 {fibSettings.levels.map((level, index) => (
//                                     <div key={level.id} className="flex items-center gap-2">
//                                         <input type="checkbox" checked={level.checked} onChange={() => { const newLevels = [...fibSettings.levels]; newLevels[index].checked = !newLevels[index].checked; setFibSettings({ ...fibSettings, levels: newLevels }); }} className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
//                                         <input type="text" value={level.value} readOnly className={`w-16 border rounded px-1.5 py-1 text-gray-700 outline-none ${level.checked ? 'border-gray-300 bg-white' : 'border-transparent bg-transparent text-gray-400'}`} />
//                                         <label className={`relative w-6 h-6 rounded border border-gray-200 cursor-pointer overflow-hidden flex items-center justify-center ${level.checked ? 'opacity-100' : 'opacity-40'}`}>
//                                             <input type="color" value={level.color} disabled={!level.checked} onChange={(e) => { const newLevels = [...fibSettings.levels]; newLevels[index].color = e.target.value; setFibSettings({ ...fibSettings, levels: newLevels }); }} className="absolute -top-4 -left-4 w-14 h-14 opacity-0 cursor-pointer" />
//                                             <div className="w-full h-full pointer-events-none" style={{ backgroundColor: level.color }}></div>
//                                         </label>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex items-center gap-4 mt-4 border-t pt-4">
//                                 <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-32">
//                                     <input type="checkbox" checked={fibSettings.showBackground} onChange={(e) => setFibSettings({...fibSettings, showBackground: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
//                                     Background
//                                 </label>
//                                 <input type="range" min="0" max="1" step="0.05" disabled={!fibSettings.showBackground} value={fibSettings.backgroundOpacity} onChange={(e) => setFibSettings({...fibSettings, backgroundOpacity: parseFloat(e.target.value)})} className={`w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 ${!fibSettings.showBackground && 'opacity-40'}`} />
//                             </div>
//                         </div>
//                     )}

//                     {/* 🎛️ RECTANGLE & CIRCLE STYLE SETTINGS */}
//                     {activeTab === 'Style' && (isRect || isCircle) && (
//                         <div className="flex flex-col gap-5">
                            
//                             {/* 🌟 'Extend' का ऑप्शन सिर्फ Rectangle में दिखेगा, Circle में नहीं */}
//                             {isRect && (
//                                 <div className="flex items-center gap-4">
//                                     <span className="text-gray-700 w-28">Extend</span>
//                                     <select className="border border-gray-300 rounded px-2 py-1.5 outline-none text-gray-700 bg-white">
//                                         <option>Don't extend</option>
//                                         <option>Extend left</option>
//                                         <option>Extend right</option>
//                                     </select>
//                                 </div>
//                             )}

//                             {/* Border (दोनों के लिए) */}
//                             <div className="flex items-center gap-4">
//                                 <label className="flex items-center gap-2 text-gray-700 w-28 cursor-pointer">
//                                     <input type="checkbox" defaultChecked={true} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
//                                     Border
//                                 </label>
//                                 <div className="relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden">
//                                     <input type="color" value={drawingConfig.borderColor} onChange={(e) => updateOverlayStyle('borderColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
//                                 </div>
//                             </div>

//                             {/* Background (दोनों के लिए) */}
//                             <div className="flex items-center gap-4">
//                                 <label className="flex items-center gap-2 text-gray-700 w-28 cursor-pointer">
//                                     <input type="checkbox" checked={drawingConfig.fillOpacity > 0} onChange={(e) => updateOverlayStyle('fillOpacity', e.target.checked ? 0.2 : 0)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
//                                     Background
//                                 </label>
//                                 <div className={`relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden ${drawingConfig.fillOpacity === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
//                                     <input type="color" value={drawingConfig.fillColor} onChange={(e) => updateOverlayStyle('fillColor', e.target.value)} disabled={drawingConfig.fillOpacity === 0} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* 🎛️ RECTANGLE & CIRCLE TEXT SETTINGS */}
//                     {activeTab === 'Text' && (isRect || isCircle) && (
//                         <div className="flex flex-col gap-5">
//                             <input 
//                                 type="text" 
//                                 placeholder="Type text here..." 
//                                 value={drawingConfig.text} 
//                                 onChange={(e) => updateOverlayStyle('text', e.target.value)} 
//                                 className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" 
//                             />
//                             <div className="flex items-center gap-4">
//                                 <span className="text-gray-700 w-28">Text Color</span>
//                                 <div className="relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden">
//                                     <input type="color" value={drawingConfig.textColor} onChange={(e) => updateOverlayStyle('textColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-4">
//                                 <span className="text-gray-700 w-28">Font Size</span>
//                                 <select value={drawingConfig.textSize} onChange={(e) => updateOverlayStyle('textSize', parseInt(e.target.value))} className="border border-gray-300 rounded px-2 py-1.5 outline-none text-gray-700 bg-white cursor-pointer w-24">
//                                     <option value={12}>12px</option>
//                                     <option value={14}>14px</option>
//                                     <option value={16}>16px</option>
//                                     <option value={20}>20px</option>
//                                 </select>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* 📌 Footer */}
//                 <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
//                     <button className="border border-gray-300 px-3 py-1.5 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
//                         Template
//                     </button>
//                     <div className="flex items-center gap-2">
//                         <button onClick={() => setShowSettingsModal(false)} className="px-4 py-1.5 rounded text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
//                             Cancel
//                         </button>
//                         <button onClick={applySettingsToChart} className="px-4 py-1.5 rounded text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">
//                             Ok
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };



import React, { useState, useEffect, useRef } from 'react';
import { Pencil, X } from 'lucide-react';

export const SettingsModal = ({ 
    selectedOverlay, 
    // 🌟 1. यहाँ Default Values सेट कर दिए ताकि कभी undefined न हो
    fibSettings = { levels: [], trendLine: {} }, 
    setFibSettings, 
    drawingConfig = {},       
    updateOverlayStyle,  
    setShowSettingsModal, 
    applySettingsToChart 
}) => {
    const [activeTab, setActiveTab] = useState('Style');

    // ==========================================
    // 🖱️ DRAGGABLE MODAL LOGIC (FIXED)
    // ==========================================
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const modalStartPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        // 🌟 2. Select Box पर क्लिक करने से भी ड्रैग न हो, ये फिक्स किया है
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
        
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        modalStartPos.current = { ...position };
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - dragStartPos.current.x;
            const deltaY = e.clientY - dragStartPos.current.y;
            setPosition({
                x: modalStartPos.current.x + deltaX,
                y: modalStartPos.current.y + deltaY,
            });
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    // ==========================================

    if (!selectedOverlay) return null;

    // 🌟 3. Optional Chaining (?.) लगा दिया ताकि नाम न मिलने पर क्रैश न हो
    const isFib = selectedOverlay?.name === 'customFib';
    const isRect = selectedOverlay?.name === 'rect';
    const isCircle = selectedOverlay?.name === 'circle';
    const isText = selectedOverlay?.name === 'text';
    const isHorizontalLine = selectedOverlay?.name === 'horizontalLine';

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-transparent pointer-events-auto">
            <div 
                className="settings-modal bg-white rounded-lg shadow-2xl w-[450px] flex flex-col border border-gray-200"
                onClick={(e) => e.stopPropagation()} 
                onMouseDown={(e) => e.stopPropagation()}
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
                }}
            >
                {/* 📌 Draggable Header */}
                <div 
                    className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg select-none"
                    onMouseDown={handleMouseDown}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }} 
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-gray-800">
                            {isFib ? 'Fib retracement' : isRect ? 'Rectangle' : isCircle ? 'Circle' : isText ? 'Text' : isHorizontalLine ? 'Horizontal Line' : 'Settings'}
                        </h2>
                        <Pencil size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                    <button 
                        onClick={() => setShowSettingsModal(false)} 
                        className="text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-200 rounded transition-colors"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 📌 Tabs */}
                <div className="flex items-center gap-6 px-4 pt-2 border-b border-gray-200 text-sm bg-white">
                    <button onClick={() => setActiveTab('Style')} className={`pb-2 ${activeTab === 'Style' ? 'font-medium text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
                        {isText ? 'Text' : 'Style'}
                    </button>
                    {(isRect || isCircle) && (
                        <button onClick={() => setActiveTab('Text')} className={`pb-2 ${activeTab === 'Text' ? 'font-medium text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>Text</button>
                    )}
                    <button className="pb-2 text-gray-600 hover:text-gray-800">Coordinates</button>
                    <button className="pb-2 text-gray-600 hover:text-gray-800">Visibility</button>
                </div>

                {/* 📌 Body */}
                <div className="px-4 py-4 max-h-[400px] overflow-y-auto custom-scrollbar text-sm bg-white">
                    
                    {/* 🎛️ FIBONACCI STYLE SETTINGS */}
                    {activeTab === 'Style' && isFib && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-28">
                                    <input type="checkbox" checked={fibSettings?.trendLine?.checked || false} onChange={(e) => setFibSettings({...fibSettings, trendLine: {...fibSettings.trendLine, checked: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    Trend line
                                </label>
                                <div className="w-6 h-6 rounded border border-gray-300 cursor-pointer" style={{ backgroundColor: fibSettings?.trendLine?.color || '#000' }}></div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
                                {fibSettings?.levels?.map((level, index) => (
                                    <div key={level?.id || index} className="flex items-center gap-2">
                                        <input type="checkbox" checked={level?.checked || false} onChange={() => { const newLevels = [...fibSettings.levels]; newLevels[index].checked = !newLevels[index].checked; setFibSettings({ ...fibSettings, levels: newLevels }); }} className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
                                        <input type="text" value={level?.value || ''} readOnly className={`w-16 border rounded px-1.5 py-1 text-gray-700 outline-none ${level?.checked ? 'border-gray-300 bg-white' : 'border-transparent bg-transparent text-gray-400'}`} />
                                        <label className={`relative w-6 h-6 rounded border border-gray-200 cursor-pointer overflow-hidden flex items-center justify-center ${level?.checked ? 'opacity-100' : 'opacity-40'}`}>
                                            <input type="color" value={level?.color || '#000'} disabled={!level?.checked} onChange={(e) => { const newLevels = [...fibSettings.levels]; newLevels[index].color = e.target.value; setFibSettings({ ...fibSettings, levels: newLevels }); }} className="absolute -top-4 -left-4 w-14 h-14 opacity-0 cursor-pointer" />
                                            <div className="w-full h-full pointer-events-none" style={{ backgroundColor: level?.color || '#000' }}></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 mt-4 border-t pt-4">
                                <label className="flex items-center gap-2 text-gray-700 cursor-pointer w-32">
                                    <input type="checkbox" checked={fibSettings?.showBackground || false} onChange={(e) => setFibSettings({...fibSettings, showBackground: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                    Background
                                </label>
                                <input type="range" min="0" max="1" step="0.05" disabled={!fibSettings?.showBackground} value={fibSettings?.backgroundOpacity || 0.2} onChange={(e) => setFibSettings({...fibSettings, backgroundOpacity: parseFloat(e.target.value)})} className={`w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 ${!fibSettings?.showBackground && 'opacity-40'}`} />
                            </div>
                        </div>
                    )}

                    {/* 🎛️ RECTANGLE & CIRCLE STYLE SETTINGS */}
                    {activeTab === 'Style' && (isRect || isCircle) && (
                        <div className="flex flex-col gap-5">
                            {isRect && (
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-700 w-28">Extend</span>
                                    <select className="border border-gray-300 rounded px-2 py-1.5 outline-none text-gray-700 bg-white">
                                        <option>Don't extend</option>
                                        <option>Extend left</option>
                                        <option>Extend right</option>
                                    </select>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-gray-700 w-28 cursor-pointer">
                                    <input type="checkbox" defaultChecked={true} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                    Border
                                </label>
                                <div className="relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden">
                                    <input type="color" value={drawingConfig?.borderColor || '#2962FF'} onChange={(e) => updateOverlayStyle('borderColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-gray-700 w-28 cursor-pointer">
                                    <input type="checkbox" checked={(drawingConfig?.fillOpacity || 0) > 0} onChange={(e) => updateOverlayStyle('fillOpacity', e.target.checked ? 0.2 : 0)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                    Background
                                </label>
                                <div className={`relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden ${drawingConfig?.fillOpacity === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <input type="color" value={drawingConfig?.fillColor || '#2962FF'} onChange={(e) => updateOverlayStyle('fillColor', e.target.value)} disabled={drawingConfig?.fillOpacity === 0} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🎛️ RECTANGLE & CIRCLE TEXT SETTINGS */}
                    {activeTab === 'Text' && (isRect || isCircle) && (
                        <div className="flex flex-col gap-5">
                            <input 
                                type="text" 
                                placeholder="Type text here..." 
                                value={drawingConfig?.text || ''} 
                                onChange={(e) => updateOverlayStyle('text', e.target.value)} 
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500" 
                            />
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 w-28">Text Color</span>
                                <div className="relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden">
                                    <input type="color" value={drawingConfig?.textColor || '#000000'} onChange={(e) => updateOverlayStyle('textColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 w-28">Font Size</span>
                                <select value={drawingConfig?.textSize || 14} onChange={(e) => updateOverlayStyle('textSize', parseInt(e.target.value))} className="border border-gray-300 rounded px-2 py-1.5 outline-none text-gray-700 bg-white cursor-pointer w-24">
                                    <option value={12}>12px</option>
                                    <option value={14}>14px</option>
                                    <option value={16}>16px</option>
                                    <option value={20}>20px</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* ========================================== */}
                    {/* 🎛️ NEW: TEXT TOOL SETTINGS */}
                    {/* ========================================== */}
                    {activeTab === 'Style' && isText && (
                        <div className="flex flex-col gap-5">
                            
                            {/* Color & Size */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden">
                                    <input type="color" value={drawingConfig?.textColor || '#2962FF'} onChange={(e) => updateOverlayStyle('textColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
                                </div>
                                <select value={drawingConfig?.textSize || 14} onChange={(e) => updateOverlayStyle('textSize', parseInt(e.target.value))} className="border border-gray-300 rounded px-2 py-1.5 outline-none text-gray-700 bg-white cursor-pointer w-24">
                                    <option value={12}>12px</option>
                                    <option value={14}>14px</option>
                                    <option value={16}>16px</option>
                                    <option value={20}>20px</option>
                                    <option value={24}>24px</option>
                                </select>
                            </div>
                            
                            {/* Text Area */}
                            <textarea 
                                autoFocus  // 🌟 यह कर्सर को तुरंत ब्लिंक करवाएगा!
                                value={drawingConfig?.text !== undefined ? drawingConfig.text : 'Text'} 
                                onChange={(e) => updateOverlayStyle('text', e.target.value)} 
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 min-h-[100px] resize-none" 
                                placeholder="Type your text here..."
                            />

                            {/* 🌟 Background Checkbox & Color (FIXED) */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-gray-700 w-32 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        // 🎯 फिक्स: अगर false नहीं है, तो हमेशा ON रखो (ताकि डिफ़ॉल्ट ON रहे)
                                        checked={drawingConfig?.showBackground !== false} 
                                        onChange={(e) => updateOverlayStyle('showBackground', e.target.checked)} 
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600" 
                                    />
                                    Background
                                </label>
                                <div className={`relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden ${drawingConfig?.showBackground === false ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <input type="color" value={drawingConfig?.fillColor || '#2962FF'} onChange={(e) => updateOverlayStyle('fillColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
                                </div>
                            </div>

                            {/* 🌟 Border Checkbox & Color (FIXED) */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-gray-700 w-32 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        // 🎯 फिक्स: अगर false नहीं है, तो हमेशा ON रखो
                                        checked={drawingConfig?.showBorder !== false} 
                                        onChange={(e) => updateOverlayStyle('showBorder', e.target.checked)} 
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600" 
                                    />
                                    Border
                                </label>
                                <div className={`relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden ${drawingConfig?.showBorder === false ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <input type="color" value={drawingConfig?.borderColor || '#2962FF'} onChange={(e) => updateOverlayStyle('borderColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
                                </div>
                            </div>

                        </div>
                    )}

                    {/* ========================================== */}
                    {/* 🎛️ HORIZONTAL LINE SETTINGS */}
                    {/* ========================================== */}
                    {activeTab === 'Style' && isHorizontalLine && (
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 w-28">Line Color</span>
                                <div className="relative w-8 h-8 rounded border border-gray-300 cursor-pointer overflow-hidden">
                                    <input type="color" value={drawingConfig?.borderColor || '#2962FF'} onChange={(e) => updateOverlayStyle('borderColor', e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer" />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 w-28">Line Width</span>
                                <select value={drawingConfig?.lineWidth || 2} onChange={(e) => updateOverlayStyle('lineWidth', parseInt(e.target.value))} className="border border-gray-300 rounded px-2 py-1.5 outline-none text-gray-700 bg-white cursor-pointer w-24">
                                    <option value={1}>1px</option>
                                    <option value={2}>2px</option>
                                    <option value={3}>3px</option>
                                    <option value={4}>4px</option>
                                </select>
                            </div>
                        </div>
                    )}

                </div>

                {/* 📌 Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button className="border border-gray-300 px-3 py-1.5 rounded text-sm text-gray-700 bg-white hover:bg-gray-50">
                        Template
                    </button>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowSettingsModal(false)} className="px-4 py-1.5 rounded text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={applySettingsToChart} className="px-4 py-1.5 rounded text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};