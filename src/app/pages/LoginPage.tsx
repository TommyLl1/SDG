import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Database, FileUp, LogIn } from 'lucide-react';
import { setSession } from '../../lib/storage';
import { BRAND } from '../../lib/brand';
import { BrandLogo } from '../components/BrandLogo';

type EntryTab = 'login' | 'upload' | 'api';

const tabs: { id: EntryTab; label: string; icon: typeof LogIn }[] = [
  { id: 'login', label: 'Sign in', icon: LogIn },
  { id: 'upload', label: 'Upload data', icon: FileUp },
  { id: 'api', label: 'Connect API', icon: Database },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<EntryTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [endpoint, setEndpoint] = useState('');
  const [token, setToken] = useState('');

  const continueToApp = () => {
    setSession();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-[#365828]">
      <header className="bg-white border-b border-[#365828]">
        <div className="max-w-xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#365828] text-sm hover:text-[#365828]/80">
            <BrandLogo className="h-12 w-12" />
            {BRAND.name}
          </Link>
          <Link to="/" className="text-[#365828]/70 text-sm hover:text-[#365828]">
            Back to intro
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        <p className="text-[#365828]/70 text-sm mb-2">Enter the reporting system</p>
        <h1 className="mb-2">Sign in, upload files, or connect a source</h1>
        <p className="text-[#6C757D] mb-8">
          Nothing is validated. Type anything, pick any file, or paste any endpoint, then continue to the dashboards.
        </p>

        <div className="bg-white border border-[#365828]/10 rounded-lg p-6">
          <div role="tablist" aria-label="Entry method" className="grid grid-cols-3 bg-[#365828]/5 rounded p-1 mb-6">
            {tabs.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`flex items-center justify-center gap-2 py-2 px-2 text-sm rounded ${
                    active ? 'bg-[#365828] text-white' : 'text-[#365828]'
                  }`}
                  onClick={() => setTab(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {tab === 'login' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                continueToApp();
              }}
            >
              <label className="block text-sm">
                Email or name
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="mt-1 w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#365828]"
                />
              </label>
              <label className="block text-sm">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="mt-1 w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#365828]"
                />
              </label>
              <button type="submit" className="w-full py-3 px-4 bg-[#365828] text-white rounded hover:bg-[#365828]/90">
                Continue to dashboards
              </button>
            </form>
          )}

          {tab === 'upload' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                continueToApp();
              }}
            >
              <label className="block text-sm">
                Source files (CSV, JSON, Excel)
                <input
                  type="file"
                  multiple
                  accept=".csv,.json,.xlsx,.xls"
                  className="mt-1 w-full p-2 border border-[#E5E5E5] rounded text-sm"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                />
              </label>
              {files.length > 0 && (
                <ul className="text-sm text-[#6C757D] list-disc pl-5">
                  {files.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              )}
              <button type="submit" className="w-full py-3 px-4 bg-[#365828] text-white rounded hover:bg-[#365828]/90">
                Upload and continue
              </button>
            </form>
          )}

          {tab === 'api' && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                continueToApp();
              }}
            >
              <label className="block text-sm">
                Endpoint
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="internal://dongguan/ems"
                  className="mt-1 w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#365828]"
                />
              </label>
              <label className="block text-sm">
                Token or key
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 w-full p-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-[#365828]"
                />
              </label>
              <button type="submit" className="w-full py-3 px-4 bg-[#365828] text-white rounded hover:bg-[#365828]/90">
                Connect and continue
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
