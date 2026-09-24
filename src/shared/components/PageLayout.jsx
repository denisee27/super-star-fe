export default function PageLayout({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-cloud ${className}`}>
      {children}
    </div>
  );
}
