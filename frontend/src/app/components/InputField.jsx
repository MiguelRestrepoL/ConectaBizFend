import React from 'react';

const InputField = ({ 
  type = 'text', 
  placeholder = 'Value', 
  icon, 
  label, 
  name,
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-white text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-white text-lg">{icon}</span>
          </div>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            icon ? 'pl-10' : ''
          }`}
        />
      </div>
    </div>
  );
};

export default InputField;
