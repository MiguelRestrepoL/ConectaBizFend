import React from 'react';

const PhoneInput = ({ 
  label, 
  value, 
  onChange, 
  countryCode, 
  onCountryCodeChange, 
  required = false,
  error = null,
  className = '',
  ...props 
}) => {
  const countryOptions = [
    { value: '+57', label: '🇨🇴 +57', flag: '🇨🇴' },
    { value: '+1', label: '🇺🇸 +1', flag: '🇺🇸' },
    { value: '+52', label: '🇲🇽 +52', flag: '🇲🇽' },
    { value: '+34', label: '🇪🇸 +34', flag: '🇪🇸' },
    { value: '+54', label: '🇦🇷 +54', flag: '🇦🇷' },
    { value: '+56', label: '🇨🇱 +56', flag: '🇨🇱' },
    { value: '+51', label: '🇵🇪 +51', flag: '🇵🇪' },
    { value: '+591', label: '🇧🇴 +591', flag: '🇧🇴' },
    { value: '+598', label: '🇺🇾 +598', flag: '🇺🇾' },
    { value: '+595', label: '🇵🇾 +595', flag: '🇵🇾' }
  ];

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex">
        <select
          value={countryCode}
          onChange={onCountryCodeChange}
          className="px-3 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-r-0"
        >
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          placeholder="Text field data"
          value={value}
          onChange={onChange}
          className={`flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : ''
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-red-500 text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default PhoneInput;
