import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = "md", color = "primary", className = "" }) => {
  // Size variants
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-[5px]",
    xl: "h-16 w-16 border-[6px]",
  };

  // Color variants
  const colorClasses = {
    primary: "border-t-blue-500 border-r-blue-500",
    secondary: "border-t-purple-500 border-r-purple-500",
    success: "border-t-green-500 border-r-green-500",
    danger: "border-t-red-500 border-r-red-500",
    warning: "border-t-yellow-500 border-r-yellow-500",
    light: "border-t-white border-r-white",
    dark: "border-t-gray-800 border-r-gray-800",
  };

  return (
    <div className={`inline-flex justify-center items-center ${className}`}>
      <div
        className={`rounded-full animate-spin 
                   ${sizeClasses[size]} 
                   ${colorClasses[color]}
                   border-b-transparent border-l-transparent`}
        style={{ animationDuration: "0.75s" }}
        aria-label="Loading"
        role="status"
      />
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'light', 'dark']),
  className: PropTypes.string
};

export default LoadingSpinner;
