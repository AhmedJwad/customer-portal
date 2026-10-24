import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import accountService from "../../../services/accountService";
import { fileUrl } from "../../../config/urls";
import { useNavigate } from "react-router-dom";
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const Profile = () => {
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "", address: "" });
  const [newPhoto, setNewPhoto] = useState<string | null>(null); // base64 فقط
  const [preview, setPreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const load = async () => {
    const result = await accountService.getProfile();
    if (result.error || !result.response) {
      setError(result.message ?? "Could not load your profile.");
    } else {
      const p = result.response;
      setProfile(p);
      setForm({
        firstName: p.firstName ?? "",
        lastName: p.lastName ?? "",
        phoneNumber: p.phoneNumber ?? "",
        address: p.address ?? "",
      });
    }
    setLoading(false);
  };
  const goBack = () => {
  if (window.history.state?.idx > 0) {
    navigate(-1);                     
  } else {
    navigate("/admin", { replace: true }); 
  }
};

  useEffect(() => {
    load();
  }, []);

  const setField = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setNewPhoto(dataUrl.split(",")[1]); 
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving || !profile) return;

    setError("");
    setSuccess("");
    setSaving(true);

    const result = await accountService.updateProfile({
      ...profile,
      ...form,
      photo: newPhoto ?? "", 
    });

    setSaving(false);

    if (result.error) {
      setError(result.message ?? "Could not update your profile.");
      return;
    }

    setSuccess("Profile updated successfully.");
    setNewPhoto(null);
    setPreview(undefined);
    setTimeout(goBack, 1200); 
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const shownPhoto = preview ?? fileUrl(profile?.photo);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: { xs: 1, sm: 3 } }}>
      <Paper sx={{ width: "100%", maxWidth: 640, p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Edit profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Avatar src={shownPhoto} sx={{ width: 110, height: 110, mb: 1.5 }}>
              {form.firstName?.[0]}
            </Avatar>
            <Button component="label" size="small" startIcon={<PhotoCamera />} sx={{ textTransform: "none" }}>
              Change photo
              <input hidden type="file" accept="image/*" onChange={handlePhoto} />
            </Button>
          </Box>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField label="First name" required value={form.firstName} onChange={setField("firstName")} />
            <TextField label="Last name" required value={form.lastName} onChange={setField("lastName")} />
            <TextField
              label="Email"
              value={profile?.email ?? ""}
              disabled
              helperText="Email cannot be changed"
              sx={{ gridColumn: { sm: "1 / -1" } }}
            />
            <TextField label="Phone" value={form.phoneNumber} onChange={setField("phoneNumber")} />
            <TextField label="Address" value={form.address} onChange={setField("address")} />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={saving || !form.firstName || !form.lastName}
            sx={{
              mt: 3,
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(90deg, #1e3a8a, #6d28d9)",
            }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : "Save changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;