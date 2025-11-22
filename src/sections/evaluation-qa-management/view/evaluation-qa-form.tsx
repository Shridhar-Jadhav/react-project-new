import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// ---------------- TYPES ----------------

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

type QARecord = {
  id: number;
  scenario_id: number;
  evaluation_id: number;
  title: string; // question title
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

export function EvaluationQAForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const [scenarioId, setScenarioId] = useState<number | ''>('');
  const [evaluationId, setEvaluationId] = useState<number | ''>('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id);

  // ---------------- LOAD SCENARIOS & EVALUATIONS ----------------
  useEffect(() => {
    const loadBaseData = async () => {
      try {
        const [scRes, evRes] = await Promise.all([
          fetch(API_SCENARIO),
          fetch(API_EVAL),
        ]);

        if (!scRes.ok || !evRes.ok) {
          throw new Error('Failed to load base data');
        }

        const scJson: Scenario[] = await scRes.json();
        const evJson: Evaluation[] = await evRes.json();

        setScenarios(scJson);
        setEvaluations(evJson);
      } catch (err) {
        console.error(err);
        alert('Failed to load scenario/evaluation list');
      }
    };

    loadBaseData();
  }, []);

  // ---------------- LOAD QA FOR EDIT ----------------
  useEffect(() => {
    if (!id) return;

    const loadQA = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_QA);
        if (!res.ok) throw new Error('Failed to load QA data');

        const data: QARecord[] = await res.json();
        const found = data.find((q) => String(q.id) === String(id));

        if (!found) {
          alert('Question not found');
          navigate('/evaluation-qa-management');
          return;
        }

        setScenarioId(found.scenario_id);
        setEvaluationId(found.evaluation_id);
        setQuestion(found.title);

        const opts = [
          found.option_1,
          found.option_2,
          found.option_3,
          found.option_4,
        ].filter((o) => o && o.trim().length > 0);

        setOptions(opts.length ? opts : ['', '']);
      } catch (err) {
        console.error(err);
        alert('Failed to load question');
        navigate('/evaluation-qa-management');
      } finally {
        setLoading(false);
      }
    };

    loadQA();
  }, [id, navigate]);

  // ---------------- OPTION HELPERS ----------------

  const addOption = () => {
    if (options.length >= 4) return;
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 1) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const setOptionValue = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  // ---------------- SUBMIT ----------------

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scenarioId || !evaluationId) {
      alert('Scenario and Evaluation are required');
      return;
    }

    if (!question.trim()) {
      alert('Question title is required');
      return;
    }

    if (options.length === 0 || options.some((o) => !o.trim())) {
      alert('Please provide at least one non-empty option');
      return;
    }

    // Normalize to 4 options
    const [o1, o2, o3, o4] = [
      options[0] || '',
      options[1] || '',
      options[2] || '',
      options[3] || '',
    ];

    const payload = {
      scenario_id: Number(scenarioId),
      evaluation_id: Number(evaluationId),
      title: question.trim(),
      option_1: o1,
      option_2: o2,
      option_3: o3,
      option_4: o4,
      status: 1,
    };

    try {
      setLoading(true);

      let res: Response;
      if (isEdit) {
        res = await fetch(`${API_QA}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_QA, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        throw new Error('Save failed');
      }

      navigate('/evaluation-qa-management');
    } catch (err) {
      console.error(err);
      alert('Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTER EVALUATIONS BY SCENARIO (for dropdown) ----------------
  const evaluationOptions = evaluations.filter((e) =>
    scenarioId ? e.scenario_id === Number(scenarioId) : true
  );

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEdit ? 'Edit Question' : 'Add Question'}
        </Typography>

        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <form onSubmit={onSubmit}>
          {/* Scenario dropdown */}
          <TextField
            select
            fullWidth
            label="Scenario"
            sx={{ mb: 2 }}
            value={scenarioId === '' ? '' : String(scenarioId)}
            onChange={(e) => {
              setScenarioId(Number(e.target.value));
              setEvaluationId(''); // reset evaluation when scenario changes
            }}
          >
            <MenuItem value="">Select Scenario</MenuItem>
            {scenarios.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.title}
              </MenuItem>
            ))}
          </TextField>

          {/* Evaluation dropdown */}
          <TextField
            select
            fullWidth
            label="Evaluation"
            sx={{ mb: 2 }}
            value={evaluationId === '' ? '' : String(evaluationId)}
            onChange={(e) => setEvaluationId(Number(e.target.value))}
          >
            <MenuItem value="">Select Evaluation</MenuItem>
            {evaluationOptions.map((ev) => (
              <MenuItem key={ev.id} value={ev.id}>
                {ev.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Question Title"
            sx={{ mb: 2 }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Answer Options (max 4)</Typography>
            {options.map((opt, idx) => (
              <Box
                key={idx}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}
              >
                <TextField
                  fullWidth
                  value={opt}
                  onChange={(e) => setOptionValue(idx, e.target.value)}
                />
                <IconButton
                  onClick={() => removeOption(idx)}
                  disabled={options.length <= 1}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
                {idx === options.length - 1 && options.length < 4 && (
                  <IconButton onClick={addOption}>
                    <AddIcon />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

          <Box>
            <Button variant="contained" type="submit" disabled={loading}>
              {isEdit ? 'Update' : 'Save'}
            </Button>
            <Button
              sx={{ ml: 2 }}
              onClick={() => navigate('/evaluation-qa-management')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}

export default EvaluationQAForm;
