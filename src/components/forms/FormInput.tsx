import React, { useState, useEffect } from 'react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validationRules?: ValidationRule[];
  helpText?: string;
  autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  className = '',
  validationRules = [],
  helpText,
  autoComplete,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  
  useEffect(() => {
    // Validate when value changes and field has been touched
    if (touched) {
      validateInput(value);
    }
  }, [value, touched]);
  
  const validateInput = (value: string): boolean => {
    // Check if required
    if (required && !value.trim()) {
      setError('This field is required');
      return false;
    }
    
    // Check custom validation rules
    for (const rule of validationRules) {
      if (!rule.test(value)) {
        setError(rule.message);
        return false;
      }
    }
    
    // Validation passed
    setError(null);
    return true;
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    validateInput(e.target.value);
    
    if (onBlur) {
      onBlur(e);
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium ${
          error ? 'text-red-700' : 'text-gray-700'
        } ${required ? 'required' : ''}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`block w-full rounded-md sm:text-sm ${
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-description` : undefined}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default React.memo(FormInput);
