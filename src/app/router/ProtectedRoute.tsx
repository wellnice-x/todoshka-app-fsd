import { useAnonUser } from "@/app/model";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { hasUserName } = useAnonUser();

  if (!hasUserName) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
