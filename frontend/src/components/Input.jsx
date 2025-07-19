import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Input = ({ 
  type = "text", 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  disabled = false,
  required = false,
  className = "",
  icon: Icon,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === "password" && showPassword ? "text" : type;
  
  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text font-medium">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-base-content/40" />
          </div>
        )}
        
        <input
          type={inputType}
          className={`input w-full border border-base-300 focus:border-primary ${Icon ? 'pl-10' : ''} ${
            type === "password" ? 'pr-10' : ''
          } ${error ? 'border-error' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-base-content/40 hover:text-base-content/60" />
            ) : (
              <EyeIcon className="h-5 w-5 text-base-content/40 hover:text-base-content/60" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default Input;
