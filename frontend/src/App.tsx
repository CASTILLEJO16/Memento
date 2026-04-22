import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PacientesPage from './pages/PacientesPage';
import RegistrarPacientePage from './pages/RegistrarPacientePage';
import NuevaPrescripcionPage from './pages/NuevaPrescripcionPage';
import PrescripcionAlergiaPage from './pages/PrescripcionAlergiaPage';
import HistorialPage from './pages/HistorialPage';
import CompararPage from './pages/CompararPage';
import ImprimirPrescripcionPage from './pages/ImprimirPrescripcionPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; rol?: string; plain?: boolean }> = ({ children, rol, plain }) => {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (rol && usuario.rol !== rol) {
    return <Navigate to="/dashboard" />;
  }

  return plain ? <>{children}</> : <Layout>{children}</Layout>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (usuario) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pacientes"
        element={
          <ProtectedRoute rol="medico">
            <PacientesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pacientes/nuevo"
        element={
          <ProtectedRoute rol="medico">
            <RegistrarPacientePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescripciones/nueva"
        element={
          <ProtectedRoute rol="medico">
            <NuevaPrescripcionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescripciones/alergia"
        element={
          <ProtectedRoute rol="medico">
            <PrescripcionAlergiaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <HistorialPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial/:pacienteId"
        element={
          <ProtectedRoute>
            <HistorialPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescripciones/comparar/:id1/:id2"
        element={
          <ProtectedRoute>
            <CompararPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescripciones/imprimir/:id"
        element={
          <ProtectedRoute plain>
            <ImprimirPrescripcionPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
