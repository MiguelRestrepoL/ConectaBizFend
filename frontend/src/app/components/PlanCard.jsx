import React from 'react';

const PlanCard = ({ 
  title, 
  description, 
  price, 
  features = [], 
  shipping = '', 
  isPopular = false, 
  buttonText, 
  onSelect 
}) => {
  return (
    <div className="
      bg-white text-gray-900 rounded-lg 
      p-4 sm:p-6 
      relative 
      hover:shadow-lg transition-shadow
      border border-gray-200
      flex flex-col
      h-full
    ">
      {/* Popular Tag */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="
            bg-purple-600 text-white 
            px-3 sm:px-4 py-1 
            rounded-full 
            text-xs sm:text-sm 
            font-medium
            whitespace-nowrap
          ">
            Más popular
          </span>
        </div>
      )}

      {/* Plan Title */}
      <h3 className="text-xl sm:text-2xl font-bold mb-2 mt-2">
        {title}
      </h3>
      
      {/* Plan Description */}
      <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed flex-grow">
        {description}
      </p>

      {/* Price */}
      <div className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
        {price}
        <span className="text-sm sm:text-base font-normal text-gray-500">/mes</span>
      </div>

      {/* Select Button */}
      <button
        onClick={onSelect}
        className="
          w-full 
          bg-gray-900 text-white 
          py-2.5 sm:py-3 px-4 
          rounded-lg 
          font-medium 
          hover:bg-gray-800 
          transition-colors 
          mb-4 sm:mb-6
          text-sm sm:text-base
        "
      >
        {buttonText}
      </button>

      {/* Features Section */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-semibold mb-3 text-gray-800 text-sm sm:text-base">
          Funciones
        </h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className="flex items-start space-x-2 text-xs sm:text-sm"
            >
              <span className="text-base sm:text-lg flex-shrink-0">
                {feature.icon}
              </span>
              <span className="text-gray-700 leading-relaxed">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping Section */}
      {shipping && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">
            Envíos
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {shipping}
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanCard;