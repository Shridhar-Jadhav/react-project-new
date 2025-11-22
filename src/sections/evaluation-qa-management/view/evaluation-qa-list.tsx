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
  MenuItem,
  LinearProgress,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useNavigate } from 'react-router-dom';

// ---------------- TYPES ----------------

type Scenario = {
  id: number;
  title: string;
};

type Evaluation = {
  id: number;
  scenario_id: number;
  title: string;
};

type QARecord = {
  id: number;
  scenario_id: number;
  evaluation_id: number;
  title: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  status: number;
};

// -------------- API URLS --------------

const API_QA = 'http://localhost:5000/api/tbl_q_a';
const API_SCENARIO = 'http://localhost:5000/api/tbl_scenario';
const API_EVAL = 'http://localhost:5000/api/tbl_evaluation';

// --------------------------------------

export function EvaluationQAList() {
  const navigate = useNavigate();

  const [qaData, setQaData] = useState<QARecord[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [filterScenario, setFilterScenario] = useState<string>('');
  const [filterEval, setFilterEval] = useState<string>('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ---------------- LOAD BASE DATA ----------------
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [scRes, evRes, qaRes] = await Promise.all([
          fetch(API_SCENARIO),
          fetch(API_EVAL),
          fetch(API_QA),
        ]);

        if (!scRes.ok || !evRes.ok || !qaRes.ok) {
          throw new Error('Failed to load data');
        }

        const scJson: Scenario[] = await scRes.json();
        const evJson: Evaluation[] = await evRes.json();
        const qaJson: QARecord[] = await qaRes.json();

        setScenarios(scJson);
        setEvaluations(evJson);
        setQaData(qaJson);
      } catch (err) {
        console.error(err);
        alert('Failed to load Q&A data');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // ---------------- HELPERS ----------------
  const getScenarioName = (id: number) => {
    const s = scenarios.find((sc) => sc.id === id);
    return s ? s.title : '—';
  };

  const getEvaluationTitle = (id: number) => {
    const e = evaluations.find((ev) => ev.id === id);
    return e ? e.title : '—';
  };

  const filtered = qaData.filter((d) => {
    const q = search.trim().toLowerCase();

    if (filterScenario && String(d.scenario_id) !== filterScenario) return false;
    if (filterEval && String(d.evaluation_id) !== filterEval) return false;

    if (!q) return true;

    const optionsText = [
      d.option_1,
      d.option_2,
      d.option_3,
      d.option_4,
    ]
      .join(' ')
      .toLowerCase();

    return (
      d.title.toLowerCase().includes(q) || optionsText.includes(q)
    );
  });

  // ---------------- DELETE ----------------
  const onDelete = async (id: number) => {
    if (!confirm('Delete this question?')) return;

    try {
      const res = await fetch(`${API_QA}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setQaData((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete question');
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // evaluation filter dropdown options – optional: filter by selected scenario
  const evaluationFilterOptions = evaluations.filter((ev) =>
    filterScenario ? String(ev.scenario_id) === filterScenario : true
  );

  return (
    <DashboardContent>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
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

      <Card sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search question or options"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            fullWidth
          />

          <TextField
            select
            value={filterScenario}
            onChange={(e) => {
              setFilterScenario(e.target.value);
              setFilterEval('');
              setPage(0);
            }}
            sx={{ width: 220 }}
          >
            <MenuItem value="">All Scenarios</MenuItem>
            {scenarios.map((s) => (
              <MenuItem key={s.id} value={String(s.id)}>
                {s.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            value={filterEval}
            onChange={(e) => {
              setFilterEval(e.target.value);
              setPage(0);
            }}
            sx={{ width: 220 }}
          >
            <MenuItem value="">All Evaluations</MenuItem>
            {evaluationFilterOptions.map((ev) => (
              <MenuItem key={ev.id} value={String(ev.id)}>
                {ev.title}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Card>

      <Card>
        {loading && <LinearProgress />}

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
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const options = [
                      row.option_1,
                      row.option_2,
                      row.option_3,
                      row.option_4,
                    ].filter((o) => o && o.trim().length > 0);

                    return (
                      <TableRow key={row.id}>
                        <TableCell>{getScenarioName(row.scenario_id)}</TableCell>
                        <TableCell>
                          {getEvaluationTitle(row.evaluation_id)}
                        </TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{options.join(', ')}</TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={() =>
                              navigate(
                                `/evaluation-qa-management/edit/${row.id}`
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            color="error"
                            onClick={() => onDelete(row.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No questions found
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </DashboardContent>
  );
}

export default EvaluationQAList;
