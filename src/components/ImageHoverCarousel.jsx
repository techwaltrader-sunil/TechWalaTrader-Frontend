import React, { useState, useEffect } from 'react';

// 1. हमने यहाँ 'onClick' prop को receive किया है
const ImageHoverCarousel = ({ images, altText = "Product Image", onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;

    // अगर माउस hover कर रहा है और 1 से ज्यादा इमेज हैं, तो लूप चलाएं
    if (isHovered && images && images.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1200); // 1.2 सेकंड की स्पीड
    } else {
      // माउस हटाने पर वापस पहली इमेज पर सेट करें
      setCurrentIndex(0);
    }

    return () => clearInterval(interval);
  }, [isHovered, images]);

  // अगर इमेज नहीं है तो Placeholder दिखाएं
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
    );
  }

  // 2. जब यूजर इमेज पर क्लिक करेगा, तो 'handleImageClick' फंक्शन चलेगा
  const handleImageClick = (e) => {
    // अगर onClick prop मिला है, तो उसे कॉल करें
    if (onClick) {
        onClick();
    }
  };

  return (
    <div 
      className="relative w-full h-40 overflow-hidden rounded-t-md cursor-pointer group bg-gray-50"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleImageClick} // 3. यहाँ क्लिक इवेंट जोड़ा गया
    >
      {/* Image Display */}
      <img
        src={images[currentIndex]}
        alt={`${altText} - ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-300 ease-in-out"
      />

      {/* Dots Indicator (सिर्फ Hover पर दिखेंगे) */}
      {isHovered && images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full shadow-sm transition-colors duration-200 ${
                index === currentIndex ? "bg-blue-600 scale-110" : "bg-gray-300/80"
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Badge (जब Hover नहीं हो रहा हो) */}
      {!isHovered && images.length > 1 && (
         <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-[2px]">
             +{images.length - 1}
         </div>
      )}
    </div>
  );
};

export default ImageHoverCarousel;