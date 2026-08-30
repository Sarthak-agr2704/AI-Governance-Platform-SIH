import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { NavPageId } from './types';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Models } from './pages/Models';
import { Assessments } from './pages/Assessments';
import { BiasDetection } from './pages/BiasDetection';
import { Explainability } from './pages/Explainability';
import { Monitoring } from './pages/Monitoring';
import { Governance } from './pages/Governance';
import { Compliance } from './pages/Compliance';
import { AuditTrail } from './pages/AuditTrail';
import { Reports } from './pages/Reports';
import { SettingsPage } from './pages/Settings';
import { ShieldCheck, Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activePage, setActivePage] = useState<NavPageId>('dashboard');

  // Loading Splash Screen while checking JWT token
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text-main flex flex-col items-center justify-center select-none">
        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary mb-4 animate-pulse">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Validating AegisAI Authentication Context...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated Users: Render Login or Register Pages Only
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  // Authenticated Users: Render Platform Dashboard Layout & Pages
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'models':
        return <Models />;
      case 'assessments':
        return <Assessments />;
      case 'fairness':
        return <BiasDetection />;
      case 'explainability':
        return <Explainability />;
      case 'monitoring':
        return <Monitoring />;
      case 'governance':
        return <Governance />;
      case 'compliance':
        return <Compliance />;
      case 'audit':
        return <AuditTrail />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <DashboardLayout activePage={activePage} onSelectPage={setActivePage}>
      {renderPage()}
    </DashboardLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};

export default App;
