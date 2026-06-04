import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
