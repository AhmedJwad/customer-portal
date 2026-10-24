import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert, Avatar, Box, Button, CircularProgress, IconButton, InputAdornment,
  Link, Paper, TextField, Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import MarkEmailRead from "@mui/icons-material/MarkEmailRead";
import accountService from "../../../services/accountService";
import CountrySelect from "../../Components/CountrySelect";
import { DEFAULT_COUNTRY_CODE } from "../../../utils/countries";

const GRADIENT = "linear-gradient(135deg, #1e3a8a, #6d28d9)";
const MAX_SIZE = 2 * 1024 * 1024;

const Register = () => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", address: "",
    countryCode: DEFAULT_COUNTRY_CODE, password: "", confirm: "",
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [resent, setResent] = useState(false);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mismatch = form.confirm.length > 0 && form.password !== form.confirm;
  const valid =
    form.firstName && form.lastName && form.email && form.phoneNumber &&
    form.address && form.password && form.confirm && !mismatch;

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > MAX_SIZE) return setError("Image must be smaller than 2MB.");

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      setPhoto(url.split(",")[1]);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !valid) return;

    setError("");
    setLoading(true);
    const result = await accountService.register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      userName: form.email.trim(),
      countryCode: form.countryCode,
      phoneNumber: form.phoneNumber.replace(/\D/g, ""),
      address: form.address.trim(),
      password: form.password,
      passwordConfirm: form.confirm,
      confirm: form.confirm,
      photo: photo ?? "",
    });
    setLoading(false);

    if (result.error) {
      setError(result.message ?? "Registration failed.");
      return;
    }
    setRegistered(true);
  };

  const resend = async () => {
    await accountService.resendConfirmation(form.email.trim());
    setResent(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
        p: { xs: 0, sm: 2 }, background: "linear-gradient(135deg, #e8eefc 0%, #f6f1ff 100%)",
      }}
    >
      <Paper
        sx={{
          width: "100%", maxWidth: 640, p: { xs: 3, sm: 5 }, my: { sm: 2 },
          minHeight: { xs: "100dvh", sm: "auto" }, borderRadius: { xs: 0, sm: 4 },
          boxShadow: { xs: "none", sm: 8 },
        }}
      >
        {registered ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Box
              sx={{
                width: 72, height: 72, borderRadius: "50%", mx: "auto", mb: 2, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", background: GRADIENT,
              }}
            >
              <MarkEmailRead fontSize="large" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Check your email</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              We sent a confirmation link to <b>{form.email}</b>. Open it to activate your account, then sign in.
            </Typography>
            {resent && <Alert severity="success" sx={{ mb: 2 }}>Confirmation email sent again.</Alert>}
            <Box sx={{ display: "flex", gap: 1.5, flexDirection: { xs: "column", sm: "row" }, justifyContent: "center" }}>
              <Button variant="outlined" onClick={resend} sx={{ minHeight: 44, textTransform: "none" }}>
                Resend email
              </Button>
              <Button component={RouterLink} to="/login" variant="contained"
                sx={{ minHeight: 44, textTransform: "none", background: GRADIENT }}>
                Go to login
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Create account</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fill in your details to register
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Avatar src={preview} sx={{ width: 90, height: 90, mb: 1 }}>{form.firstName?.[0]}</Avatar>
                <Button component="label" size="small" startIcon={<PhotoCamera />} sx={{ textTransform: "none" }}>
                  Add photo (optional)
                  <input hidden type="file" accept="image/*" onChange={handlePhoto} />
                </Button>
              </Box>

              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <TextField label="First name" required value={form.firstName} onChange={set("firstName")} />
                <TextField label="Last name" required value={form.lastName} onChange={set("lastName")} />
                <TextField
                  label="Email" type="email" required autoComplete="email"
                  value={form.email} onChange={set("email")} sx={{ gridColumn: { sm: "1 / -1" } }}
                />

                <Box sx={{ display: "flex", gap: 1.5, gridColumn: { sm: "1 / -1" } }}>
                  <CountrySelect
                    value={form.countryCode}
                    onChange={(code) => setForm((f) => ({ ...f, countryCode: code }))}
                    sx={{ width: { xs: 140, sm: 170 }, flexShrink: 0 }}
                  />
                  <TextField
                    label="Phone" required fullWidth value={form.phoneNumber} onChange={set("phoneNumber")}
                    slotProps={{ htmlInput: { inputMode: "tel" } }}
                  />
                </Box>

                <TextField
                  label="Address" required value={form.address} onChange={set("address")}
                  sx={{ gridColumn: { sm: "1 / -1" } }}
                />
                <TextField
                  label="Password" required type={show ? "text" : "password"} autoComplete="new-password"
                  value={form.password} onChange={set("password")}
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
                  label="Confirm password" required type={show ? "text" : "password"} autoComplete="new-password"
                  value={form.confirm} onChange={set("confirm")}
                  error={mismatch} helperText={mismatch ? "Passwords do not match" : undefined}
                />
              </Box>

              <Button
                type="submit" variant="contained" fullWidth disabled={loading || !valid}
                sx={{ mt: 3, minHeight: 48, textTransform: "none", fontWeight: 600, background: GRADIENT }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ textAlign: "center", mt: 3 }}>
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
                Sign in
              </Link>
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Register;