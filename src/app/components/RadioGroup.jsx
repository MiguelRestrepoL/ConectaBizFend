import React from 'react';

const RadioGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  required = false,
  error = null,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="mr-3 text-blue-600 focus:ring-blue-500"
              {...props}
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <span className="text-red-500 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default RadioGroup;
