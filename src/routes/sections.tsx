import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------- PUBLIC PAGES -----------------
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const AdminLoginPage = lazy(() => import('src/pages/admin-login'));

export const TermsAndPolicyPage = lazy(() => import('src/pages/terms-and-policy'));
export const ScenarioOptionsPage = lazy(() => import('src/pages/scenario-options'));
export const EvaluationPage = lazy(() => import('src/pages/evaluation'));
export const ResultsPage = lazy(() => import('src/pages/results'));

// ----------------- ADMIN PAGES -----------------
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const UserPage = lazy(() => import('src/pages/user'));

export const UserInfoPage = lazy(() =>
  import('src/sections/user/view/user-info').then((m) => ({ default: m.UserInfo }))
);

export const ScenarioListPage = lazy(() =>
  import('src/sections/scenario-management/view').then((m) => ({
    default: m.ScenarioList,
  }))
);

export const ScenarioFormPage = lazy(() =>
  import('src/sections/scenario-management/view').then((m) => ({
    default: m.ScenarioForm,
  }))
);

export const EvaluationListPage = lazy(() =>
  import('src/sections/evaluation-management/view').then((m) => ({
    default: m.EvaluationList,
  }))
);

export const EvaluationFormPage = lazy(() =>
  import('src/sections/evaluation-management/view').then((m) => ({
    default: m.EvaluationForm,
  }))
);

export const EvaluationQAListPage = lazy(() =>
  import('src/sections/evaluation-qa-management/view').then((m) => ({
    default: m.EvaluationQAList,
  }))
);

export const EvaluationQAFormPage = lazy(() =>
  import('src/sections/evaluation-qa-management/view').then((m) => ({
    default: m.EvaluationQAForm,
  }))
);

export const Page404 = lazy(() => import('src/pages/page-not-found'));

const renderFallback = () => (
  <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// ----------------- ROUTES -----------------

export const routesSection: RouteObject[] = [
  // DEFAULT → Sign-up
  { path: '/', element: <Navigate to="/sign-up" replace /> },

  // ---------- PUBLIC PAGES (NO GUARD) ----------
  {
    element: (
      <AuthLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </AuthLayout>
    ),
    children: [
      { path: 'sign-up', element: <SignUpPage /> },
      { path: 'scenario-options', element: <ScenarioOptionsPage /> },
      { path: 'terms-and-policy', element: <TermsAndPolicyPage /> },
      { path: 'evaluation', element: <EvaluationPage /> },
      { path: 'results', element: <ResultsPage /> },
    ],
  },

  // ---------- ADMIN LOGIN (OPEN) ----------
  {
    path: 'admin-login',
    element: (
      <AuthLayout>
        <Suspense fallback={renderFallback()}>
          <AdminLoginPage />
        </Suspense>
      </AuthLayout>
    ),
  },

  // ---------- ADMIN PAGES (NO GUARD) ----------
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },

      { path: 'user', element: <UserPage /> },
      { path: 'user/info/:id', element: <UserInfoPage /> },

      { path: 'scenario-management', element: <ScenarioListPage /> },
      { path: 'scenario-management/new', element: <ScenarioFormPage /> },
      { path: 'scenario-management/edit/:id', element: <ScenarioFormPage /> },

      { path: 'evaluation-management', element: <EvaluationListPage /> },
      { path: 'evaluation-management/new', element: <EvaluationFormPage /> },
      { path: 'evaluation-management/edit/:id', element: <EvaluationFormPage /> },

      { path: 'evaluation-qa-management', element: <EvaluationQAListPage /> },
      { path: 'evaluation-qa-management/new', element: <EvaluationQAFormPage /> },
      { path: 'evaluation-qa-management/edit/:id', element: <EvaluationQAFormPage /> },
    ],
  },

  // 404
  { path: '*', element: <Page404 /> },
];
