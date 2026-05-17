import AuthPage from "@/pages/auth";
import TaskPage from "@/pages/task";
import TasksPage from "@/pages/tasks";
import AppLayout from "@/app/layouts/AppLayout/AppLayout";
import NotFoundPage from "@/pages/not-found";
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
