import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { EsgProvider } from './context/EsgProvider';
import { AppShell } from './components/AppShell';
import { SettingsModal } from './components/SettingsModal';
import { MainDashboard } from './pages/MainDashboard';
import { EnvironmentalDashboard } from './pages/EnvironmentalDashboard';
import { SocialDashboard } from './pages/SocialDashboard';
import { GovernanceDashboard } from './pages/GovernanceDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <EsgProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/environmental" element={<EnvironmentalDashboard />} />
            <Route path="/social" element={<SocialDashboard />} />
            <Route path="/governance" element={<GovernanceDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
        <SettingsModal />
      </EsgProvider>
    </BrowserRouter>
  );
}
