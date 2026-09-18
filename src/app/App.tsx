import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { EsgProvider } from './context/EsgProvider';
import { AppShell } from './components/AppShell';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MainDashboard } from './pages/MainDashboard';
import { EnvironmentalDashboard } from './pages/EnvironmentalDashboard';
import { SocialDashboard } from './pages/SocialDashboard';
import { GovernanceDashboard } from './pages/GovernanceDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <EsgProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/environmental" element={<EnvironmentalDashboard />} />
            <Route path="/social" element={<SocialDashboard />} />
            <Route path="/governance" element={<GovernanceDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EsgProvider>
    </BrowserRouter>
  );
}
