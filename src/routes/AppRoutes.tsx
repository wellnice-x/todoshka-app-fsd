import AuthPage from "@/pages/AuthPage";
import TaskPage from "@/pages/TaskPage";
import TasksPage from "@/pages/TasksPage";
import AppLayout from "@/AppLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
import { Route, Routes, Navigate } from "react-router";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth" replace />} />
    <Route path="/auth" element={<AuthPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
