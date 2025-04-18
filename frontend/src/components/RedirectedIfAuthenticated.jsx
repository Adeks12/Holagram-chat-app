// src/components/RedirectIfAuthenticated.jsx
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

const RedirectIfAuthenticated = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return  <Loader className="size-10 animate-spin" />;// or your spinner
  }

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;