
import { useState, type FormEvent } from "react";
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
import accountService from "../../../services/accountService";
import { tokenStorage } from "../../../services/tokenStorage";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: boolean;
  helperText?: string;
};

const PasswordField = ({
  label,
  value,
  onChange,
  autoComplete,
  error,
  helperText,
}: PasswordFieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <TextField
      label={label}
      type={show ? "text" : "password"}
      fullWidth
      required
      margin="normal"
      autoComplete={autoComplete}
      value={value}
      error={error}
      helperText={helperText}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShow((previous) => !previous)}
                edge="end"
                aria-label={
                  show ? "Hide password" : "Show password"
                }
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

const ChangePassword = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && next !== confirm;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || done || mismatch) return;

    setError("");
    setLoading(true);

    try {
      const result = await accountService.changePassword(current, next, confirm);

      if (result.error) {
        setError(
          result.message ?? "Could not change the password."
        );
        return;
      }

      setDone(true);

     
      window.setTimeout(() => {
        tokenStorage.clear();
      }, 1800);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: { xs: 1, sm: 3 },
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 0.5 }}
        >
          Change password
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          After changing it you will be signed out from all devices.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        {done && (
          <Alert severity="success" sx={{ mb: 1 }}>
            Password changed. Redirecting to login...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <PasswordField
            label="Current password"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />

          <PasswordField
            label="New password"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
          />

          <PasswordField
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            error={mismatch}
            helperText={
              mismatch ? "Passwords do not match" : undefined
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={
              loading ||
              done ||
              !current ||
              !next ||
              !confirm ||
              mismatch
            }
            sx={{
              mt: 3,
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
              background:
                "linear-gradient(90deg, #1e3a8a, #6d28d9)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update password"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
