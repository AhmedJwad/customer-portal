import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../Admin/Layouts/AdminLayout";
import Dashboard from "../Admin/Pages/Dashboard/Dashboard";
import Login from "../Admin/Pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import NotAuthorized from "../Admin/Pages/NotAuthorized/NotAuthorized";
import ChangePassword from "../Admin/Pages/Account/ChangePassword";
import Profile from "../Admin/Pages/Account/Profile";
import ForgotPassword from "../Admin/Pages/Account/ForgotPassword";
import ResetPassword from "../Admin/Pages/Account/ResetPassword";
import Register from "../Admin/Pages/Account/Register";
import ConfirmEmail from "../Admin/Pages/Account/ConfirmEmail";

const AppRoutes = () => {
  return (
   <Routes>
  {/* عامة */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/confirm-email" element={<ConfirmEmail />} />
  <Route path="/not-authorized" element={<NotAuthorized />} />

  
  <Route element={<ProtectedRoute roles={["Admin"]} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
    </Route>
  </Route>

  {/* <Route element={<ProtectedRoute />}>
    <Route element={<AdminLayout />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />
    </Route>
  </Route> */}

  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
  );
};

export default AppRoutes;