
import { useState, useEffect } from 'react';
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate, useParams } from 'react-router-dom';

type Scenario = {
  id: number;
  title: string;
  description: string;
  image?: string;
};

const STORAGE_KEY = 'scenarios_v1';

function load(): Scenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function save(items: Scenario[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function ScenarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      const items = load();
      const found = items.find(it => String(it.id) === String(id));
      if (found) {
        setTitle(found.title);
        setDesc(found.description);
      }
    }
  }, [id]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) {
      alert('Title and Description are required');
      return;
    }
    const items = load();
    if (id) {
      const next = items.map(it => (String(it.id) === String(id) ? { ...it, title, description: desc } : it));
      save(next);
    } else {
      const nextId = items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1;
      items.push({ id: nextId, title, description: desc, image: image ? image.name : undefined});
      save(items);
    }
    navigate('/scenario-management');
  };

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {id ? 'Edit Scenario' : 'Add Scenario'}
        </Typography>

        <form onSubmit={onSubmit}>
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

          <input
            type="file"
            accept="image/*"
            style={{ marginBottom: 20 }}
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />

          <Box>
            <Button variant="contained" type="submit">{id ? 'Update' : 'Save'}</Button>
            <Button sx={{ ml: 2 }} onClick={() => navigate('/scenario-management')}>Cancel</Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}

export default ScenarioForm;
