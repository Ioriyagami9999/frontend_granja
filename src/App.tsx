import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { RequireAuth } from './components/RequireAuth';
import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AnimalsListPage } from './pages/Animals/AnimalsListPage';
import { AnimalNewPage } from './pages/Animals/AnimalNewPage';
import { AnimalDetailPage } from './pages/Animals/AnimalDetailPage';
import { ScanStationPage } from './pages/Animals/ScanStationPage';
import { ImportAnimalsPage } from './pages/Animals/ImportAnimalsPage';
import { CorralesPage } from './pages/Corrales/CorralesPage';
import { CorralDetailPage } from './pages/Corrales/CorralDetailPage';
import { MapaPage } from './pages/Mapa/MapaPage';
import { FormulasPage } from './pages/Formulas/FormulasPage';
import { CampoPage } from './pages/Campo/CampoPage';
import { UsersPage } from './pages/Admin/UsersPage';
import { RolesPage } from './pages/Admin/RolesPage';
import { LogsPage } from './pages/Admin/LogsPage';

function guarded(permission: string, element: ReactElement) {
  return <RequireAuth requiredPermission={permission}>{element}</RequireAuth>;
}

export default function App() {
  return (
    <Routes>
      {/* Publica: explica el sistema, botones de Iniciar sesion y WhatsApp. Si ya
          hay sesion, LandingPage redirige directo a getDefaultRoute(). */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* App operativa del rancho: dashboard, animales, corrales, formulas, campo */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={guarded('animals.read', <DashboardPage />)} />
        <Route path="/animales" element={guarded('animals.read', <AnimalsListPage />)} />
        <Route path="/animales/nuevo" element={guarded('animals.write', <AnimalNewPage />)} />
        <Route path="/animales/escanear" element={guarded('animals.write', <ScanStationPage />)} />
        <Route path="/animales/importar" element={guarded('animals.write', <ImportAnimalsPage />)} />
        <Route path="/animales/:arete" element={guarded('animals.read', <AnimalDetailPage />)} />
        <Route path="/corrales" element={guarded('corrales.read', <CorralesPage />)} />
        <Route path="/corrales/:id" element={guarded('corrales.read', <CorralDetailPage />)} />
        <Route path="/mapa" element={guarded('corrales.read', <MapaPage />)} />
        <Route path="/formulas" element={guarded('formulas.read', <FormulasPage />)} />
        <Route path="/campo" element={guarded('raciones.write', <CampoPage />)} />
      </Route>

      {/* Panel de administracion: separado de la operacion diaria, tema propio (AdminLayout) */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="usuarios" replace />} />
        <Route path="usuarios" element={guarded('users.manage', <UsersPage />)} />
        <Route path="roles" element={guarded('roles.manage', <RolesPage />)} />
        <Route path="logs" element={guarded('logs.read', <LogsPage />)} />
      </Route>
    </Routes>
  );
}
