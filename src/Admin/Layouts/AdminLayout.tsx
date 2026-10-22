import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material"
import Header from "../Components/Header";

import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";



const AdminLayout=()=> {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    
    const [open, setOpen] = useState<boolean>(!isMobile);     
    const handleToggleSidebar = () => setOpen((prev) => !prev);
    useEffect(() => {
    setOpen(!isMobile);
     }, [isMobile]);
    return (
        <Box sx={{ display: "flex" }}>           
            <Header onMenuClick={handleToggleSidebar} sidebarOpen={open} />
            
            <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 3 }}>               
                <Toolbar />
               <Outlet/>
            </Box>
        </Box>
    )
}

export default AdminLayout;