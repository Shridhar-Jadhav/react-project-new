import { useState, useEffect } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableHead, TableRow,
  TableCell, TableContainer, TablePagination, TextField
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useNavigate } from 'react-router-dom';

type Scenario = {
  id: number;
  title: string;
  description: string;
  image?: string;
};

export function ScenarioList() {
  const [data, setData] = useState<Scenario[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadData = () => {
    fetch("http://localhost:5000/api/tbl_scenario")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/tbl_scenario/${id}`, {
      method: "DELETE",
    });
    loadData();
  };

  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: any) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Scenario Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/scenario-management/new')}
        >
          New Scenario
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </Box>

        <Scrollbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.image ? row.image : "-"}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => navigate(`/scenario-management/edit/${row.id}`)}>
                          Edit
                        </Button>
                        <Button color="error" onClick={() => onDelete(row.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No scenarios found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

export default ScenarioList;
