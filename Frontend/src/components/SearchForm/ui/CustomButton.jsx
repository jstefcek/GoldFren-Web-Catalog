export const Button = ({
  variant = "default",
  size = "md",
  active = false,
  className = "",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium select-none transition focus:outline-none cursor-pointer";
  const variantStyles = {
    default: "text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-200",
  };
  const sizeStyles = {
    md: "h-12 px-6",
    icon: "h-20 w-20 p-0",
  };
  const activeStyles = active ? "bg-zinc-300" : "";

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};