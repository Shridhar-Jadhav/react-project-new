import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));

export const UserInfoPage = lazy(() => import('src/sections/user/view/user-info').then((m) => ({ default: m.UserInfo })));

export const EvaluationQAListPage = lazy(() => import('src/sections/evaluation-qa-management/view/evaluation-qa-list').then((m) => ({ default: m.EvaluationQAList })));
export const EvaluationQAFormPage = lazy(() => import('src/sections/evaluation-qa-management/view/evaluation-qa-form').then((m) => ({ default: m.EvaluationQAForm })));

export const ScenarioListPage = lazy(() => import('src/sections/scenario-management/view/scenario-list').then((m) => ({ default: m.ScenarioList })));
export const ScenarioFormPage = lazy(() => import('src/sections/scenario-management/view/scenario-form').then((m) => ({ default: m.ScenarioForm })));

export const EvaluationListPage = lazy(() => import('src/sections/evaluation-management/view/evaluation-list').then((m) => ({ default: m.EvaluationList })));
export const EvaluationFormPage = lazy(() => import('src/sections/evaluation-management/view/evaluation-form').then((m) => ({ default: m.EvaluationForm })));

export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ScenarioPage = lazy(() => import('src/pages/scenario'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export const ScenarioOptionsPage = lazy(() => import('src/pages/scenario-options'));
export const EvaluationPage = lazy(() => import('src/pages/evaluation'));
export const ResultsPage = lazy(() => import('src/pages/results'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
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

export const routesSection: RouteObject[] = [
  // 👇 हा नवीन route add करा - "/" वर SignUp page दाखवा
  // {
  //   path: '/',
  //   element: (
  //     <AuthLayout>
  //       <SignUpPage />
  //     </AuthLayout>
  //   ),
  // },
  // 👇 Dashboard routes comment करा किंवा काढून टाका
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'sign-up',
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
  },
  {
    path: 'scenario',
    element: (
      <AuthLayout>
        <ScenarioPage />
      </AuthLayout>
    ),
  },
  {
    path: 'scenario-options',
    element: (
      <AuthLayout>
        <ScenarioOptionsPage />
      </AuthLayout>
    ),
  },
  {
    path: 'evaluation',
    element: (
      <AuthLayout>
        <EvaluationPage />
      </AuthLayout>
    ),
  },
  {
    path: 'results',
    element: (
      <AuthLayout>
        <ResultsPage />
      </AuthLayout>
    ),
  },

  {
    path: 'scenario-management',
    element: (
      <DashboardLayout>
        <ScenarioListPage />
      </DashboardLayout>
    ),
  },
  {
    path: 'scenario-management/new',
    element: (
      <DashboardLayout>
        <ScenarioFormPage />
      </DashboardLayout>
    ),
  },
  {
    path: 'scenario-management/edit/:id',
    element: (
      <DashboardLayout>
        <ScenarioFormPage />
      </DashboardLayout>
    ),
  },
  {
    path: 'evaluation-management',
    element: (
      <DashboardLayout>
        <EvaluationListPage />
      </DashboardLayout>
    ),
  },
  {
    path: 'evaluation-management/new',
    element: (
      <DashboardLayout>
        <EvaluationFormPage />
      </DashboardLayout>
    ),
  },
  {
    path: 'evaluation-management/edit/:id',
    element: (
      <DashboardLayout>
        <EvaluationFormPage />
      </DashboardLayout>
    ),
  },

  {
    path: 'evaluation-qa-management',
    element: (
      <DashboardLayout>
        <EvaluationQAListPage />
      </DashboardLayout>
    ),
  },
  {
    path: 'evaluation-qa-management/new',
    element: (
      <DashboardLayout>
        <EvaluationQAFormPage />
      </DashboardLayout>
    ),
  },
  {
    path: 'evaluation-qa-management/edit/:id',
    element: (
      <DashboardLayout>
        <EvaluationQAFormPage />
      </DashboardLayout>
    ),
  },

  {
    path: 'user/info/:id',
    element: (
      <DashboardLayout>
        <UserInfoPage />
      </DashboardLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];