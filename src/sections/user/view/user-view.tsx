import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// USER TYPE
type User = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  status: number;
};

export function UserView() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // LOAD USERS FROM API
  useEffect(() => {
    fetch("http://localhost:5000/api/tbl_user_sign_up")
      .then((res) => res.json())
      .then((result) => {

        // SORT BY LATEST (highest id first)
        const sorted = result.sort((a: User, b: User) => b.id - a.id);

        setData(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // TOTAL USERS COUNT → STATUS
  const statusCount = data.length;

  // SEARCH FILTER
  const filtered = data.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      u.full_name.toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  // VIEW PROFILE
  const handleView = (id: number) => {
    window.location.href = `/user/info/${id}`;
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Users</Typography>
        <Typography variant="body2" color="text.secondary">
          List of Sign Up users.
        </Typography>
      </Box>

      <Card>

        {/* STATUS COUNT */}
        {/* <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Status: {statusCount}
          </Typography>
        </Box> */}

        {/* SEARCH BAR */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name, phone, or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </Box>

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Login Count</TableCell>
                  <TableCell align="right">View Info</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}

                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox checked={false} />
                      </TableCell>

                      <TableCell>{row.full_name}</TableCell>
                      <TableCell>{row.phone || '-'}</TableCell>
                      <TableCell>{row.email || '-'}</TableCell>

                      <TableCell>{row.status}</TableCell>

                      <TableCell align="right">
                        <IconButton onClick={() => handleView(row.id)}>
                          <Iconify icon="solar:eye-bold" width={22} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_e, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </DashboardContent>
  );
}

export default UserView;
