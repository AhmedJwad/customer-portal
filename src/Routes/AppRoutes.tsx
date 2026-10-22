import { Route, Routes } from "react-router-dom"
import AdminLayout from "../Admin/Layouts/AdminLayout"
import Dashboard from "../Admin/Pages/Dashboard/Dashboard"


const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/Admin" element={<AdminLayout/>}/>
            <Route path="Dashboard" element={<Dashboard/>}/>
            
        </Routes>
    )
}

export default AppRoutes