import logoBlue from "../../assets/logo-blue.png";
import logoWhite from "../../assets/logo-white.png";

export default function Logo({ variant = "blue", className = "", height = 40 }) {
  const src = variant === "white" ? logoWhite : logoBlue;
  const alt = "Superstar Agency";
  return <img src={src} alt={alt} height={height} style={{ height }} className={`object-contain ${className}`} />;
}
