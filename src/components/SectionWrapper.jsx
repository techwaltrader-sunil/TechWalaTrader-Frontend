const SectionWrapper = ({ title, step, currentStep, children }) => {
  const isActive = currentStep >= step;
  const isNext = currentStep === step; // Kya user abhi is step par hai?

  return (
    <div
      className={`p-4 rounded shadow mb-4 transition-all duration-300 
            ${
              isActive
                ? "bg-white border-l-4 border-green-500 opacity-100"
                : "bg-gray-200 opacity-50 pointer-events-none"
            }
        `}
    >
      <h3
        className={`font-bold mb-3 ${isNext ? "text-black" : "text-gray-500"}`}
      >
        {title}
      </h3>
      {children}
    </div>
  );
};

export default SectionWrapper;
