import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

export function ResultsView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();

  const score = parseFloat(searchParams.get('score') || '0');
  const scenarioType = searchParams.get('type') || 'Evaluation';
  const evaluationId = searchParams.get('evaluation_id') || '';

  // ------------------------------------------------------
  // Badge Logic (SAME AS EVALUATION)
  // ------------------------------------------------------
  const getScoreBadge = (scoreValue: number) => {
    if (scoreValue >= 8)
      return { label: 'VERY HIGH INNOVATION POTENTIAL', color: '#4caf50' };

    if (scoreValue >= 6)
      return { label: 'HIGH INNOVATION POTENTIAL', color: '#2196f3' };

    if (scoreValue >= 3)
      return { label: 'MEDIUM INNOVATION POTENTIAL', color: '#ff9800' };

    return { label: 'LOW INNOVATION POTENTIAL', color: '#f44336' };
  };

  // ------------------------------------------------------
  // Summary Logic (SAME AS EVALUATION)
  // ------------------------------------------------------
  const getSummary = (scoreValue: number) => {
    if (scoreValue >= 8)
      return 'This innovation demonstrates very high potential and performs strongly across scalability, feasibility, novelty, and overall impact dimensions.';

    if (scoreValue >= 6)
      return 'This innovation shows high potential. It has strong characteristics and with refinement can create excellent impact.';

    if (scoreValue >= 3)
      return 'This innovation has medium potential. There are promising elements but it needs more refinement and validation to strengthen the outcome.';

    return 'This innovation currently shows low potential. Core improvements are necessary before moving toward implementation.';
  };

  const badge = getScoreBadge(score);

  // ------------------------------------------------------

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 5 }}>
        <Card sx={{ width: '100%', p: 5 }}>
          <Box sx={{ textAlign: 'center' }}>

            <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
              Evaluation Complete!
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>
              Here are your results
            </Typography>

            {/* SCORE CIRCLE */}
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 4,
              }}
            >
              <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {score}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                / 10
              </Typography>
            </Box>

            {/* BADGE */}
            <Box
              sx={{
                display: 'inline-block',
                px: 4,
                py: 1.5,
                bgcolor: badge.color,
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                mb: 4,
              }}
            >
              {badge.label}
            </Box>

            {/* SUMMARY */}
            <Box sx={{ textAlign: 'left', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Summary
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {getSummary(score)}
              </Typography>
            </Box>

            {/* BUTTONS */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/sign-up')}
                sx={{ px: 4 }}
              >
                Start New Scenario
              </Button>
            </Box>

          </Box>
        </Card>
      </Box>
    </Container>
  );
}

export default ResultsView;
