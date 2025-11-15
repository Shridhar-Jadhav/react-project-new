
import { useState, useEffect } from 'react';
import { Box, Button, Card, TextField, Typography, MenuItem, IconButton } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

type QA = {
  id: number;
  scenario?: string;
  evaluation: string;
  question: string;
  options: string[]; // max 4
};

const OPTIONS = ['Product 1', 'Product 2', 'Product 3'];
const SCENARIOS = ['Product','Technology','Policy','Practice'];

const STORAGE_KEY = 'evaluation_qa_v1';

function load(): QA[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(items: QA[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function EvaluationQAForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scenario, setScenario] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  useEffect(() => {
    if (id) {
      const items = load();
      const found = items.find(it => String(it.id) === String(id));
      if (found) {
        setScenario(found.scenario || '');
        setEvaluation(found.evaluation);
        setQuestion(found.question);
        setOptions(found.options.length ? found.options : ['', '']);
      }
    }
  }, [id]);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluation || !question) {
      alert('Evaluation and Question Title are required');
      return;
    }
    if (options.length === 0 || options.some(o => !o.trim())) {
      alert('Please provide at least one option and ensure none are empty');
      return;
    }
    const items = load();
    if (id) {
      const next = items.map(it => (String(it.id) === String(id) ? { ...it, scenario: scenario || undefined, evaluation, question, options } : it));
      save(next);
    } else {
      const nextId = items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1;
      items.push({ id: nextId, scenario: scenario || undefined, evaluation, question, options });
      save(items);
    }
    navigate('/evaluation-qa-management');
  };

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {id ? 'Edit Question' : 'Add Question'}
        </Typography>

        <form onSubmit={onSubmit}>
          <TextField
            select
            fullWidth
            label="Scenario (optional)"
            sx={{ mb: 2 }}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {SCENARIOS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>

          <TextField
            select
            fullWidth
            label="Evaluation"
            sx={{ mb: 2 }}
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
          >
            {OPTIONS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt:1 }}>
                <TextField
                  fullWidth
                  value={opt}
                  onChange={(e) => setOptionValue(idx, e.target.value)}
                />
                <IconButton onClick={() => removeOption(idx)} disabled={options.length<=1}>
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
            <Button variant="contained" type="submit">{id ? 'Update' : 'Save'}</Button>
            <Button sx={{ ml: 2 }} onClick={() => navigate('/evaluation-qa-management')}>Cancel</Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}

export default EvaluationQAForm;
