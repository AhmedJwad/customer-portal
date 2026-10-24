import { useState, type FormEvent } from "react";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import { useAuth } from "../../context/AuthContext";

const GRADIENT = "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/admin";

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.message ?? "Login failed.");
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 0, sm: 2 },
        background: "linear-gradient(135deg, #e8eefc 0%, #f6f1ff 100%)",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 900,
          minHeight: { xs: "100dvh", sm: 540 },
          borderRadius: { xs: 0, sm: 4 },
          boxShadow: { xs: "none", sm: 8 },
          overflow: "hidden",
        }}
      >
        
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flex: 1,
            p: 5,
            color: "#fff",
            background: "linear-gradient(160deg, #1e3a8a 0%, #6d28d9 100%)",
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.15)",
              mb: 3,
            }}
          >
            <StorefrontOutlined sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            Welcome Back
          </Typography>
          <Typography sx={{ opacity: 0.85, maxWidth: 280 }}>
            Sign in to manage your products, orders and customers from one place.
          </Typography>
        </Box>       
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                background: GRADIENT,
              }}
            >
              <StorefrontOutlined />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Admin Panel
            </Typography>
          </Box>

          <Typography
            variant="h5"       
            sx={{ fontWeight: 700, mb:0.5 ,fontSize: { xs: "1.35rem", sm: "1.6rem" } }}
          >
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary"  sx={{ mb: 3 }}>
            Enter your credentials to access your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email or phone"
              fullWidth
              required
              autoFocus
              autoComplete="username"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              autoComplete="current-password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
              <Link
                component={RouterLink}
                to="/admin/forgot-password"
                variant="body2"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !email || !password}
              sx={{
                mt: 3,
                py: { xs: 1.5, sm: 1.3 },
                minHeight: 48,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 600,
                background: "linear-gradient(90deg, #1e3a8a, #6d28d9)",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Typography variant="body2" sx={{textAlign:"center"}}>
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register"  sx={{ fontWeight: 600 }} underline="hover">
              Register new user
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;