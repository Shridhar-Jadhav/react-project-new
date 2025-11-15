import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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

import { _users } from 'src/_mock';

// --------------------------------------------------
// Define proper User type that supports phone/email
// --------------------------------------------------
type User = {
  id: string;
  name: string;
  company?: string;
  isVerified?: boolean;
  avatarUrl?: string;
  status?: string;
  role?: string;
  phone?: string;
  email?: string;
};

// --------------------------------------------------

export function UserView() {
  const [data, setData] = useState<User[]>(_users as User[]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  // -------------------------------
  // FILTERED SEARCH LOGIC
  // -------------------------------
  const filtered = data.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  // -------------------------------
  // MENU HANDLERS
  // -------------------------------
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete user?')) return;
    setData(data.filter((u) => u.id !== id));
  };

  const handleView = (id: string) => {
    window.location.href = `/user/info/${id}`;
  };

  // --------------------------------------------------

  return (
    <DashboardContent>
      {/* PAGE HEADER */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Users</Typography>
        <Typography variant="body2" color="text.secondary">
          List of registered users. Search or use the actions to manage users.
        </Typography>
      </Box>

      <Card>
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

        {/* TABLE */}
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
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: User) => (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox checked={false} />
                      </TableCell>

                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.phone ?? '-'}</TableCell>
                      <TableCell>{row.email ?? '-'}</TableCell>

                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuOpen(e, row.id)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && menuId === row.id}
                          onClose={handleMenuClose}
                        >
                          <MenuItem
                            onClick={() => {
                              handleView(row.id);
                              handleMenuClose();
                            }}
                          >
                            View
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              handleDelete(row.id);
                              handleMenuClose();
                            }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        {/* PAGINATION */}
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
