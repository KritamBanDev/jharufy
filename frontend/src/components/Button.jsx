import { LoaderIcon } from "lucide-react";

const Button = ({ 
  children, 
  type = "button", 
  variant = "primary", 
  size = "md", 
  loading = false, 
  isLoading = false, // Add isLoading alias for compatibility
  disabled = false, 
  onClick, 
  className = "",
  icon: Icon,
  ...props 
}) => {
  const baseClasses = "btn";
  
  // Use either loading or isLoading prop
  const isButtonLoading = loading || isLoading;
  
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary", 
    accent: "btn-accent",
    ghost: "btn-ghost",
    outline: "btn-outline",
    error: "btn-error",
    success: "btn-success",
    warning: "btn-warning"
  };
  
  const sizeClasses = {
    xs: "btn-xs",
    sm: "btn-sm", 
    md: "",
    lg: "btn-lg"
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || "",
    className
  ].filter(Boolean).join(" ");
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isButtonLoading}
      onClick={onClick}
      {...props}
    >
      {isButtonLoading ? (
        <>
          <LoaderIcon className="h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
