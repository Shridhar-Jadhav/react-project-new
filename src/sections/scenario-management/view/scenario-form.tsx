import { useState, useEffect } from 'react';
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate, useParams } from 'react-router-dom';

export function ScenarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);

  // ------------------- FETCH SINGLE SCENARIO -------------------
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/tbl_scenario/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setDesc(data.description);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  // ------------------- SUBMIT FORM -------------------
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !desc) {
      alert("Title & Description are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    if (image) formData.append("image", image);

    try {
      if (id) {
        // UPDATE
        await fetch(`http://localhost:5000/api/tbl_scenario/${id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // CREATE
        await fetch("http://localhost:5000/api/tbl_scenario", {
          method: "POST",
          body: formData,
        });
      }

      navigate("/scenario-management");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardContent>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {id ? "Edit Scenario" : "Add Scenario"}
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
            <Button variant="contained" type="submit">
              {id ? "Update" : "Save"}
            </Button>
            <Button sx={{ ml: 2 }} onClick={() => navigate("/scenario-management")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </DashboardContent>
  );
}

export default ScenarioForm;
