import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate, useParams } from 'react-router-dom';

// --------------------
// TYPES
// --------------------
type Scenario = {
  id: number;
  title: string;
  description: string;
  image: string;
  status: number;
};

type Evaluation = {
  id: number;
  scenario_id: number;
  title: string;
  description: string;
  status: number;
};

type Payload = {
  scenario_id: number;
  title: string;
  description: string;
  status: number;
};

// --------------------
const API_EVAL = 'http://localhost:5000/api/tbl_evaluation';
const API_SCENARIO = 'http://localhost:5000/api/tbl_scenario';
// --------------------

export function EvaluationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioId, setScenarioId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id);

  // -----------------------------
  // LOAD SCENARIOS FIRST
  // -----------------------------
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const res = await fetch(API_SCENARIO);
        const data = await res.json();
        setScenarios(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load scenario list');
      }
    };
    loadScenarios();
  }, []);

  // -----------------------------
  // LOAD EVALUATION IF EDIT MODE
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_EVAL);
        const data: Evaluation[] = await res.json();
        const found = data.find((e) => String(e.id) === String(id));

        if (found) {
          setScenarioId(found.scenario_id);
          setTitle(found.title);
          setDesc(found.description);
        } else {
          alert('Evaluation not found');
          navigate('/evaluation-management');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load evaluation');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scenarioId || !title.trim() || !desc.trim()) {
      alert('All fields are required');
      return;
    }

    const payload: Payload = {
      scenario_id: Number(scenarioId),
      title: title.trim(),
      description: desc.trim(),
      status: 1,
    };

    try {
      setLoading(true);

      let res;

      if (isEdit) {
        res = await fetch(`${API_EVAL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_EVAL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error('Request failed');

      navigate('/evaluation-management');
    } catch (err) {
      console.error(err);
      alert('Failed to save evaluation');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEdit ? 'Edit Evaluation' : 'Add Evaluation'}
        </Typography>

        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          {/* ---------------- SCENARIO DROPDOWN ---------------- */}
          <TextField
            select
            fullWidth
            label="Option"
            sx={{ mb: 2 }}
            value={scenarioId === '' ? '' : String(scenarioId)}
            onChange={(e) => setScenarioId(Number(e.target.value))}
          >
            {scenarios.map((sc) => (
              <MenuItem key={sc.id} value={sc.id}>
                {sc.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Title"
            sx={{ mb: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Description"
            sx={{ mb: 2 }}
            multiline
            minRows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <Box>
            <Button variant="contained" type="submit">
              {isEdit ? 'Update' : 'Save'}
            </Button>
            <Button sx={{ ml: 2 }} onClick={() => navigate('/evaluation-management')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}

export default EvaluationForm;
