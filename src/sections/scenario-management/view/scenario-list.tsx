
import { useState, useEffect } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, TablePagination, TextField
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

const STORAGE_KEY = 'scenarios_v1';
const DEFAULT: Scenario[] = [
  { id: 1, title: 'Product Launch', description: 'Scenario about product strategy' },
  { id: 2, title: 'Tech Upgrade', description: 'Scenario about new technology' },
];

function load(): Scenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT;
  }
}

function save(items: Scenario[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function ScenarioList() {
  const [data, setData] = useState<Scenario[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  

  const filtered = data.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (d.title || '').toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q)
    );
  });
  useEffect(() => {
    setData(load());
  }, []);

  const onDelete = (id: number) => {
    const next = data.filter(d => d.id !== id);
    setData(next);
    save(next);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <TextField fullWidth placeholder="Search by title or description" value={search} onChange={(e)=>{setSearch(e.target.value); setPage(0);}} />
        </Box>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
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
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.image ? 'Uploaded' : '-'}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => navigate(`/scenario-management/edit/${row.id}`)}>Edit</Button>
                      <Button color="error" onClick={() => onDelete(row.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
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
          count={data.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5,10,25]}
        />
      </Card>
    </DashboardContent>
  );
}

export default ScenarioList;
