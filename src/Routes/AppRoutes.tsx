import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../Admin/Layouts/AdminLayout";
import Dashboard from "../Admin/Pages/Dashboard/Dashboard";
import Login from "../Admin/Pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import NotAuthorized from "../Admin/Pages/NotAuthorized/NotAuthorized";
import ChangePassword from "../Admin/Pages/Account/ChangePassword";
import Profile from "../Admin/Pages/Account/Profile";

const AppRoutes = () => {
  return (
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/not-authorized" element={<NotAuthorized />} />

  <Route element={<ProtectedRoute roles={["Admin"]} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />  
      <Route path="change-password" element={<ChangePassword />} />
       <Route path="profile" element={<Profile />} />    
    </Route>
  </Route>

  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
  );
};

export default AppRoutes;