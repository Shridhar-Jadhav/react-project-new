
import { useState, useEffect } from 'react';
import { Box, Button, Card, TextField, Typography, MenuItem } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate, useParams } from 'react-router-dom';

type Eval = {
  id: number;
  option: string;
  title: string;
  description: string;
};

const OPTIONS = ['Product', 'Technology', 'Policy', 'Practice'];
const STORAGE_KEY = 'evaluations_v1';

function load(): Eval[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(items: Eval[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function EvaluationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [option, setOption] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (id) {
      const items = load();
      const found = items.find(it => String(it.id) === String(id));
      if (found) {
        setOption(found.option);
        setTitle(found.title);
        setDesc(found.description);
      }
    }
  }, [id]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!option || !title || !desc) {
      alert('All fields are required');
      return;
    }
    const items = load();
    if (id) {
      const next = items.map(it => (String(it.id) === String(id) ? { ...it, option, title, description: desc } : it));
      save(next);
    } else {
      const nextId = items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1;
      items.push({ id: nextId, option, title, description: desc});
      save(items);
    }
    navigate('/evaluation-management');
  };

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {id ? 'Edit Evaluation' : 'Add Evaluation'}
        </Typography>

        <form onSubmit={onSubmit}>
          <TextField
            select
            fullWidth
            label="Option"
            sx={{ mb: 2 }}
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            {OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
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
            <Button variant="contained" type="submit">{id ? 'Update' : 'Save'}</Button>
            <Button sx={{ ml: 2 }} onClick={() => navigate('/evaluation-management')}>Cancel</Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}

export default EvaluationForm;
