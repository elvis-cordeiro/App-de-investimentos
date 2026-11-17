import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { DashboardPage } from '../../features/dashboard/DashboardPage';
import { PortfolioPage } from '../../features/portfolio/PortfolioPage';
import { OpportunitiesPage } from '../../features/opportunities/OpportunitiesPage';
import { NewsPage } from '../../features/news/NewsPage';
import { PlanningPage } from '../../features/planning/PlanningPage';
import { GoalsPage } from '../../features/goals/GoalsPage';
import { SettingsPage } from '../../features/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'opportunities',
        element: <OpportunitiesPage />,
      },
      {
        path: 'news',
        element: <NewsPage />,
      },
      {
        path: 'planning',
        element: <PlanningPage />,
      },
      {
        path: 'goals',
        element: <GoalsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
