import { useState, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: '+44', country: 'UK', flag: '🇬🇧', minLength: 10, maxLength: 10 },
  { code: '+91', country: 'India', flag: '🇮🇳', minLength: 10, maxLength: 10 },
  { code: '+61', country: 'Australia', flag: '🇦🇺', minLength: 9, maxLength: 9 },
  { code: '+81', country: 'Japan', flag: '🇯🇵', minLength: 10, maxLength: 10 },
  { code: '+86', country: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: '+33', country: 'France', flag: '🇫🇷', minLength: 9, maxLength: 9 },
  { code: '+49', country: 'Germany', flag: '🇩🇪', minLength: 10, maxLength: 11 },
  { code: '+39', country: 'Italy', flag: '🇮🇹', minLength: 9, maxLength: 10 },
  { code: '+34', country: 'Spain', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: '+7', country: 'Russia', flag: '🇷🇺', minLength: 10, maxLength: 10 },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', minLength: 9, maxLength: 10 },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { code: '+52', country: 'Mexico', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', minLength: 9, maxLength: 9 },
  { code: '+971', country: 'UAE', flag: '🇦🇪', minLength: 9, maxLength: 9 },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', minLength: 9, maxLength: 9 },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', minLength: 8, maxLength: 8 },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', minLength: 9, maxLength: 10 },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿', minLength: 8, maxLength: 10 },
];

export function SignUpView() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [errors, setErrors] = useState({ name: '', number: '', email: '', policy: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const validateName = (value: string): string => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateNumber = (value: string, code: string): string => {
    const selectedCountry = countryCodes.find((c) => c.code === code);
    if (!selectedCountry) return 'Invalid country code';

    if (!value) return 'Phone number is required';

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(value)) return 'Phone number must contain only digits';

    if (value.length < selectedCountry.minLength) {
      return `Phone number must be at least ${selectedCountry.minLength} digits for ${selectedCountry.country}`;
    }

    if (value.length > selectedCountry.maxLength) {
      return `Phone number must be at most ${selectedCountry.maxLength} digits for ${selectedCountry.country}`;
    }

    return '';
  };

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePolicy = (value: boolean): string => {
    if (!value) return 'You must agree to the terms & policy to continue';
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setErrors((prev) => ({ ...prev, name: validateName(value) }));
    setSuccessMessage('');
    setApiError('');
  };

  const handleCountryCodeChange = (e: any) => {
    const code = e.target.value;
    setCountryCode(code);
    setErrors((prev) => ({ ...prev, number: validateNumber(number, code) }));
    setSuccessMessage('');
    setApiError('');
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const selectedCountry = countryCodes.find((c) => c.code === countryCode);

    if (selectedCountry && value.length <= selectedCountry.maxLength) {
      setNumber(value);
      setErrors((prev) => ({ ...prev, number: validateNumber(value, countryCode) }));
      setSuccessMessage('');
      setApiError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    setSuccessMessage('');
    setApiError('');
  };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAgreeToPolicy(checked);
    setErrors((prev) => ({ ...prev, policy: validatePolicy(checked) }));
    setSuccessMessage('');
    setApiError('');
  };

  const handleSignUp = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const nameError = validateName(name);
      const numberError = validateNumber(number, countryCode);
      const emailError = validateEmail(email);
      const policyError = validatePolicy(agreeToPolicy);

      setErrors({
        name: nameError,
        number: numberError,
        email: emailError,
        policy: policyError,
      });

      if (nameError || numberError || emailError || policyError) return;

      try {
        const payload = {
          full_name: name,
          phone: countryCode + number,
          email,
          status: 1,
        };

        const response = await fetch('http://localhost:5000/api/tbl_user_sign_up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data?.message || 'Something went wrong');
          return;
        }

        if (!data?.id) {
          setApiError('User created but id not returned from server.');
          return;
        }

        setSuccessMessage('Account created successfully!');
        setApiError('');

        setTimeout(() => {
          localStorage.setItem('user', 'true');
          localStorage.setItem('current_user_id', String(data.id)); // ⭐ important
          router.push('/scenario-options');
        }, 1500);
      } catch (error) {
        console.error(error);
        setApiError('Failed to connect to server');
      }
    },
    [name, number, email, agreeToPolicy, countryCode, router]
  );

  const selectedCountry = countryCodes.find((c) => c.code === countryCode);

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleSignUp}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      {successMessage && (
        <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {apiError && (
        <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
          {apiError}
        </Alert>
      )}

      <TextField
        fullWidth
        name="name"
        label="Full Name"
        value={name}
        onChange={handleNameChange}
        error={!!errors.name}
        helperText={errors.name}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        placeholder="Enter your full name"
      />

      <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 3 }}>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel shrink>Country</InputLabel>
          <Select value={countryCode} onChange={handleCountryCodeChange} label="Country" notched>
            {countryCodes.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          name="number"
          label="Phone Number"
          value={number}
          onChange={handleNumberChange}
          error={!!errors.number}
          helperText={errors.number}
          slotProps={{
            inputLabel: { shrink: true },
          }}
          placeholder={selectedCountry ? `Enter phone number` : 'Enter phone number'}
        />
      </Box>

      <TextField
        fullWidth
        name="email"
        label="Email Address"
        value={email}
        onChange={handleEmailChange}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        placeholder="Enter your email"
      />

      <Box sx={{ width: '100%', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox checked={agreeToPolicy} onChange={handlePolicyChange} color="primary" />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <Link
                href="/terms-and-policy"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault();
                  window.open('/terms-and-policy', '_blank');
                }}
              >
                Terms &amp; Policy
              </Link>
            </Typography>
          }
        />
        {errors.policy && (
          <FormHelperText error sx={{ ml: 2 }}>
            {errors.policy}
          </FormHelperText>
        )}
      </Box>

      <Button fullWidth size="large" type="submit" color="inherit" variant="contained">
        Start Evaluation
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Welcome</Typography>
      </Box>
      {renderForm}
    </>
  );
}
