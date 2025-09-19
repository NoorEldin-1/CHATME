const Button = ({
  children,
  variant = "contained",
  className = "",
  onClick,
  disabled = false,
  icon,
}) => {
  const baseClasses =
    "font-notoSansArabic flex items-center justify-center gap-2 px-4 py-1 rounded-md transition-all duration-300 font-bold text-sm uppercase select-none disabled:cursor-not-allowed cursor-pointer w-fit";

  const variantClasses = {
    contained:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300",
    outlined:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:border-blue-300 disabled:text-blue-300",
    gradient:
      "bg-gradient-to-r from-blue-800 to-white/50 text-white hover:from-white/50 hover:to-blue-800",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {icon && icon}
    </button>
  );
};

export default Button;
