import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useRouter } from 'src/routes/hooks';

const scenarios = [
  {
    id: 'product',
    icon: '📦',
    title: 'Product',
    description: 'Evaluate product innovation, design, and market fit',
    subScenarios: [
      { id: 1, path: '/evaluation' },
      { id: 2, path: '/evaluation' },
    ],
  },
  {
    id: 'technology',
    icon: '💡',
    title: 'Technology',
    description: 'Assess technological advancement and implementation',
    subScenarios: [
      { id: 1, path: '/evaluation' },
      { id: 2, path: '/evaluation' },
    ],
  },
  {
    id: 'policy',
    icon: '📋',
    title: 'Policy',
    description: 'Analyze policy innovation and governance impact',
    subScenarios: [
      { id: 1, path: '/evaluation' },
      { id: 2, path: '/evaluation' },
    ],
  },
  {
    id: 'practice',
    icon: '📊',
    title: 'Practice',
    description: 'Review process innovation and best practices',
    subScenarios: [
      { id: 1, path: '/evaluation' },
      { id: 2, path: '/evaluation' },
    ],
  },
];

export function ScenarioOptionsView() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleScenarioClick = (scenario: any) => {
    // open first subScenario path
    const first = scenario.subScenarios[0];
    router.push(first.path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'transparent',
        width: '100%',
        maxWidth: '100% !important',
        overflowX: 'hidden',
        py: 1,
        px: 0,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '100% !important',
          px: 0,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            px: 2,
            animation: 'fadeIn 0.8s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(-20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#092862',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Select Innovation Domain
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#000',
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
            }}
          >
            Instructions for the users will go here
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 3 } }}>
          {scenarios.map((scenario, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={scenario.id}>
              <Card
                onMouseEnter={() => setHoveredCard(scenario.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleScenarioClick(scenario)}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '2px solid transparent',
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                  '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    borderColor: 'primary.main',
                    background: 'rgba(255, 255, 255, 1)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      fontSize: '5rem',
                      mb: 3,
                      transition: 'transform 0.3s ease',
                      transform:
                        hoveredCard === scenario.id
                          ? 'scale(1.2) rotate(5deg)'
                          : 'scale(1)',
                      display: 'inline-block',
                    }}
                  >
                    {scenario.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: 'primary.main',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {scenario.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      lineHeight: 1.6,
                      minHeight: '48px',
                    }}
                  >
                    {scenario.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
