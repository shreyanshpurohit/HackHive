import React from 'react';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import AnnouncementsPage from './components/AnnouncementsPage';
import ProjectsPage from './components/ProjectsPage';
import ArcadePage from './components/ArcadePage';
import FAQPage from './components/FAQPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'arcade', element: <ArcadePage /> },
      { path: 'faq', element: <FAQPage /> },
    ],
  },
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
