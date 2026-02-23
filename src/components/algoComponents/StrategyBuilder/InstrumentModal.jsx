
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Data Import
import { OPTION_INDICES, EQUITY_DATA, FUTURE_DATA } from '../../../data/instrumentData';

const InstrumentModal = ({ isOpen, onClose, onSave, strategyType }) => {
  
  // 1. ESC Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // States
  const [searchText, setSearchText] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("Option");
  const [activeTab, setActiveTab] = useState("ALL");
  
  const [singleSelection, setSingleSelection] = useState(null); 
  const [multiSelection, setMultiSelection] = useState([]); 

  // Reset logic
  useEffect(() => {
    if(isOpen) {
        setSelectedSegment(strategyType === 'Time Based' ? "Option" : "Option");
        setActiveTab("ALL");
        setSingleSelection(null);
        setMultiSelection([]);
        setSearchText("");
    }
  }, [isOpen, strategyType]);

  // --- HANDLERS ---
  const handleSegmentChange = (seg) => {
    if (strategyType === 'Time Based' && seg !== 'Option') return;
    
    setSelectedSegment(seg);
    
    // Reset Tab based on segment
    if (seg === 'Equity') setActiveTab("NIFTY50"); 
    else if (seg === 'Future') setActiveTab("NEARMONTHS"); 
    else setActiveTab("ALL");

    setSingleSelection(null);
    setMultiSelection([]); 
  };

  const toggleMultiSelection = (item) => {
    if (multiSelection.includes(item)) {
        setMultiSelection(multiSelection.filter(i => i !== item));
    } else {
        if (multiSelection.length < 50) {
            setMultiSelection([...multiSelection, item]);
        } else {
            alert("Maximum 50 instruments allowed!");
        }
    }
  };

  const handleSave = () => {
    let finalData = [];

    if (selectedSegment === 'Equity' || selectedSegment === 'Future') {
        finalData = multiSelection.map(name => ({ 
            name, 
            lot: 1, 
            segment: selectedSegment 
        }));
    } else {
        if (singleSelection) {
            const lotSize = OPTION_INDICES.find(i => i.name === singleSelection)?.lot || 1;
            finalData = [{ name: singleSelection, lot: lotSize, segment: 'Option' }];
        }
    }

    if (finalData.length > 0) {
        onSave(finalData); 
        onClose();
    }
  };

  // --- RENDER VIEWS ---

  // 1. OPTION VIEW (Single Select)
  const renderOptionView = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
        {OPTION_INDICES.map((idx) => (
            <button
                key={idx.name}
                onClick={() => setSingleSelection(idx.name)}
                className={`py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border 
                ${singleSelection === idx.name 
                    ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 text-blue-700 dark:text-white shadow-md dark:shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'
                }`}
            >
                {idx.name}
            </button>
        ))}
    </div>
  );

  // 2. EQUITY VIEW (Multi Select)
  const renderEquityView = () => {
    const currentList = EQUITY_DATA[activeTab] || []; 
    const filteredList = currentList.filter(stock => stock.toLowerCase().includes(searchText.toLowerCase()));

    return (
    <>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
            {['ALL', 'NIFTY50', 'NIFTY100', 'NIFTY200'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap 
                  ${activeTab === tab 
                    ? 'bg-gray-800 dark:bg-white text-white dark:text-slate-900 border-gray-800 dark:border-white' 
                    : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-600'}`}
                >
                  {tab}
                </button>
            ))}
        </div>
        <div className="grid grid-cols-2 p-3 gap-3 h-64 overflow-y-auto custom-scrollbar content-start bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
            {filteredList.map(stock => {
                const isSelected = multiSelection.includes(stock);
                return (
                    <button
                        key={stock}
                        onClick={() => toggleMultiSelection(stock)}
                        className={`py-2 px-3 rounded-md text-[11px] font-bold transition-all border text-center flex justify-between items-center
                        ${isSelected
                            ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 text-blue-700 dark:text-white' 
                            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'
                        }`}
                    >
                        <span>{stock}</span>
                        {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </button>
                );
            })}
            {filteredList.length === 0 && <p className="col-span-2 text-center text-gray-400 dark:text-gray-500 text-xs mt-4">No stocks found</p>}
        </div>
    </>
  )};

  // 3. FUTURE VIEW
  const renderFutureView = () => {
    const currentList = FUTURE_DATA[activeTab] || [];
    const filteredList = currentList.filter(stock => stock.toLowerCase().includes(searchText.toLowerCase()));

    return (
    <>
    <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
        {['ALL', 'NEARMONTHS', 'NEXTMONTHS', 'FARMONTHS'].map(tab => (
            <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap
                ${activeTab === tab 
                  ? 'bg-gray-800 dark:bg-white text-white dark:text-slate-900 border-gray-800 dark:border-white' 
                  : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-600'}`}
            >
                {tab}
            </button>
        ))}
    </div>

    <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 p-2 rounded mb-3">
        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-medium text-center">
            * Qty has to be filled after seeing it from your broker account for NFO
        </p>
    </div>

    <div className="grid grid-cols-2 p-2 gap-3 h-56 overflow-y-auto custom-scrollbar content-start bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
        {filteredList.map(stock => {
            const isSelected = multiSelection.includes(stock);
            return (
                <button
                    key={stock}
                    onClick={() => toggleMultiSelection(stock)}
                    className={`py-4 px-3 rounded-md text-[10px] font-bold transition-all border text-center flex justify-between items-center truncate
                    ${isSelected
                        ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 text-blue-700 dark:text-white' 
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-500'
                    }`}
                >
                    <span className="truncate w-full text-left">{stock}</span>
                    {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-1"></div>}
                </button>
            )
        })}
        {filteredList.length === 0 && <p className="col-span-2 text-center text-gray-400 dark:text-gray-500 text-xs mt-4">No contracts found</p>}
    </div>
    </>
  )};

  if (!isOpen) return null;

  const isSaveEnabled = (selectedSegment === 'Equity' || selectedSegment === 'Future') 
                        ? multiSelection.length > 0 
                        : singleSelection !== null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Content: Light (White) | Dark (Slate-950) */}
      <div className="bg-white dark:bg-slate-950 border border-gray-250 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative transition-colors duration-300">
        
        <div className="mb-4 relative">
            {/* Search Input: Light (Gray-50) | Dark (Slate-900) */}
            <input 
                type="text" 
                placeholder="Search symbols..." 
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg pl-4 py-3 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors" 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
            />
        </div>

        {/* Segment Tabs */}
        <div className="flex gap-5 mb-5 pl-1">
            {['Option', 'Equity', 'Future'].map((seg) => {
                const isDisabled = strategyType === 'Time Based' && seg !== 'Option';
                return (
                    <label key={seg} className={`flex items-center gap-2 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center 
                            ${selectedSegment === seg 
                                ? 'border-blue-600 dark:border-blue-500' 
                                : 'border-gray-400 dark:border-slate-500'}`}>
                            {selectedSegment === seg && <div className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"></div>}
                        </div>
                        <input type="radio" name="segment" className="hidden" checked={selectedSegment === seg} onChange={() => handleSegmentChange(seg)} disabled={isDisabled}/>
                        <span className={`text-sm font-bold ${selectedSegment === seg ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{seg}</span>
                    </label>
                );
            })}
        </div>

        <div className="min-h-[250px]">
            {selectedSegment === 'Option' && renderOptionView()}
            {selectedSegment === 'Equity' && renderEquityView()}
            {selectedSegment === 'Future' && renderFutureView()}
        </div>

        {/* Save Button */}
        <button 
            onClick={handleSave} 
            disabled={!isSaveEnabled} 
            className={`w-full font-bold py-3 rounded-lg transition-colors shadow-lg 
            ${isSaveEnabled 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20' 
                : 'bg-gray-150  dark:bg-slate-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
        >
            Save {(selectedSegment === 'Equity' || selectedSegment === 'Future') && multiSelection.length > 0 && `(${multiSelection.length})`}
        </button>

      </div>
    </div>
  );
};

export default InstrumentModal;