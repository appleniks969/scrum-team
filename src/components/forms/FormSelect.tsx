import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
  placeholder?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  className = '',
  error,
  helpText,
  placeholder,
}) => {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setTouched(true);
    
    // Validate if required
    if (required && !e.target.value) {
      setLocalError('This field is required');
    } else {
      setLocalError(null);
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  // Display external error or local validation error
  const displayError = error || (touched ? localError : null);
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium ${
          displayError ? 'text-red-700' : 'text-gray-700'
        } ${required ? 'required' : ''}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="mt-1 relative rounded-md shadow-sm">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`block w-full rounded-md sm:text-sm ${
            displayError
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          aria-invalid={displayError ? 'true' : 'false'}
          aria-describedby={displayError ? `${id}-error` : helpText ? `${id}-description` : undefined}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {displayError && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {displayError}
        </p>
      )}
      
      {helpText && !displayError && (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default React.memo(FormSelect);
