import PropTypes from "prop-types";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-red-700 text-white focus:ring-primary",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost:
      "text-primary hover:bg-primary hover:bg-opacity-10 focus:ring-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;
