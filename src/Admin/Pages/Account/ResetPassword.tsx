import { useEffect, useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockReset from "@mui/icons-material/LockReset";
import accountService from "../../../services/accountService";

const GRADIENT = "linear-gradient(135deg, #1e3a8a, #6d28d9)";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // useSearchParams يفك الترميز تلقائياً، فيعود التوكن كما أُصدر
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const invalidLink = !email || !token;
  const mismatch = confirm.length > 0 && password !== confirm;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate("/login", { replace: true }), 2500);
    return () => clearTimeout(t);
  }, [done, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || mismatch || invalidLink) return;

    setError("");
    setLoading(true);
    const result = await accountService.resetPassword({
      email,
      token,
      password,
      confirm,
      confirmPassword: confirm, // يتجاهل السيرفر الحقل غير الموجود في الـ DTO
    });
    setLoading(false);

    if (result.error) {
      setError(result.message ?? "Could not reset the password. The link may have expired.");
      return;
    }
    setDone(true);
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
      <Paper sx={{ width: "100%", maxWidth: 440, p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: 8 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            mx: "auto",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            background: GRADIENT,
          }}
        >
          <LockReset fontSize="large" />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
          Reset password
        </Typography>

        {invalidLink ? (
          <>
            <Alert severity="error" sx={{ my: 3 }}>
              This reset link is invalid or incomplete. Please request a new one.
            </Alert>
            <Button
              component={RouterLink}
              to="/forgot-password"
              fullWidth
              variant="contained"
              sx={{ minHeight: 48, textTransform: "none" }}
            >
              Request new link
            </Button>
          </>
        ) : done ? (
          <Alert severity="success" sx={{ my: 3 }}>
            Password updated successfully. Redirecting to login...
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 1 }}>
              Choose a new password for <b>{email}</b>
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="New password"
                type={show ? "text" : "password"}
                fullWidth
                required
                autoFocus
                margin="normal"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               slotProps={{
                            input: {
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    onClick={() => setShow((s) => !s)}
                                    edge="end"
                                    aria-label="toggle password visibility"
                                    >
                                    {show ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                ),
                            },
                            }}
              />
              <TextField
                label="Confirm new password"
                type={show ? "text" : "password"}
                fullWidth
                required
                margin="normal"
                autoComplete="new-password"
                value={confirm}
                error={mismatch}
                helperText={mismatch ? "Passwords do not match" : undefined}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !password || !confirm || mismatch}
                sx={{
                  mt: 2,
                  minHeight: 48,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #1e3a8a, #6d28d9)",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Update password"}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ResetPassword;