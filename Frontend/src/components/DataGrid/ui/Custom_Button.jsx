export function Button({ children, onClick, variant = "default", className = "" }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium shadow-sm";
    const variants = {
      default: "bg-grey-600 text-white hover:bg-blue-700",
      outline: "border border-black text-black hover:bg-gray-100"
    };
  
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      >
        {children}
      </button>
    );
  }