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
              <Route path="vault" element={<VaultPage />} /> {/* Path: "/vault" */}
              <Route path="assistant" element={<AssistantPage />} /> {/* Path: "/assistant" */}
            </Route>

            {/* Fallback Route for 404 */}
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;