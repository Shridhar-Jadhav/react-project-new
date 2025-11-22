import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import IconButton from '@mui/material/IconButton';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// USER TYPE
type User = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  status: number;
};

export function OverviewAnalyticsView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH USERS FROM API
  useEffect(() => {
    fetch("http://localhost:5000/api/tbl_user_sign_up")
      .then((res) => res.json())
      .then((result) => {
        const sorted = result.sort((a: User, b: User) => b.id - a.id);
        setUsers(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusCount = users.length;
  const latestFive = users.slice(0, 5);
  // VIEW PROFILE
  const handleView = (id: number) => {
    window.location.href = `/user/info/${id}`;
  };
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      {/* TOP CARDS */}
      <Grid container spacing={3}>
        {/* TOTAL USERS */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total User"
            total={statusCount} // dynamic user count
            icon={<img alt="Total User" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Completed Task"
            total={statusCount} // dynamic user count
            icon={<img alt="Completed Task" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>

        {/* REMOVE COMPLETED TASK CARD */}
      </Grid>

      {/* LATEST 5 USERS */}
      <Box sx={{ mt: 5 }}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Latest 5 Users
          </Typography>

          <Table>
            <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Login Count</TableCell>
                  <TableCell align="right">View Info</TableCell>
                </TableRow>
              </TableHead>
            <TableBody>
              {latestFive.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell>{u.email || '-'}</TableCell>
                  <TableCell>{u.phone || '-'}</TableCell>
                  <TableCell>{u.status}</TableCell>
                  {/* <TableCell
                    sx={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => (window.location.href = `/user/info/${u.id}`)}
                  >
                    View
                  </TableCell> */}
                  <TableCell align="right">
                        <IconButton onClick={() => handleView(u.id)}>
                          <Iconify icon="solar:eye-bold" width={22} />
                        </IconButton>
                      </TableCell>
                </TableRow>
              ))}

              {latestFive.length === 0 && (
                <TableRow><TableCell>No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* VIEW ALL BUTTON */}
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={() => (window.location.href = '/user')}
          >
            View All
          </Button>
        </Box>
      </Box>
    </DashboardContent>
  );
}
