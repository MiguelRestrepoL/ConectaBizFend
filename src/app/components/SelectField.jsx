import React from 'react';

const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Seleccionar...', 
  required = false,
  error = null,
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : ''
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-red-500 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default SelectField;
