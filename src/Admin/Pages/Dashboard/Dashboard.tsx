import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import dashboardService, { type UserRow } from "../../../services/dashboardService";


const isAdmin = (t: string | number) => t === "Admin" || t === 0;

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: ReactNode; color: string }) => (
  <Paper sx={{ p: 2.5, borderRadius: 3, display: "flex", alignItems: "center", gap: 2 }}>
    <Box sx={{ width: 52, height: 52, borderRadius: 2, color: "#fff", bgcolor: color, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{value.toLocaleString()}</Typography>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const ChartCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Paper sx={{ p: 2.5, borderRadius: 3 }}>
    <Typography sx={{ fontWeight: 600, mb: 2 }}>{title}</Typography>
    <Box sx={{ width: "100%", height: 260 }}>{children}</Box>
  </Paper>
);

const Dashboard = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardService.getUsers().then((r) => {
      if (r.error || !r.response) setError(r.message ?? "Could not load statistics.");
      else setUsers(r.response);
      setLoading(false);
    });
  }, []);

  const s = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => isAdmin(u.userType)).length;
    const confirmed = users.filter((u) => u.emailConfirmed).length;
    const locked = users.filter((u) => u.lockoutEnd && new Date(u.lockoutEnd) > new Date()).length;
    return { total, admins, regular: total - admins, confirmed, unconfirmed: total - confirmed, locked };
  }, [users]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

  const roleData = [
    { name: "Admins", count: s.admins },
    { name: "Users", count: s.regular },
  ];
  const confirmData = [
    { name: "Confirmed", count: s.confirmed },
    { name: "Not confirmed", count: s.unconfirmed },
  ];

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Dashboard</Typography>

      <Box sx={{ display: "grid", gap: 2, mb: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" } }}>
        <StatCard title="Total users" value={s.total} icon={<PeopleIcon />} color="#1e3a8a" />
        <StatCard title="Admins" value={s.admins} icon={<AdminPanelSettingsIcon />} color="#6d28d9" />
        <StatCard title="Regular users" value={s.regular} icon={<PersonIcon />} color="#0ea5e9" />
        <StatCard title="Activated (email confirmed)" value={s.confirmed} icon={<VerifiedUserIcon />} color="#16a34a" />
        <StatCard title="Not activated" value={s.unconfirmed} icon={<MarkEmailUnreadIcon />} color="#f59e0b" />
        <StatCard title="Locked accounts" value={s.locked} icon={<LockPersonIcon />} color="#ef4444" />
      </Box>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
        <ChartCard title="Users by role">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={roleData} dataKey="count" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3} label>
                {roleData.map((_, i) => <Cell key={i} fill={i === 0 ? "#6d28d9" : "#0ea5e9"} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Account status">
          <ResponsiveContainer>
            <BarChart data={[
              { name: "Activated", count: s.confirmed },
              { name: "Not activated", count: s.unconfirmed },
              { name: "Locked", count: s.locked },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Users" radius={[6, 6, 0, 0]}>
                <Cell fill="#16a34a" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Email confirmation">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={confirmData} dataKey="count" nameKey="name" outerRadius={90} label>
                {confirmData.map((_, i) => <Cell key={i} fill={i === 0 ? "#6d28d9" : "#f59e0b"} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Box>
  );
};

export default Dashboard;