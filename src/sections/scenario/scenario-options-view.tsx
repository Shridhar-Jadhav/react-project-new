import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import { useRouter } from "src/routes/hooks";

type Scenario = {
  id: number;
  title: string;
  description: string;
  image?: string;
};

type Evaluation = {
  id: number;
  scenario_id: number;
};

type Activity = {
  scenario_id: number;
  evaluation_id: number;
};

const API_SCENARIO = "http://localhost:5000/api/tbl_scenario";
const API_EVAL = "http://localhost:5000/api/tbl_evaluation";
const API_ACTIVITY = "http://localhost:5000/api/tbl_user_activity";

function getCurrentUserId(): number | null {
  const raw = localStorage.getItem("current_user_id");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isNaN(n) ? null : n;
}

export function ScenarioOptionsView() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [evaluationMap, setEvaluationMap] = useState<Record<number, Evaluation[]>>({});
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const userId = getCurrentUserId();

  // -----------------------------------------------------
  // 1. Load Scenarios
  // -----------------------------------------------------
  useEffect(() => {
    fetch(API_SCENARIO)
      .then((res) => res.json())
      .then((result) => setScenarios(result))
      .catch(console.error);
  }, []);

  // -----------------------------------------------------
  // 2. Load All Evaluations (group by scenario)
  // -----------------------------------------------------
  useEffect(() => {
    fetch(API_EVAL)
      .then((res) => res.json())
      .then((result: Evaluation[]) => {
        const map: Record<number, Evaluation[]> = {};
        result.forEach((ev) => {
          if (!map[ev.scenario_id]) map[ev.scenario_id] = [];
          map[ev.scenario_id].push(ev);
        });

        // प्रत्येक scenario साठी evaluations id ASC ने sort करू
        Object.keys(map).forEach((key) => {
          map[Number(key)] = map[Number(key)].sort((a, b) => a.id - b.id);
        });

        setEvaluationMap(map);
      })
      .catch(console.error);
  }, []);

  // -----------------------------------------------------
  // 3. Load User Activity (which evaluations user completed)
  // -----------------------------------------------------
  useEffect(() => {
    if (!userId) return;

    fetch(`${API_ACTIVITY}?user_id=${userId}`)
      .then((res) => res.json())
      .then((result) => setUserActivities(result))
      .catch(console.error);
  }, [userId]);

  // -----------------------------------------------------
  // SCENARIO CLICK → नेहमी NEXT PENDING evaluation उघडा
  // -----------------------------------------------------
  const handleScenarioClick = (scenario: Scenario) => {
    if (!userId) {
      alert("User not found. Please sign up again.");
      router.push("/sign-up");
      return;
    }

    const evalList = evaluationMap[scenario.id] || [];
    if (!evalList.length) {
      alert("No evaluation found for this scenario.");
      return;
    }

    // या user ने या scenario साठी कोणते evaluations complete केलेत?
    const completedSet = new Set(
      userActivities
        .filter((a) => a.scenario_id === scenario.id)
        .map((a) => a.evaluation_id)
    );

    // evalList मधून पहिला असा evaluation घ्या जो completed नाही
    const nextEval = evalList.find((ev) => !completedSet.has(ev.id));

    // जर सर्व complete असतील तर काही करू नका (card आधीच disabled होईल)
    if (!nextEval) {
      return;
    }

    // NEXT pending evaluation ला redirect
    router.push(`/evaluation?evaluation_id=${nextEval.id}`);
  };

  // -----------------------------------------------------
  // SCENARIO DISABLE LOGIC — फक्त सर्व evaluations complete असतील तेव्हाच
  // -----------------------------------------------------
  const isScenarioCompleted = (scenarioId: number) => {
    const totalEvals = evaluationMap[scenarioId]?.length || 0;

    const completed = new Set(
      userActivities
        .filter((a) => a.scenario_id === scenarioId)
        .map((a) => a.evaluation_id)
    ).size;

    return completed >= totalEvals && totalEvals > 0;
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "transparent", py: 1 }}>
      <Container maxWidth={false}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, mb: 2, color: "#092862" }}
          >
            Select Innovation Domain
          </Typography>

          <Typography variant="h6" sx={{ color: "#000" }}>
            Instructions for the users will go here
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{ px: { xs: 2, sm: 3, md: 4, lg: 3 } }}
        >
          {scenarios.map((scenario) => {
            const disabled = isScenarioCompleted(scenario.id);

            return (
              <Grid key={scenario.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  onMouseEnter={() => setHoveredCard(scenario.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => !disabled && handleScenarioClick(scenario)}
                  sx={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.4 : 1,
                    pointerEvents: disabled ? "none" : "auto",
                    transition: "all 0.3s ease",
                    "&:hover": !disabled
                      ? {
                          transform: "translateY(-10px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                        }
                      : {},
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      <img
                        src={
                          scenario.image
                            ? `https://innovationtool.dcpl.co.in/uploads/${scenario.image}`
                            : "/assets/images/default.png"
                        }
                        alt={scenario.title}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "contain",
                          transition: "transform 0.3s ease",
                          transform:
                            hoveredCard === scenario.id && !disabled
                              ? "scale(1.12)"
                              : "scale(1)",
                        }}
                      />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      {scenario.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.6,
                        minHeight: "48px",
                      }}
                    >
                      {scenario.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

export default ScenarioOptionsView;
