import { AuthProvider } from "../shared/hooks/useAuth.jsx";

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
