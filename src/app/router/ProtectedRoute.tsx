import useAnonUser from "@/hooks/useAnonUser";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { hasUserName } = useAnonUser();

  if (!hasUserName) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
