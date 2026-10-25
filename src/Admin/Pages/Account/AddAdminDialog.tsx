import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, TextField, useMediaQuery, useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import accountService from "../../../services/accountService";
import CountrySelect from "../../Components/CountrySelect";
import { DEFAULT_COUNTRY_CODE } from "../../../utils/countries";

type Props = { open: boolean; onClose: () => void; onCreated: () => void };

const empty = {
  firstName: "", lastName: "", email: "", phoneNumber: "", address: "",
  countryCode: DEFAULT_COUNTRY_CODE, password: "", confirm: "",
};

const AddAdminDialog = ({ open, onClose, onCreated }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState(empty);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const mismatch = form.confirm.length > 0 && form.password !== form.confirm;
  const valid =
    form.firstName && form.lastName && form.email && form.phoneNumber &&
    form.address && form.password && form.confirm && !mismatch;

  const close = () => {
    if (loading) return;
    setForm(empty);
    setError("");
    setShow(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || !valid) return;

    setError("");
    setLoading(true);
    const result = await accountService.createAdmin({
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
      photo: "",
    });
    setLoading(false);

    if (result.error) {
      setError(result.message ?? "Could not create the admin.");
      return;
    }
    setForm(empty);
    onCreated();
  };

  return (
    <Dialog open={open} onClose={close} fullScreen={fullScreen} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ fontWeight: 700 }}>Add admin</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box sx={{ display: "grid", gap: 2, pt: 1, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField label="First name" required value={form.firstName} onChange={set("firstName")} />
            <TextField label="Last name" required value={form.lastName} onChange={set("lastName")} />
            <TextField
              label="Email" type="email" required value={form.email} onChange={set("email")}
              sx={{ gridColumn: { sm: "1 / -1" } }}
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
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} disabled={loading} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button
            type="submit" variant="contained" disabled={loading || !valid}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 120, background: "linear-gradient(90deg, #1e3a8a, #6d28d9)" }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Create admin"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddAdminDialog;