import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


export function TermsAndPolicyView() {
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
      }}>
        <Container
            maxWidth={false}
            sx={{
            width: '100%',
            maxWidth: '100% !important',
            px: 0,
            }}>
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
              Terms & Policy
            </Typography>
            <Typography
                variant="h6"
                sx={{
                color: '#000',
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 400,
                }}
            >
              Welcome to our application. These Terms and Policy outline the rules and regulations for the use of our services. By accessing this application, you accept and agree to follow these terms. Please read them carefully to understand your responsibilities and rights.
            </Typography>
            </Box>
        </Container>
    </Box>
  );
}
