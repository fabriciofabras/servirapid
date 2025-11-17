import { Navigate } from "react-router-dom";
import { getGoogleAuthURL } from "../helpers/googleAuth";

const ProtectedRoute = ({ children }) => {
  const hasToken = window.location.hash.includes("access_token");

  if (hasToken) return children;

  // Permitir localhost sin login
  if (window.location.hostname === "localhost") return children;

  // Si no hay token → mandar a Google
  window.location.href = getGoogleAuthURL();
  return null;
};

export default ProtectedRoute;
