import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../Admin/Layouts/AdminLayout";
import Dashboard from "../Admin/Pages/Dashboard/Dashboard";
import Login from "../Admin/Pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import NotAuthorized from "../Admin/Pages/NotAuthorized/NotAuthorized";

import ForgotPassword from "../Admin/Pages/Account/ForgotPassword";
import ResetPassword from "../Admin/Pages/Account/ResetPassword";
import Register from "../Admin/Pages/Account/Register";
import ConfirmEmail from "../Admin/Pages/Account/ConfirmEmail";
import Profile from "../Admin/Pages/Account/Profile";
import ChangePassword from "../Admin/Pages/Account/ChangePassword";
import Users from "../Admin/Pages/Account/Users";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

   
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={["Admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<Users />} />
        </Route>
</Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;