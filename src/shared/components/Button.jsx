const VARIANTS = {
  primary: "bg-superstar-blue text-white hover:bg-deep-blue",
  secondary: "bg-white text-superstar-blue border-2 border-superstar-blue hover:bg-cloud",
  outline: "bg-transparent text-superstar-blue border border-superstar-blue hover:bg-cloud",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-graphite hover:bg-cloud",
};

export default function Button({ variant = "primary", children, className = "", disabled, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded font-sans font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <button className={`${base} ${VARIANTS[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
