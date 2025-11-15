
import { useState, useEffect } from 'react';
import {
  Box, Button, Card, Typography, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, TablePagination, TextField, MenuItem
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useNavigate } from 'react-router-dom';

type QA = {
  id: number;
  scenario?: string;
  evaluation: string;
  question: string;
  options: string[]; // max 4
};

const STORAGE_KEY = 'evaluation_qa_v1';
const DEFAULT: QA[] = [];

function load(): QA[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    return JSON.parse(raw);
  } catch {
    return DEFAULT;
  }
}

function save(items: QA[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const SCENARIOS = ['Product','Technology','Policy','Practice'];
const EVALS = ['Product 1','Product 2','Product 3'];

export function EvaluationQAList() {
  const [data, setData] = useState<QA[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filterScenario, setFilterScenario] = useState('');
  const [filterEval, setFilterEval] = useState('');

  useEffect(() => {
    setData(load());
  }, []);

  const onDelete = (id: number) => {
    if (!confirm('Delete this question?')) return;
    const next = data.filter(d => d.id !== id);
    setData(next);
    save(next);
  };

  const filtered = data.filter(d => {
    const q = search.trim().toLowerCase();
    if (filterScenario && d.scenario !== filterScenario) return false;
    if (filterEval && d.evaluation !== filterEval) return false;
    if (!q) return true;
    return d.question.toLowerCase().includes(q) || d.options.join(' ').toLowerCase().includes(q);
  });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 2, display: 'flex', gap:2, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Evaluation Q&amp;A
        </Typography>

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/evaluation-qa-management/new')}
        >
          New Question
        </Button>
      </Box>

      <Card sx={{ mb:2, p:2 }}>
        <Box sx={{ display:'flex', gap:2, alignItems:'center' }}>
          <TextField placeholder="Search question or options" value={search} onChange={(e)=>{setSearch(e.target.value); setPage(0);}} fullWidth />
          <TextField select value={filterScenario} onChange={(e)=>{setFilterScenario(e.target.value); setPage(0);}} sx={{width:200}}>
            <MenuItem value="">All Scenarios</MenuItem>
            {SCENARIOS.map(s=> <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField select value={filterEval} onChange={(e)=>{setFilterEval(e.target.value); setPage(0);}} sx={{width:200}}>
            <MenuItem value="">All Evaluations</MenuItem>
            {EVALS.map(s=> <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </Box>
      </Card>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Scenario</TableCell>
                  <TableCell>Evaluation</TableCell>
                  <TableCell>Question</TableCell>
                  <TableCell>Options</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.scenario || '-'}</TableCell>
                    <TableCell>{row.evaluation}</TableCell>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.options.join(', ')}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => navigate(`/evaluation-qa-management/edit/${row.id}`)}>Edit</Button>
                      <Button color="error" onClick={() => onDelete(row.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No questions found</TableCell>
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
          rowsPerPageOptions={[5,10,25]}
        />
      </Card>
    </DashboardContent>
  );
}

export default EvaluationQAList;
