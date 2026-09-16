import useAuth from "@/hooks/useAuth";
import React, { useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
  unsderConstruction?: boolean;
}
const ProtectedRoute: React.FC<ProtectedProps> = ({ children, authentication = true }) => {
  const authStatus: boolean = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    const is2FARoute = location.pathname === "/verify-2fa";
    const has2FAState = sessionStorage.getItem("2fa_state");
    
   
    if (is2FARoute && has2FAState) {
      return; 
    }

    if (authentication && authStatus !== authentication ) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
  }, [authStatus, authentication, location.pathname, navigate]);
  return <>{children}</>;
};

export default ProtectedRoute;
