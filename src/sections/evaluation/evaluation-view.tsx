import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useRouter } from 'src/routes/hooks';

// -------------------------------------------------------
// API TYPES & CONSTANTS
// -------------------------------------------------------

type Evaluation = {
  id: number;
  scenario_id: number;
  title: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
};

type QuestionOption = {
  label: string;
  scoreRange: string;
  maxScore: number;
};

type Question = {
  id: number;          // same as question_id in DB
  title: string;
  options: QuestionOption[];
};

type AnswerForSubmit = {
  questionId: number;
  selectedOption: string;
  score: number;
};

const API_EVAL = 'http://localhost:5000/api/tbl_evaluation';
const API_QA = 'http://localhost:5000/api/tbl_q_a';
const API_ACTIVITY = 'http://localhost:5000/api/tbl_user_activity';
const API_USER_ANSWERS = 'http://localhost:5000/api/tbl_user_answers';

function getCurrentUserId(): number | null {
  const raw = localStorage.getItem('current_user_id');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

// DEFAULT (fallback) DATA – जर API fail झाला तर वापरू
const DEFAULT_EVALUATION_TITLE =
  'product 1: Braino: Nano Panacia granules for elderly cognition';

const DEFAULT_EVALUATION_DESCRIPTION = `The startup, Be Well Private Limited, has developed ‘Braino’ granules- a unique nano formulation of the herb Panacia Ultimatun (PU), popularly known as Panacea. “Braino’ builds on the known safe use of PU in traditional medicine in several parts of Asia and increases ease of use as it is in granulation form. Its main advantage is that it overcomes the challenges of low and slow absorption and thus reduces the quantity of PU required for optimal gains. Be Well has published its studies in older adults showing its benefits for improved cognitive health and general well-being. Be Well has partnered with local cultivators who share profit from the company. The company plants three times the greens it harvests for Braino production every year ensuring conservation and environmental protection. Be Well has acquired GMP certification, ensuring the highest quality of Braino granules production.

Braino has been tested in clinical studies and shown the potential to improve the health of ageing population globally. Data from other regions and long-term surveillance are awaited.`;

// -------------------------------------------------------

export function EvaluationView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [answers, setAnswers] = useState<AnswerForSubmit[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const evaluationIdParam = searchParams.get('evaluation_id');

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  // ----------------------------------------
  // Fetch evaluation + Q&A data from API
  // ----------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [evalRes, qaRes] = await Promise.all([
          fetch(API_EVAL),
          fetch(API_QA),
        ]);

        if (!evalRes.ok || !qaRes.ok) {
          throw new Error(
            `API error: eval=${evalRes.status}, qa=${qaRes.status}`
          );
        }

        const evalData: Evaluation[] = await evalRes.json();
        const qaData: QARecord[] = await qaRes.json();

        // ---- Select evaluation ----
        let selectedEval: Evaluation | null = null;

        const evalIdNumber = evaluationIdParam
          ? Number(evaluationIdParam)
          : NaN;

        if (!Number.isNaN(evalIdNumber)) {
          selectedEval =
            evalData.find((e) => e.id === evalIdNumber) || null;
        }

        // जर URL मधून id नसेल किंवा सापडला नाही तर: status=1 किंवा first
        if (!selectedEval && evalData.length > 0) {
          selectedEval =
            evalData.find((e) => e.status === 1) || evalData[0];
        }

        setEvaluation(selectedEval);

        // ---- Build questions from tbl_q_a for this evaluation ----
        if (selectedEval) {
          const relatedQa = qaData.filter(
            (q) => q.evaluation_id === selectedEval!.id && q.status === 1
          );

          const scoreConfig: { scoreRange: string; maxScore: number }[] = [
            { scoreRange: '0-2', maxScore: 2 },
            { scoreRange: '3-5', maxScore: 5 },
            { scoreRange: '6-7', maxScore: 7 },
            { scoreRange: '8-10', maxScore: 10 },
          ];

          const builtQuestions: Question[] = relatedQa.map((q) => {
            const labels = [
              q.option_1,
              q.option_2,
              q.option_3,
              q.option_4,
            ].filter((o) => o && o.trim().length > 0);

            const opts: QuestionOption[] = labels.map((label, index) => {
              const config =
                scoreConfig[index] || scoreConfig[scoreConfig.length - 1];

              return {
                label,
                scoreRange: config.scoreRange,
                maxScore: config.maxScore,
              };
            });

            return {
              id: q.id,
              title: q.title,
              options: opts,
            };
          });

          setQuestions(builtQuestions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load evaluation / questions from server.');
        setEvaluation(null);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [evaluationIdParam]);

  // नवीन questions लोड झाले की → currentQuestion + scores reset
  useEffect(() => {
    setCurrentQuestion(0);
    setScores([]);
    setAnswers([]);
  }, [questions.length]);

  const scenarioTitle =
    evaluation?.title || DEFAULT_EVALUATION_TITLE;

  const evaluationDescription =
    evaluation?.description || DEFAULT_EVALUATION_DESCRIPTION;

  // ----------------------------------------
  // 1-minute inactivity redirect
  // ----------------------------------------
  useEffect(() => {
    let timer: any;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        window.location.href = '/sign-up';
      }, 60000);
    };

    resetTimer();

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, []);

  // ----------------------------------------
  // Option select
  // ----------------------------------------
  const handleOptionSelect = (
    questionIndex: number,
    option: QuestionOption,
    questionId: number
  ) => {
    const newScores = [...scores];
    newScores[questionIndex] = option.maxScore;
    setScores(newScores);

    // answers array update
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId);
      const updated: AnswerForSubmit = {
        questionId,
        selectedOption: option.label,
        score: option.maxScore,
      };

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      }
      return [...prev, updated];
    });

    if (questionIndex < questions.length - 1) {
      setCurrentQuestion(questionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    if (!questions.length || !scores.length || !evaluation) return;

    const userId = getCurrentUserId();
    if (!userId) {
      alert('User not found. Please sign up again.');
      router.push('/sign-up');
      return;
    }

    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = sum / scores.length;

    try {
      // 1) Save activity (final score)
      await fetch(API_ACTIVITY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          scenario_id: evaluation.scenario_id,
          evaluation_id: evaluation.id,
          score: avg,
        }),
      });

      // 2) Save each answer
      await Promise.all(
        answers.map((ans) =>
          fetch(API_USER_ANSWERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              scenario_id: evaluation.scenario_id,
              evaluation_id: evaluation.id,
              question_id: ans.questionId,
              selected_option: ans.selectedOption,
              score: ans.score,
            }),
          })
        )
      );
    } catch (err) {
      console.error('Failed to save answers/activity', err);
      // saving fail झाला तरी user ला result दाखवू
    }

    // 👉 result page वर redirect
    router.push(
      `/results?score=${avg.toFixed(1)}&evaluation_id=${
        evaluation.id
      }&type=${encodeURIComponent(scenarioTitle)}`
    );
  };

  // ----------------------------------------
  // Loading state
  // ----------------------------------------
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              Loading evaluation...
            </Typography>
            <LinearProgress />
          </Box>
        </Box>
      </Container>
    );
  }

  // ----------------------------------------
  // No questions configured
  // ----------------------------------------
  if (!questions.length) {
    return (
      <Container maxWidth="md">
        <Box sx={{ minHeight: '100vh', py: 5 }}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              {scenarioTitle}
            </Typography>

            {error && (
              <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
                {error}
              </Typography>
            )}

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 3, whiteSpace: 'pre-line' }}
            >
              {evaluationDescription}
            </Typography>

            <Typography variant="h6" sx={{ mt: 4 }}>
              No questions configured for this evaluation yet.
            </Typography>
          </Card>
        </Box>
      </Container>
    );
  }

  const activeQuestion = questions[currentQuestion];

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 5 }}>
        <Card sx={{ p: 4 }}>
          {/* TOP TITLE + DESCRIPTION */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, mb: 2, textTransform: 'capitalize' }}
            >
              {scenarioTitle}
            </Typography>

            {error && (
              <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
                {error} Showing default content.
              </Typography>
            )}

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 3, whiteSpace: 'pre-line' }}
            >
              {evaluationDescription}
            </Typography>

            {/* PROGRESS BAR */}
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

          {/* QUESTION */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 4 }}>
              {activeQuestion.title}
            </Typography>

            {/* OPTIONS */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    scores[currentQuestion] === option.maxScore
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() =>
                    handleOptionSelect(currentQuestion, option, activeQuestion.id)
                  }
                  sx={{
                    py: 2,
                    px: 3,
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    fontSize: '1rem',
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

          {/* NEXT / PREVIOUS / SUBMIT */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="contained"
              disabled={currentQuestion === 0}
              onClick={handlePrevious}
            >
              Previous
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="contained"
                disabled={scores[currentQuestion] == null}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled={scores[currentQuestion] == null}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
