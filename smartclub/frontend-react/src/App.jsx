import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MemberLoginPage from "./pages/MemberLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AreaAdminPage from "./pages/AreaAdminPage";
import AdminPlaceholderPage from "./pages/AdminPlaceholderPage";
import InsertUserPage from "./pages/InsertUserPage";
import SpaceInformationPage from "./pages/SpaceInformationPage";
import NewReservationPage from "./pages/NewReservationPage";

function AreaSocioPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Área do Sócio</h1>
        <p className="login-subtitle">Login realizado com sucesso.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MemberLoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/login-socio" element={<MemberLoginPage />} />
      <Route path="/acesso-admin-smartclub" element={<AdminLoginPage />} />

      <Route path="/area-socio" element={<AreaSocioPage />} />
      <Route path="/area-admin" element={<AreaAdminPage />} />

      <Route path="/admin/reservas-usuario" element={<AdminPlaceholderPage />} />
      <Route path="/admin/relatorio-espacos" element={<AdminPlaceholderPage />} />
      <Route path="/admin/editar-espacos" element={<AdminPlaceholderPage />} />
      <Route path="/admin/inserir-cliente" element={<AdminPlaceholderPage />} />
      <Route path="/admin/pagamentos" element={<AdminPlaceholderPage />} />
      <Route path="/admin/relatorio-pagamentos" element={<AdminPlaceholderPage />} />

      <Route path="/admin/inserir-usuario" element={<InsertUserPage />} />
      <Route path="/admin/informacoes-espacos" element={<SpaceInformationPage />} />
      <Route path="/admin/nova-reserva" element={<NewReservationPage />} />
    </Routes>
  );
}

export default App;