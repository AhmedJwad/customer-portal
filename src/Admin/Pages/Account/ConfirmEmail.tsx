import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import accountService from "../../../services/accountService";

const ConfirmEmail = () => {
  const [params] = useSearchParams();
  const userId = params.get("userId") ?? "";
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");
  const called = useRef(false); 

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!userId || !token) {
      setStatus("error");
      setMessage("This confirmation link is invalid.");
      return;
    }
    accountService.confirmEmail(userId, token).then((r) => {
      if (r.error) {
        setStatus("error");
        setMessage(r.message ?? "Could not confirm your email. The link may have expired.");
      } else {
        setStatus("ok");
      }
    });
  }, [userId, token]);

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", p: 2,
      background: "linear-gradient(135deg, #e8eefc 0%, #f6f1ff 100%)" }}>
      <Paper sx={{ width: "100%", maxWidth: 440, p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Email confirmation</Typography>
        {status === "loading" && <CircularProgress />}
        {status === "ok" && (
          <>
            <Alert severity="success" sx={{ mb: 3 }}>Your email is confirmed. You can sign in now.</Alert>
            <Button component={RouterLink} to="/login" variant="contained" fullWidth
              sx={{ minHeight: 48, textTransform: "none", background: "linear-gradient(90deg, #1e3a8a, #6d28d9)" }}>
              Go to login
            </Button>
          </>
        )}
        {status === "error" && <Alert severity="error">{message}</Alert>}
      </Paper>
    </Box>
  );
};

export default ConfirmEmail;