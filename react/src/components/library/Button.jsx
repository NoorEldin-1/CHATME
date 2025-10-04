import React, { useCallback, memo } from "react";

const Button = memo(
  ({
    children,
    variant = "contained",
    className = "",
    onClick,
    disabled = false,
    icon,
  }) => {
    // Memoize the base classes to prevent recalculation on every render
    const baseClasses = React.useMemo(
      () =>
        "font-notoSansArabic flex items-center justify-center gap-2 px-4 py-1 rounded-md transition-all duration-300 font-bold text-sm uppercase select-none disabled:cursor-not-allowed cursor-pointer w-fit",
      []
    );

    // Memoize variant classes to prevent object recreation on every render
    const variantClasses = React.useMemo(
      () => ({
        contained:
          "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300",
        outlined:
          "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:border-blue-300 disabled:text-blue-300",
        gradient:
          "bg-gradient-to-r from-blue-800 to-white/50 text-white hover:from-white/50 hover:to-blue-800",
      }),
      []
    );

    // Memoize the click handler to prevent unnecessary re-renders
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onClick?.(event);
      },
      [onClick, disabled]
    );

    // Memoize the combined className to avoid string operations on every render
    const combinedClassName = React.useMemo(
      () => `${baseClasses} ${variantClasses[variant]} ${className}`.trim(),
      [baseClasses, variantClasses, variant, className]
    );

    return (
      <button
        className={combinedClassName}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
        {icon}
      </button>
    );
  }
);

// Add display name for better debugging
Button.displayName = "Button";

export default Button;
