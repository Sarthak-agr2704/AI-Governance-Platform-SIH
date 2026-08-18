import React, { useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { NavPageId } from './types';
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

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<NavPageId>('dashboard');

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

export default App;
