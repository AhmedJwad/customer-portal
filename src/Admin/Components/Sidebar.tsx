import { useState, type ReactNode } from "react";
import {
    Avatar,
    Box,
    Collapse,
    Drawer,
    InputBase,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import { useAuth } from "../../context/AuthContext";

type NavItem = {
    text: string;
    icon: ReactNode;
    path?: string;       
    adminOnly?: boolean;
};


const menuItems: NavItem[] = [
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users", adminOnly: true },
   
    { text: "Settings", icon: <SettingsIcon />, adminOnly: true },
];

const dashboardSubItems: string[] = ["Dashboard v1", "Dashboard v2", "Dashboard v3"];

const drawerWidth = 260;
const collapsedWidth = 72;

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

const Sidebar = ({ open, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user } = useAuth();
    const isAdminUser = user?.role === "Admin";

    const [dashboardOpen, setDashboardOpen] = useState<boolean>(true);
    const [selected, setSelected] = useState<string>("");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const collapsed = !isMobile && !open;

    const visibleItems = menuItems.filter((i) => !i.adminOnly || isAdminUser);

    const collapsedButtonSx = {
        minHeight: 48,
        justifyContent: collapsed ? "center" : "flex-start",
        px: collapsed ? 0 : 2,
    } as const;

    const collapsedIconSx = {
        color: "inherit",
        minWidth: 0,
        width: collapsed ? "100%" : 36,
        justifyContent: "center",
        display: "flex",
    } as const;

    const selectedSx = {
        "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.08)", color: "#fff" },
        "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.12)" },
    };

    const renderMenuButton = (
        icon: ReactNode,
        text: string,
        isSelected: boolean,
        onClick: () => void
    ) => {
        const button = (
            <ListItemButton
                selected={isSelected}
                onClick={onClick}
                sx={{ ...collapsedButtonSx, ...selectedSx }}
            >
                <ListItemIcon sx={collapsedIconSx}>{icon}</ListItemIcon>
                {!collapsed && <ListItemText primary={text} />}
            </ListItemButton>
        );

        return collapsed ? (
            <Tooltip key={text} title={text} placement="right">
                {button}
            </Tooltip>
        ) : (
            <Box key={text}>{button}</Box>
        );
    };

    const go = (path: string) => {
        navigate(path);
        if (isMobile) onClose();
    };

    const drawerContent = (
        <>
            <Toolbar sx={{ ...collapsedButtonSx, gap: 1.5, minHeight: "64px !important" }}>
                <Box sx={collapsedIconSx}>
                    <Avatar sx={{ bgcolor: "#495057", width: 34, height: 34 }}>
                        <DashboardCustomizeIcon fontSize="small" />
                    </Avatar>
                </Box>
                {!collapsed && (
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>
                        AdminLTE 4
                    </Typography>
                )}
            </Toolbar>

            <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }} />

            {!collapsed && (
                <Box sx={{ px: 2, py: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "#2c3440",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                        }}
                    >
                        <SearchIcon fontSize="small" sx={{ color: "#8a94a6", mr: 1 }} />
                        <InputBase
                            placeholder="Filter menu..."
                            sx={{ color: "#fff", fontSize: 14, width: "100%" }}
                        />
                    </Box>
                </Box>
            )}

            <Box sx={{ overflow: "auto" }}>
                <List component="nav" disablePadding>
                    {/* 1) Home */}
                    {renderMenuButton(<HomeIcon />, "Home", pathname === "/admin", () => go("/admin"))}

                    {/* 2) Users وبقية قوائم الإدارة (للأدمن فقط) */}
                    {visibleItems.map((item) =>
                        renderMenuButton(
                            item.icon,
                            item.text,
                            item.path ? pathname === item.path : selected === item.text,
                            () => {
                                setSelected(item.text);
                                if (item.path) go(item.path);
                                else if (isMobile) onClose();
                            }
                        )
                    )}

                    {isAdminUser && (
                        <>
                            {collapsed ? (
                                <Tooltip title="Dashboard" placement="right">
                                    <ListItemButton sx={collapsedButtonSx}>
                                        <ListItemIcon sx={collapsedIconSx}>
                                            <DashboardIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </Tooltip>
                            ) : (
                                <ListItemButton
                                    onClick={() => setDashboardOpen(!dashboardOpen)}
                                    sx={collapsedButtonSx}
                                >
                                    <ListItemIcon sx={collapsedIconSx}>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Dashboard" />
                                    {dashboardOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </ListItemButton>
                            )}

                            <Collapse in={dashboardOpen && !collapsed} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {dashboardSubItems.map((label) => (
                                        <ListItemButton
                                            key={label}
                                            selected={selected === label}
                                            onClick={() => {
                                                setSelected(label);
                                                if (isMobile) onClose();
                                            }}
                                            sx={{ pl: 6, ...selectedSx }}
                                        >
                                            <ListItemText primary={label} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    )}
                </List>
            </Box>
        </>
    );

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? open : true}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            sx={{
                width: isMobile ? drawerWidth : collapsed ? collapsedWidth : drawerWidth,
                flexShrink: 0,
                whiteSpace: "nowrap",
                transition: (t) => t.transitions.create("width", { duration: t.transitions.duration.shortest }),
                "& .MuiDrawer-paper": {
                    width: isMobile ? drawerWidth : collapsed ? collapsedWidth : drawerWidth,
                    boxSizing: "border-box",
                    overflowX: "hidden",
                    transition: (t) => t.transitions.create("width", { duration: t.transitions.duration.shortest }),
                    backgroundColor: "#343a40",
                    color: "#c2c7d0",
                    borderRight: "none",
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
};

export default Sidebar;