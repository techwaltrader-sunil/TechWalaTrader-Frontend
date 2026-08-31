import React from 'react';
import { Trash2 } from 'lucide-react';

export const LeftToolbar = ({ 
    drawingTools, 
    visuallyActiveTool, 
    handleToolClick 
}) => {
    return (
        <div className="left-toolbar w-12 bg-white border-r border-gray-200 flex flex-col items-center py-2 gap-2 shrink-0 z-10">
            
            {/* 🛠️ Map through all drawing tools passed from parent */}
            {drawingTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = visuallyActiveTool === tool.id;
                
                return (
                    <button 
                        key={tool.id} 
                        onClick={() => handleToolClick(tool.id)} 
                        title={tool.title} 
                        className={`p-2 rounded-md transition-colors ${
                            isActive 
                                ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Icon size={18} />
                    </button>
                );
            })}
            
            {/* ➖ Divider */}
            <div className="w-8 h-px bg-gray-200 my-1"></div>
            
            {/* 🗑️ Clear All Button */}
            <button 
                onClick={() => handleToolClick('clear')} 
                title="Clear All Drawings" 
                className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
            >
                <Trash2 size={18} />
            </button>
            
        </div>
    );
};