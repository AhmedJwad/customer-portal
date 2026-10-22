import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    InputBase,
    Toolbar,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TranslateIcon from "@mui/icons-material/Translate";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import Brightness4Icon from "@mui/icons-material/Brightness4";
const drawerWidth = 260;
const collapsedWidth = 72;
type HeaderProps = {
    onMenuClick?: () => void;
    sidebarOpen?: boolean;
};

const Header = ({ onMenuClick, sidebarOpen = true }: HeaderProps) => {    
    const currentDrawerWidth = sidebarOpen ? drawerWidth : collapsedWidth;

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
                transition: (t) => t.transitions.create(["width", "margin"], { duration: t.transitions.duration.shortest }),
            }}
        >
            <Toolbar sx={{ gap: 1.5,  px: 1 }}>              
                <IconButton color="inherit" onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>              
                <Typography variant="subtitle1" noWrap sx={{ display: { xs: "none", sm: "block" } }}>
                    customer-portal
                </Typography>
              
                <Box
                    sx={{
                        display: "flex",
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
                    <Badge badgeContent={3} color="error">
                       
                    </Badge>
                </IconButton>

                <IconButton color="inherit">
                    <Badge badgeContent={15} color="warning">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>

                <IconButton color="inherit">
                    <TranslateIcon />
                </IconButton>

                <IconButton color="inherit">
                    <FullscreenIcon />
                </IconButton>

                <IconButton color="inherit">
                    <Brightness4Icon />
                </IconButton>
               
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
                    <Avatar
                        alt="Alexander Pierce"
                        src="/avatar-placeholder.png"
                        sx={{ width: 32, height: 32 }}
                    />
                    <Typography sx={{ display: { xs: "none", sm: "block" } }}>
                        Alexander Pierce
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;