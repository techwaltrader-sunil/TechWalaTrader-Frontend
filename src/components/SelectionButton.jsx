const SelectionButton = ({ label, onClick, isSelected }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 rounded text-sm font-medium transition-colors border
            ${isSelected 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'}
        `}
    >
        {label}
    </button>
);

export default SelectionButton;