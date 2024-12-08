import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardPage from '../pages/DashboardPage';
import WorkflowsPage from '../pages/WorkflowsPage';
import VaultPage from '../pages/VaultPage';
import AssistantPage from '../pages/AssistantPage';

export default function Layout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </main>
    </div>
  );
}