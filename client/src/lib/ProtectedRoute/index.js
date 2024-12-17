import { LANDING_PAGE_ROUTE } from "constants";
import { UserContext } from "context";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(UserContext);

  if (!isAuthenticated) {
    return <Navigate to={LANDING_PAGE_ROUTE} replace />;
  }

  return children;
};

export default ProtectedRoute;
