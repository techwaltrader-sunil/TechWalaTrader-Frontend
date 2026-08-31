import React from 'react';
import { 
    Pencil, PaintBucket, Type, Settings, 
    MoreHorizontal, Layers, Copy, EyeOff, Trash2, X, Bell 
} from 'lucide-react';
import { TV_COLORS } from '../DrawingPanel/utils';

export const EditPanel = ({
    selectedOverlay,
    activeColorPicker,
    setActiveColorPicker,
    drawingConfig,
    updateOverlayStyle,
    setShowSettingsModal,
    cloneActiveOverlay,
    copyActiveOverlay,
    hideActiveOverlay,
    deleteActiveOverlay,
    closeEditPanel,
    handleAddAlert
}) => {
    if (!selectedOverlay) return null;

    return (
        <div 
            className="edit-panel absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-md shadow-lg border border-gray-200 flex items-center px-2 py-1 gap-1 z-[60]"
            onClick={(e) => e.stopPropagation()} 
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* 🖍️ Border Color Icon */}
            <div className="relative">
                <button 
                    title="Line/Border Color" 
                    className={`flex flex-col items-center justify-center p-1.5 rounded transition-colors ${activeColorPicker === 'border' ? 'bg-gray-100' : 'hover:bg-gray-50'}`} 
                    onClick={() => setActiveColorPicker(activeColorPicker === 'border' ? null : 'border')}
                >
                    <Pencil size={18} className="text-gray-700" />
                    <div className="w-4 h-1 mt-0.5 rounded-full" style={{ backgroundColor: drawingConfig.borderColor }}></div>
                </button>
                {activeColorPicker === 'border' && (
                    <div className="absolute top-full mt-2 left-0 bg-white p-3 rounded-lg shadow-xl border border-gray-200 w-[260px] z-[70]">
                        <div className="grid grid-cols-8 gap-1.5 mb-3">
                            {TV_COLORS.map(color => (
                                <div key={`border-${color}`} onClick={() => updateOverlayStyle('borderColor', color)} className="w-5 h-5 rounded cursor-pointer border border-gray-100 hover:border-blue-500 hover:scale-110 transition-all" style={{ backgroundColor: color }} />
                            ))}
                        </div>
                        <div className="w-full h-px bg-gray-200 mb-3"></div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Opacity</span><span>{Math.round(drawingConfig.borderOpacity * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.05" value={drawingConfig.borderOpacity} onChange={(e) => updateOverlayStyle('borderOpacity', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    </div>
                )}
            </div>

            {/* 🖍️ Fill Color Icon (Only for Rectangle and Circle) */}
            {(selectedOverlay.name === 'rect' || selectedOverlay.name === 'circle') && (
                <div className="relative">
                    <button 
                        title="Background Fill Color" 
                        className={`flex flex-col items-center justify-center p-1.5 rounded transition-colors ${activeColorPicker === 'fill' ? 'bg-gray-100' : 'hover:bg-gray-50'}`} 
                        onClick={() => setActiveColorPicker(activeColorPicker === 'fill' ? null : 'fill')}
                    >
                        <PaintBucket size={18} className="text-gray-700" />
                        <div className="w-4 h-1 mt-0.5 rounded-full relative overflow-hidden" style={{ backgroundColor: drawingConfig.fillColor, opacity: drawingConfig.fillOpacity === 0 ? 1 : drawingConfig.fillOpacity }}>
                            {drawingConfig.fillOpacity === 0 && <div className="absolute inset-0 bg-red-500 flex justify-center items-center"><div className="w-full h-px bg-white rotate-45"></div></div>}
                        </div>
                    </button>
                    {activeColorPicker === 'fill' && (
                        <div className="absolute top-full mt-2 left-0 bg-white p-3 rounded-lg shadow-xl border border-gray-200 w-[260px] z-[70]">
                            <div className="grid grid-cols-8 gap-1.5 mb-3">
                                {TV_COLORS.map(color => (
                                    <div key={`fill-${color}`} onClick={() => updateOverlayStyle('fillColor', color)} className="w-5 h-5 rounded cursor-pointer border border-gray-100 hover:border-blue-500 hover:scale-110 transition-all" style={{ backgroundColor: color }} />
                                ))}
                            </div>
                            <div className="w-full h-px bg-gray-200 mb-3"></div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Opacity</span><span>{Math.round(drawingConfig.fillOpacity * 100)}%</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.05" value={drawingConfig.fillOpacity} onChange={(e) => updateOverlayStyle('fillOpacity', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                    )}
                </div>
            )}

            {/* 🎯 Text Tool (Only for Rectangle) */}
            {selectedOverlay.name === 'rect' && (
                <>
                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <div className="relative">
                        <button 
                            title="Text Settings" 
                            className={`flex flex-col items-center justify-center p-1.5 rounded transition-colors ${activeColorPicker === 'text' ? 'bg-gray-100' : 'hover:bg-gray-50'}`} 
                            onClick={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
                        >
                            <Type size={18} className="text-gray-700" />
                            <div className="w-4 h-1 mt-0.5 rounded-full" style={{ backgroundColor: drawingConfig.textColor }}></div>
                        </button>
                        
                        {activeColorPicker === 'text' && (
                            <div className="absolute top-full mt-2 left-0 bg-white p-3 rounded-lg shadow-xl border border-gray-200 w-[260px] z-[70]">
                                <input 
                                    type="text" 
                                    placeholder="Type text here..." 
                                    value={drawingConfig.text} 
                                    onChange={(e) => updateOverlayStyle('text', e.target.value)} 
                                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mb-3 outline-none focus:border-blue-500 transition-colors" 
                                    autoFocus 
                                />
                                <div className="grid grid-cols-8 gap-1.5 mb-3">
                                    {TV_COLORS.map(color => (
                                        <div key={`text-${color}`} onClick={() => updateOverlayStyle('textColor', color)} className="w-5 h-5 rounded cursor-pointer border border-gray-100 hover:border-blue-500 hover:scale-110 transition-all" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                                <div className="w-full h-px bg-gray-200 mb-3"></div>
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                    <span>Font Size</span>
                                    <select value={drawingConfig.textSize} onChange={(e) => updateOverlayStyle('textSize', parseInt(e.target.value))} className="border border-gray-300 rounded px-1.5 py-1 outline-none text-gray-700 bg-white cursor-pointer">
                                        <option value={12}>12px</option>
                                        <option value={14}>14px</option>
                                        <option value={16}>16px</option>
                                        <option value={20}>20px</option>
                                        <option value={24}>24px</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button onClick={() => setActiveColorPicker(null)} className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                                    <button onClick={() => setActiveColorPicker(null)} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-colors">OK</button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="w-px h-5 bg-gray-300 mx-1"></div>

            {/* 📏 Line Width Selector */}
            <select value={drawingConfig.lineWidth} onChange={(e) => updateOverlayStyle('lineWidth', e.target.value)} className="text-xs border border-transparent hover:border-gray-300 rounded px-2 py-1 outline-none text-gray-700 bg-transparent hover:bg-gray-50 cursor-pointer transition-colors">
                <option value={1}>1px</option>
                <option value={2}>2px</option>
                <option value={3}>3px</option>
                <option value={4}>4px</option>
            </select>

            <div className="w-px h-5 bg-gray-300 mx-1"></div>

            {/* ⚙️ Settings Icon */}
            <button 
                title="Settings" 
                className="flex items-center justify-center p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setShowSettingsModal(true)}
            >
                <Settings size={18} />
            </button>

            {/* 🌟 3. नया Alarm Button (DIRECT PASS) */}
            <button 
                onClick={(e) => {
                    e.stopPropagation(); // क्लिक को पीछे चार्ट पर जाने से रोकें
                    if (handleAddAlert) {
                        // 🎯 यहाँ हम सीधे selectedOverlay भेज रहे हैं!
                        handleAddAlert(selectedOverlay); 
                    } else {
                        // 🐞 अगर Prop पास नहीं हुआ होगा, तो यह एरर दिखाएगा
                        alert("Error: handleAddAlert is not connected!"); 
                    }
                }} 
                onMouseDown={(e) => e.stopPropagation()} 
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors" 
                title="Add Alert"
            >
                <Bell size={16} />
            </button>
            
            <div className="w-px h-5 bg-gray-300 mx-1"></div>

            {/* ⚙️ Three Dots Menu (More Options) */}
            <div className="relative">
                <button 
                    title="More Options" 
                    className={`flex items-center justify-center p-1.5 rounded transition-colors ${activeColorPicker === 'more' ? 'bg-gray-100' : 'hover:bg-gray-50'}`} 
                    onClick={() => setActiveColorPicker(activeColorPicker === 'more' ? null : 'more')}
                >
                    <MoreHorizontal size={18} className="text-gray-700" />
                </button>
                
                {activeColorPicker === 'more' && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white p-1 rounded-lg shadow-xl border border-gray-200 w-36 z-[70]">
                        <button onClick={cloneActiveOverlay} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-2 transition-colors">
                            <Layers size={14} /> Clone
                        </button>
                        <button onClick={copyActiveOverlay} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-2 transition-colors">
                            <Copy size={14} /> Copy
                        </button>
                        <div className="w-full h-px bg-gray-100 my-1"></div>
                        <button onClick={hideActiveOverlay} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded flex items-center gap-2 transition-colors">
                            <EyeOff size={14} /> Hide
                        </button>
                    </div>
                )}
            </div>

            <div className="w-px h-5 bg-gray-300 mx-1"></div>

            {/* 🗑️ Action Buttons (Delete & Close) */}
            <div className="flex items-center gap-1">
                <button onClick={deleteActiveOverlay} className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete">
                    <Trash2 size={16} />
                </button>
                <button onClick={closeEditPanel} className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded transition-colors" title="Close Panel">
                    <X size={16} />
                </button>
            </div>
            
        </div>
    );
};