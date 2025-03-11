// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkflowsPage from './pages/WorkflowsPage';
import VaultPage from './pages/VaultPage';
import AssistantPage from './pages/AssistantPage';
import './styles/themes.css';
import WorkflowsPageV2 from './pages/WorkflowPageV2';
import FlowBuilderPage from './pages/FlowBuilderPage';
import FormBuilderPage from './pages/FormBuilderPage';
import CreateWorkflowPage from './pages/CreateWorkflowPage';
import MailboxPage from './pages/MailboxPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Nested Routes */}
              <Route index element={<DashboardPage />} /> {/* Path: "/" */}
              <Route path="workflows" element={<WorkflowsPage />} /> {/* Path: "/workflows" */}
              <Route path="workflowV2" element={<WorkflowsPageV2 />} /> {/* Path: "/workflowV2" */}
              <Route path="vault" element={<VaultPage />} /> {/* Path: "/vault" */}
              <Route path="assistant" element={<AssistantPage />} /> {/* Path: "/assistant" */}
              <Route path="mail" element={<MailboxPage />} />
            </Route>

              <Route path="workflowV2'" element={<WorkflowsPageV2 />} /> {/* Path: "/workflowV2" */}
              <Route path="create-workflow" element={<CreateWorkflowPage />} />
              <Route path="workflow-builder/:type" element={<FormBuilderPage />} />
              <Route path="flow-builder/:formId" element={<FlowBuilderPage />} />

            {/* Fallback Route for 404 */}
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;