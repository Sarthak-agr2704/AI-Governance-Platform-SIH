import React from 'react';
import { Sidebar } from '../components/navigation/Sidebar';
import { Header } from '../components/navigation/Header';
import { NavPageId } from '../types';
import { useHealth } from '../hooks/useHealth';

interface DashboardLayoutProps {
  activePage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activePage,
  onSelectPage,
  children
}) => {
  const { isHealthy, loading, refetch } = useHealth();

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-row font-sans">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onSelectPage={onSelectPage} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activePage={activePage}
          isHealthy={isHealthy}
          loading={loading}
          onRefreshHealth={refetch}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
