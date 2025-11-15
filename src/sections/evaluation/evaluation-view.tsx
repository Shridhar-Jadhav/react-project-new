import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useRouter } from 'src/routes/hooks';

const questions = [
  'Does the innovation address a significant problem or unmet need?',
  'Is the solution novel or significantly different from existing alternatives?',
  'Does it have clear potential for scalability and widespread adoption?',
  'Are there measurable benefits or improvements demonstrated?',
  'Is the implementation feasible with available resources?',
  'Does it align with regulatory and ethical standards?',
  'Is there evidence of stakeholder engagement and support?',
];

// UPDATED OPTIONS ACCORDING TO RESULT SCORE LOGIC
const options = [
  { label: 'Low Innovation Potential', scoreRange: '0-2', maxScore: 2 },
  { label: 'Medium Innovation Potential', scoreRange: '3-5', maxScore: 5 },
  { label: 'High Innovation Potential', scoreRange: '6-7', maxScore: 7 },
  { label: 'Very High Innovation Potential', scoreRange: '8-10', maxScore: 10 },
];

export function EvaluationView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const scenarioType = searchParams.get('type') || 'product';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Handle option selection
  const handleOptionSelect = (score: number) => {
    const newScores = [...scores];

    // Overwrite score if user revisiting
    newScores[currentQuestion] = score;

    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const avg = newScores.reduce((a, b) => a + b, 0) / newScores.length;
      router.push(`/results?score=${avg.toFixed(1)}&type=${scenarioType}`);
    }
  };

  // Previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 5 }}>
        <Card sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, mb: 2, textTransform: 'capitalize' }}
            >
              {scenarioType} 1: Braino: Nano Panacia granules for elderly cognition
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              The startup, Be Well Private Limited, has developed ‘Braino’ granules- a unique nano formulation of the herb Panacia Ultimatun (PU), popularly known as Panacea. “Braino’ builds on the known safe use of PU in traditional medicine in several parts of Asia and increases ease of use as it is in granulation form. Its main advantage is that it overcomes the challenges of low and slow absorption and thus reduces the quantity of PU required for optimal gains. Be Well has published its studies in older adults showing its benefits for improved cognitive health and general well-being. Be Well has partnered with local cultivators who share profit from the company. The company plants three times the greens it harvests for Braino production every year ensuring conservation and environmental protection. Be Well has acquired GMP certification, ensuring the highest quality of Braino granules production. <br />Braino has been tested in clinical studies and shown the potential to improve the health of ageing population globally. Data from othe regions and long-term surveillance are awaited.
            </Typography>


            <Box sx={{ mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'right' }}
            >
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 4 }}>
              {questions[currentQuestion]}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    scores[currentQuestion] === option.maxScore ? 'contained' : 'outlined'
                  }
                  onClick={() => handleOptionSelect(option.maxScore)}
                  sx={{
                    py: 2,
                    px: 3,
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <span>{option.label}</span>

                  <Box
                    component="span"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {option.scoreRange}
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>

          {/* NEXT & PREVIOUS BUTTONS */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              disabled={currentQuestion === 0}
              onClick={handlePrevious}
            >
              Previous
            </Button>

            <Button
              variant="contained"
              disabled={scores[currentQuestion] == null}
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
