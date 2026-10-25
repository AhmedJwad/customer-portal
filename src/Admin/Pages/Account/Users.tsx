import { useEffect, useState } from "react";
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress, InputAdornment, Paper, Snackbar, Table,
  TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import usersService, { type UserItem } from "../../../services/usersService";
import { fileUrl } from "../../../config/urls";
import AddAdminDialog from "./AddAdminDialog";

const isAdmin = (t: string | number) => t === "Admin" || t === 0;
const isLocked = (u: UserItem) => !!u.lockoutEnd && new Date(u.lockoutEnd) > new Date();

const StatusChips = ({ u }: { u: UserItem }) => (
  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
    <Chip size="small" label={isAdmin(u.userType) ? "Admin" : "User"} color={isAdmin(u.userType) ? "secondary" : "default"} />
    <Chip size="small" variant="outlined" label={u.emailConfirmed ? "Activated" : "Not activated"}
      color={u.emailConfirmed ? "success" : "warning"} />
    {isLocked(u) && <Chip size="small" label="Locked" color="error" />}
  </Box>
);

const Users = () => {
  const [rows, setRows] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // جديد
  const [addOpen, setAddOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setFilter(search.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([usersService.getPage(page + 1, pageSize, filter), usersService.getCount(filter)]).then(
      ([list, count]) => {
        if (cancelled) return;
        if (list.error || !list.response) {
          setError(list.message ?? "Could not load users.");
          setRows([]);
        } else {
          setRows(list.response);
          setTotal(count.error ? list.response.length : Number(count.response));
        }
        setLoading(false);
      }
    );
    return () => { cancelled = true; };
  }, [page, pageSize, filter, reloadKey]); // reloadKey: يعيد الجلب بعد إضافة أدمن

  const fullName = (u: UserItem) => `${u.firstName} ${u.lastName}`.trim();

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2,
        justifyContent: "space-between", alignItems: { sm: "center" }, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Users</Typography>

        {/* البحث + زر الإضافة */}
        <Box sx={{ display: "flex", gap: 1.5, flexDirection: { xs: "column", sm: "row" }, width: { xs: "100%", sm: "auto" } }}>
          <TextField
            size="small" placeholder="Search by name..." value={search}
            onChange={(e) => setSearch(e.target.value)} sx={{ width: { xs: "100%", sm: 260 } }}
            slotProps={{ input: { startAdornment: (
              <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
            ) } }}
          />
          <Button
            variant="contained" startIcon={<PersonAddIcon />} onClick={() => setAddOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600, minHeight: 40, whiteSpace: "nowrap",
              background: "linear-gradient(90deg, #1e3a8a, #6d28d9)" }}
          >
            Add admin
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}><CircularProgress /></Box>
        ) : rows.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 4, textAlign: "center" }}>No users found.</Typography>
        ) : (
          <>
            <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar src={fileUrl(u.photo)} sx={{ width: 36, height: 36 }}>{u.firstName?.[0]}</Avatar>
                          <Typography sx={{ fontWeight: 600 }}>{fullName(u)}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phoneNumber ? `${u.countryCode ?? ""} ${u.phoneNumber}` : "-"}</TableCell>
                      <TableCell><StatusChips u={u} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {rows.map((u) => (
                <Box key={u.id} sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Avatar src={fileUrl(u.photo)}>{u.firstName?.[0]}</Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }}>{fullName(u)}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{u.email}</Typography>
                    </Box>
                  </Box>
                  <StatusChips u={u} />
                </Box>
              ))}
            </Box>
          </>
        )}

        <TablePagination
          component="div" count={total} page={page} rowsPerPage={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
        />
      </Paper>

     
      <AddAdminDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setAddOpen(false);
          setReloadKey((k) => k + 1);
          setToast("Admin created. A confirmation email was sent to activate the account.");
        }}
      />
      <Snackbar open={!!toast} autoHideDuration={5000} onClose={() => setToast("")} message={toast} />
    </Box>
  );
};

export default Users;