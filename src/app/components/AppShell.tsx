import { NavLink, Navigate, Outlet, useNavigate } from 'react-router';
import { Settings, Leaf, BarChart3, Users, ShieldCheck, LogOut } from 'lucide-react';
import { useEsg } from '../context/EsgProvider';
import { SettingsModal } from './SettingsModal';
import { clearSession, hasSession } from '../../lib/storage';

const links = [
  { to: '/dashboard', label: 'Main Dashboard', end: true },
  {
    to: '/environmental',
    label: 'Environmental',
    icon: (
      <span className="flex items-center gap-1" aria-hidden="true">
        <Leaf className="w-4 h-4" strokeWidth={1.5} />
        <BarChart3 className="w-4 h-4 -ml-2" strokeWidth={1.5} />
      </span>
    ),
  },
  { to: '/social', label: 'Social', icon: <Users className="w-4 h-4" strokeWidth={1.5} /> },
  { to: '/governance', label: 'Governance', icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.5} /> },
] as const;

export function AppShell() {
  const { dataset, openSettings, openBlockers } = useEsg();
  const navigate = useNavigate();

  if (!hasSession()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="bg-[#003A70] border-b border-[#E5B700]/30">
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex items-center justify-between min-h-16">
            <div className="flex items-center min-w-0">
              <div className="pr-6 mr-1 border-r border-[#E5B700]/30 py-3 hidden xl:block">
                <p className="text-[#E5B700] text-sm leading-tight">{dataset.organization.shortName}</p>
                <p className="text-white/70 text-xs">{dataset.organization.chineseName} · FY2026 YTD</p>
              </div>
              <nav aria-label="Primary" className="flex items-stretch">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={'end' in link ? link.end : false}
                    className={({ isActive }) =>
                      `px-5 h-16 border-r border-[#E5B700]/30 transition-colors flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#E5B700] ${
                        isActive ? 'bg-[#E5B700]/10 text-[#E5B700]' : 'text-white hover:bg-[#E5B700]/5'
                      }`
                    }
                  >
                    {'icon' in link ? link.icon : null}
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {openBlockers.length > 0 && (
                <span className="hidden lg:inline text-[#E5B700] text-xs">
                  {openBlockers.length} report blocker{openBlockers.length === 1 ? '' : 's'}
                </span>
              )}
              <button
                type="button"
                onClick={() => openSettings()}
                className="p-3 text-[#E5B700] hover:bg-[#E5B700]/10 rounded transition-colors border-2 border-[#E5B700]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B700]"
                aria-label="Open settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  navigate('/');
                }}
                className="p-3 text-white/80 hover:bg-[#E5B700]/10 rounded transition-colors border-2 border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B700]"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main id="main-content" className="max-w-[1920px] mx-auto">
        <Outlet />
      </main>
      <SettingsModal />
    </div>
  );
}
