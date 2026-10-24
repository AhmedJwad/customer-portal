import { useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import accountService from "../../../services/accountService";

const GRADIENT = "linear-gradient(135deg, #1e3a8a, #6d28d9)";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);
    const result = await accountService.recoverPassword(email.trim());
    setLoading(false);    
    if (result.error && result.statusCode !== 404) {
      setError(result.message ?? "Something went wrong. Please try again.");
      return;
    }
    setSent(true);
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
          <InputAdornment position="start">
            ✉
          </InputAdornment>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
          Forgot password?
        </Typography>

        {sent ? (
          <>
            <Alert severity="success" sx={{ my: 3 }}>
              If this email is registered, a reset link has been sent. Please check your inbox (and spam folder).
            </Alert>
            <Button
              component={RouterLink}
              to="/login"
              fullWidth
              variant="outlined"
              sx={{ minHeight: 48, textTransform: "none" }}
            >
              Back to login
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 2 }}>
              Enter your email and we will send you a link to reset your password.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                autoFocus
                margin="normal"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !email}
                sx={{
                  mt: 2,
                  minHeight: 48,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #1e3a8a, #6d28d9)",
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Send reset link"}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                variant="body2"
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                <ArrowBack fontSize="small" /> Back to login
              </Link>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;