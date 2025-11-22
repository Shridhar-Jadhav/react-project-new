import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TextField,
  LinearProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useNavigate } from 'react-router-dom';

type Evaluation = {
  id: number;
  scenario_id: number;
  title: string;
  description: string;
  status: number;
};

type Scenario = {
  id: number;
  title: string;
};

const API_EVAL = 'http://localhost:5000/api/tbl_evaluation';
const API_SCENARIO = 'http://localhost:5000/api/tbl_scenario';

export function EvaluationList() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // --------------------------------
  // LOAD SCENARIOS
  // --------------------------------
  useEffect(() => {
    const loadSc = async () => {
      const res = await fetch(API_SCENARIO);
      const data = await res.json();
      setScenarios(data);
    };
    loadSc();
  }, []);

  // --------------------------------
  // LOAD EVALUATIONS
  // --------------------------------
  useEffect(() => {
    const loadEval = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_EVAL);
        const data = await res.json();
        setEvaluations(data);
      } catch (err) {
        alert('Failed to load evaluation data');
      } finally {
        setLoading(false);
      }
    };

    loadEval();
  }, []);

  // --------------------------------
  // FIND SCENARIO TITLE
  // --------------------------------
  const getScenarioName = (scenarioId: number) => {
    const sc = scenarios.find((s) => s.id === scenarioId);
    return sc ? sc.title : '—';
  };

  const filtered = evaluations.filter((d) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      d.title.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );
  });

  // --------------------------------
  // DELETE
  // --------------------------------
  const onDelete = async (id: number) => {
    if (!confirm('Delete this evaluation?')) return;

    const res = await fetch(`${API_EVAL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
    } else {
      alert('Failed to delete');
    }
  };

  // --------------------------------
  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Evaluation Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/evaluation-management/new')}
        >
          New Evaluation
        </Button>
      </Box>

      <Card>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {loading && <LinearProgress />}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Option</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{getScenarioName(row.scenario_id)}</TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell>{row.description}</TableCell>

                      <TableCell align="right">
                        <Button
                          onClick={() =>
                            navigate(`/evaluation-management/edit/${row.id}`)
                          }
                        >
                          Edit
                        </Button>

                        <Button color="error" onClick={() => onDelete(row.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No evaluations found
                    </TableCell>
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
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </DashboardContent>
  );
}

export default EvaluationList;
