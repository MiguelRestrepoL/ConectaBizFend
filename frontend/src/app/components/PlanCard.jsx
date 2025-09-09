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
    <div className="bg-gray-100 text-gray-900 rounded-lg p-6 relative hover:shadow-lg transition-shadow">
      {/* Popular Tag */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            Más popular
          </span>
        </div>
      )}

      {/* Plan Title */}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      
      {/* Plan Description */}
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {description}
      </p>

      {/* Price */}
      <div className="text-3xl font-bold mb-6">
        {price}
      </div>

      {/* Select Button */}
      <button
        onClick={onSelect}
        className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-6"
      >
        {buttonText}
      </button>

      {/* Features Section */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-gray-800">Funciones</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">{feature.icon}</span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Shipping Section */}
      {shipping && (
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Envíos</h4>
          <p className="text-sm text-gray-600">{shipping}</p>
        </div>
      )}
    </div>
  );
};

export default PlanCard;
