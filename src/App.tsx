import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EditionsPage } from './pages/EditionsPage';
import { EditionDetailPage } from './pages/EditionDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { RubricPage } from './pages/RubricPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { ErrorBoundary } from './components/ErrorBoundary';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FB] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editions" element={<EditionsPage />} />
            <Route path="/editions/:year" element={<EditionDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rubric" element={<RubricPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default App;
