import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Divider,
    IconButton,
    InputBase,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TranslateIcon from "@mui/icons-material/Translate";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Person from "@mui/icons-material/Person";
import LockReset from "@mui/icons-material/LockReset";
import Logout from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import { getFileUrl } from "../../config/urls";
const drawerWidth = 260;
const collapsedWidth = 72;




type HeaderProps = {
    onMenuClick?: () => void;
    sidebarOpen?: boolean;
};

const Header = ({ onMenuClick, sidebarOpen = true }: HeaderProps) => {
    const currentDrawerWidth = sidebarOpen ? drawerWidth : collapsedWidth;
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
   const photoUrl = user?.photo ? getFileUrl(user.photo) : undefined;

    const openMenu = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const closeMenu = () => setAnchorEl(null);

    const go = (path: string) => {
        closeMenu();
        navigate(path);
    };

    const handleLogout = async () => {
        closeMenu();
        await logout();
        navigate("/admin/pages/login", { replace: true });
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "#fff",
                color: "#1f2937",
                boxShadow: "none",
                borderBottom: "1px solid #e5e7eb",
                width: { md: `calc(100% - ${currentDrawerWidth}px)` },
                ml: { md: `${currentDrawerWidth}px` },
                transition: (t) =>
                    t.transitions.create(["width", "margin"], { duration: t.transitions.duration.shortest }),
            }}
        >
            <Toolbar sx={{ gap: 1.5, px: 1 }}>
                <IconButton color="inherit" onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="subtitle1" noWrap sx={{ display: { xs: "none", sm: "block" } }}>
                    customer-portal
                </Typography>

                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        bgcolor: "#f3f4f6",
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.5,
                        ml: 3,
                        width: 260,
                    }}
                >
                    <SearchIcon fontSize="small" sx={{ color: "#9ca3af", mr: 1 }} />
                    <InputBase placeholder="Search..." sx={{ fontSize: 14, width: "100%" }} />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton color="inherit">
                    <Badge badgeContent={15} color="warning">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <IconButton color="inherit">
                    <TranslateIcon />
                </IconButton>
                <IconButton color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                    <FullscreenIcon />
                </IconButton>
                <IconButton color="inherit">
                    <Brightness4Icon />
                </IconButton>

             
                <Box
                    onClick={openMenu}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        ml: 1,
                        cursor: "pointer",
                        borderRadius: 2,
                        px: 0.5,
                        "&:hover": { bgcolor: "#f3f4f6" },
                    }}
                >
                    <Avatar alt={fullName} src={photoUrl} sx={{ width: 32, height: 32 }}>
                        {user?.firstName?.[0]}
                    </Avatar>
                    <Typography sx={{ display: { xs: "none", sm: "block" } }}>{fullName}</Typography>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={closeMenu}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    slotProps={{ paper: { sx: { width: 270, mt: 1, borderRadius: 2 } } }}
                >
                    
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, py: 2 }}>
                        <Avatar alt={fullName} src={photoUrl} sx={{ width: 80, height: 80, mb: 1.5 }}>
                            {user?.firstName?.[0]}
                        </Avatar>
                        <Typography  sx={{fontWeight:700}}>{fullName}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 230 }}>
                            {user?.email}
                        </Typography>
                    </Box>

                    <Divider />

                    <MenuItem onClick={() => go("/change-password")} sx={{ py: 1.2 }}>
                        <ListItemIcon>
                            <LockReset fontSize="small" />
                        </ListItemIcon>
                        Change password
                    </MenuItem>
                    <MenuItem onClick={() => go("/profile")} sx={{ py: 1.2 }}>
                        <ListItemIcon>
                            <Person  fontSize="small" />
                        </ListItemIcon>
                        Edit profile
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: "error.main" }}>
                        <ListItemIcon>
                            <Logout fontSize="small" color="error" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;