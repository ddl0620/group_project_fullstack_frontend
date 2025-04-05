import { useState } from 'react';

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
      <label className="block text-sm text-neutral-600 mb-1">
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
            // Modern eye icon for visible password
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.5c-4.477 0-8.268 2.943-9.542 7a9.953 9.953 0 001.207 2.318l1.414-1.414A7.953 7.953 0 014.5 12c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.657-.507 3.193-1.414 4.5l1.414 1.414A9.953 9.953 0 0021.542 12c-1.274-4.057-5.065-7-9.542-7z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
              />
            </svg>
          ) : (
            // Modern eye-off icon for hidden password
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3l18 18M9.88 9.88a3 3 0 014.24 4.24M15.535 15.535A9.953 9.953 0 0112 17c-4.477 0-8.268-2.943-9.542-7a9.953 9.953 0 013.007-4.318M12 5c4.418 0 8 3.582 8 8 0 1.657-.507 3.193-1.414 4.5"
              />
            </svg>
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
