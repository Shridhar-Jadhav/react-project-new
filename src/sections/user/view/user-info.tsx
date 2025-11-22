import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import { DashboardContent } from 'src/layouts/dashboard';

// -------------------- TYPES --------------------

type UserRow = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  status: number;
  created_at?: string;
  updated_at?: string;
};

type ActivityRow = {
  id: number;
  user_id: number;
  scenario_id: number;
  evaluation_id: number;
  score: number;
  created_at: string;
  updated_at: string;
  scenario_title?: string;
  evaluation_title?: string;
};

type AnswerRow = {
  id: number;
  user_id: number;
  scenario_id: number;
  evaluation_id: number;
  question_id: number;
  selected_option: string;
  score: number;
  created_at: string;
  updated_at: string;
  question_title?: string;
  evaluation_title?: string;
};

// -------------------- API CONSTANTS --------------------

const API_USERS = 'http://localhost:5000/api/tbl_user_sign_up';
const API_ACTIVITY = 'http://localhost:5000/api/tbl_user_activity';
const API_ANSWERS = 'http://localhost:5000/api/tbl_user_answers';

// -------------------- HELPERS --------------------

function formatDateTime(dt?: string) {
  if (!dt) return '-';
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString();
}

// -------------------- COMPONENT --------------------

export function UserInfo() {
  const { id } = useParams();
  const [user, setUser] = useState<UserRow | null>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const userId = Number(id);
    if (Number.isNaN(userId)) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) All users (फक्त ह्या API मधे single user by id नाही,
        //    म्हणून frontend वर filter करतो)
        const [userRes, actRes, ansRes] = await Promise.all([
          fetch(API_USERS),
          fetch(`${API_ACTIVITY}?user_id=${userId}`),
          fetch(`${API_ANSWERS}?user_id=${userId}`),
        ]);

        if (!userRes.ok) throw new Error('User API error');
        if (!actRes.ok) throw new Error('Activity API error');
        if (!ansRes.ok) throw new Error('Answers API error');

        const usersData: UserRow[] = await userRes.json();
        const activitiesData: ActivityRow[] = await actRes.json();
        const answersData: AnswerRow[] = await ansRes.json();

        const found = usersData.find((u) => u.id === userId) || null;
        setUser(found);
        setActivities(activitiesData || []);
        setAnswers(answersData || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load user info from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // Evaluation title नुसार Q&A group करतो
  const answersByEvaluation = useMemo(() => {
    const map: Record<string, AnswerRow[]> = {};
    answers.forEach((row) => {
      const key = row.evaluation_title || 'Evaluation';
      if (!map[key]) map[key] = [];
      map[key].push(row);
    });
    return map;
  }, [answers]);

  // -------------------- RENDER STATES --------------------

  if (loading) {
    return (
      <DashboardContent>
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography>Loading user details...</Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (!user) {
    return (
      <DashboardContent>
        <Typography variant="h5">User not found</Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DashboardContent>
    );
  }

  // -------------------- MAIN UI --------------------

  return (
    <DashboardContent>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">User Info</Typography>
      </Box>

      {/* PERSONAL INFO */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Personal Info
        </Typography>
        <Typography>
          <strong>Name:</strong> {user.full_name}
        </Typography>
        <Typography>
          <strong>Phone:</strong> {user.phone || '-'}
        </Typography>
        <Typography>
          <strong>Email:</strong> {user.email || '-'}
        </Typography>
        <Typography>
          <strong>Sessions Completed (status):</strong> {user.status}
        </Typography>
      </Card>

      {/* ACTIVITIES SUMMARY */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Activities Done
        </Typography>

        {activities.length === 0 ? (
          <Typography>No activities found</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Scenario</TableCell>
                <TableCell>Evaluation</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.scenario_title || a.scenario_id}</TableCell>
                  <TableCell>{a.evaluation_title || a.evaluation_id}</TableCell>
                  <TableCell>{a.score}</TableCell>
                  <TableCell>{formatDateTime(a.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* FULL REPORT: Q&A PER EVALUATION */}
      {Object.keys(answersByEvaluation).length === 0 ? (
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Full Report</Typography>
          <Typography sx={{ mt: 1 }}>No answers found for this user.</Typography>
        </Card>
      ) : (
        Object.entries(answersByEvaluation).map(([evaluationTitle, rows]) => (
          <Card key={evaluationTitle} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {evaluationTitle} – Questions &amp; Answers
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Selected Option</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Answered At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.question_title || a.question_id}</TableCell>
                    <TableCell>{a.selected_option}</TableCell>
                    <TableCell>{a.score}</TableCell>
                    <TableCell>{formatDateTime(a.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </DashboardContent>
  );
}

export default UserInfo;
