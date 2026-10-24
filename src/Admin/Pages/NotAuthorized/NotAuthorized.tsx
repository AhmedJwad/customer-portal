import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { useAuth } from "../../../context/AuthContext";
import forbiddenImg from "../../../assets/forbiden.png";

const NotAuthorized = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const switchAccount = async () => {
    await logout();
    navigate("/admin/pages/login", { replace: true });
  };
  const goBack = () => {
  if (window.history.state?.idx > 0) {
    navigate(-1);
  } else {
    navigate("/", { replace: true });
  }
};
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background: "linear-gradient(135deg, #e8eefc 0%, #f6f1ff 100%)",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 520,
          textAlign: "center",
          borderRadius: 4,
          overflow: "hidden", // الصورة تلتصق بحافة البطاقة السفلى
          boxShadow: 8,
        }}
      >
        <Box sx={{ px: { xs: 3, sm: 5 }, pt: { xs: 4, sm: 5 } }}>
          <Typography
            sx={{
              fontSize: { xs: "4.5rem", sm: "6rem" },
              fontWeight: 800,
              lineHeight: 1,
              background: "linear-gradient(90deg, #1e3a8a, #6d28d9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            403
          </Typography>

          <Typography variant="h5" sx={{
                                            fontWeight: 700,
                                            mt: 1,
                                            fontSize: { xs: "1.3rem", sm: "1.6rem" },
                                        }}>
            Access denied
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            You don't have permission to view this page. If you think this is a mistake, contact your administrator.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              justifyContent: "center",
            }}
          >
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={goBack} sx={{ textTransform: "none", minHeight: 44 }}>
                Go back
            </Button>
            <Button
              variant="contained"
              startIcon={<HomeOutlined />}
              onClick={() => navigate("/admin")}
              sx={{ textTransform: "none", minHeight: 44, background: "linear-gradient(90deg, #1e3a8a, #6d28d9)" }}
            >
              Home
            </Button>
            {isAuthenticated && (
              <Button color="error" onClick={switchAccount} sx={{ textTransform: "none", minHeight: 44 }}>
                Switch account
              </Button>
            )}
          </Box>
        </Box>

        <Box
          component="img"
          src={forbiddenImg}
          alt="Forbidden"
          sx={{ display: "block", width: "100%", maxWidth: 360, mx: "auto", mt: 3 }}
        />
      </Paper>
    </Box>
  );
};

export default NotAuthorized;