import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Import new icons

function TextInputField({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false 
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  
  const isPasswordField = type === "password";
  
  return (
    <div className="mb-1 relative">
      <label className="block text-sm text-neutral-600 mb-1 font-bold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={isPasswordField && isPasswordVisible ? "text" : type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border ${error ? 'border-red-500' : 'border-neutral-300'} px-4 py-2 text-sm focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition`}
        placeholder={placeholder}
        required={required}
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        >
          {isPasswordVisible ? (
            <EyeSlashIcon className="h-5 w-5 mt-5" /> // New "Eye Slash" icon
          ) : (
            <EyeIcon className="h-5 w-5 mt-5" /> // New "Eye" icon
          )}
        </button>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default TextInputField;
