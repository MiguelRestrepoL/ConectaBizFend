import React, { useState } from 'react';

const TagInput = ({ 
  label, 
  value = [], 
  onChange, 
  placeholder = 'Text field data',
  className = '',
  ...props 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Input field */}
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        onBlur={addTag}
        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
      
      {/* Tags display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
