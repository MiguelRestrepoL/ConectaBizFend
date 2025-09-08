import React from 'react';

const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  name,
  className = '' 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <label className="ml-2 text-sm text-white">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
