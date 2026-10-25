import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import Person from "@mui/icons-material/Person";
import LockReset from "@mui/icons-material/LockReset";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import { useAuth } from "../../../context/AuthContext";
import { fileUrl } from "../../../config/urls";

const GRADIENT = "linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)";

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text?: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, color: "text.secondary" }}>
    {icon}
    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
      {text || "-"}
    </Typography>
  </Box>
);

const ActionCard = ({
  icon, title, subtitle, onClick,
}: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) => (
  <Paper
    onClick={onClick}
    sx={{
      p: 2.5, borderRadius: 3, cursor: "pointer", display: "flex", alignItems: "center", gap: 2,
      transition: "transform .15s, box-shadow .15s",
      "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
    }}
  >
    <Box
      sx={{
        width: 48, height: 48, borderRadius: 2, color: "#fff", background: GRADIENT, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
    </Box>
  </Paper>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, maxWidth: 960, mx: "auto" }}>
      {/* بطاقة الترحيب والملف */}
      <Paper sx={{ borderRadius: 4, overflow: "hidden", mb: 3 }}>
        <Box sx={{ height: 110, background: GRADIENT }} />
        <Box sx={{ px: { xs: 2, sm: 4 }, pb: 3, mt: "-60px" }}>
          <Box
            sx={{
              display: "flex", gap: 3, alignItems: { xs: "center", sm: "flex-end" },
              flexDirection: { xs: "column", sm: "row" }, textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Avatar
              src={fileUrl(user?.photo)}
              alt={fullName}
              sx={{ width: 120, height: 120, fontSize: 48, border: "4px solid #fff", boxShadow: 3 }}
            >
              {user?.firstName?.[0]}
            </Avatar>
            <Box sx={{ flex: 1, pb: { sm: 1 } }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Welcome, {user?.firstName}
              </Typography>
              <Typography color="text.secondary">{fullName}</Typography>
            </Box>
            <Chip icon={<VerifiedUser />} label="Active account" color="success" variant="outlined" sx={{ mb: { sm: 1 } }} />
          </Box>

          <Divider sx={{ my: 2.5 }} />

          <Box sx={{ display: "grid", gap: { xs: 0, sm: 4 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <Box>
              <InfoRow icon={<EmailOutlined fontSize="small" />} text={user?.email} />
              <InfoRow icon={<PhoneOutlined fontSize="small" />} text={user?.phone} />
            </Box>
            <Box>
              <InfoRow icon={<LocationOnOutlined fontSize="small" />} text={user?.address} />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* اختصارات سريعة */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick actions</Typography>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        <ActionCard
          icon={<Person />}
          title="Edit profile"
          subtitle="Update your name, phone, address and photo"
          onClick={() => navigate("/profile")}
        />
        <ActionCard
          icon={<LockReset />}
          title="Change password"
          subtitle="Keep your account secure"
          onClick={() => navigate("/change-password")}
        />
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="text" onClick={() => navigate("/profile")} sx={{ textTransform: "none" }}>
          Manage my account
        </Button>
      </Box>
    </Box>
  );
};

export default UserDashboard;