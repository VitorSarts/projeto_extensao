import React, { useState } from "react";
import { Link } from "react-router";

export default function AreaAdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuOptions = [
    {
      title: "Inserir usuário",
      path: "/admin/inserir-usuario",
    },
    {
      title: "Informações dos espaços",
      path: "/admin/informacoes-espacos",
    },
    {
      title: "Relatórios",
      path: "/admin/relatorio-espacos",
    },
    {
      title: "Pagamentos",
      path: "/admin/pagamentos",
    },
    {
      title: "Nova reserva",
      path: "/admin/nova-reserva",
    },
  ];

  const summaryCards = [
    {
      number: "5",
      label: "Espaços disponíveis",
    },
    {
      number: "7",
      label: "Pagamentos pendentes",
    },
    {
      number: "12",
      label: "Reservas ativas",
    },
    {
      number: "24",
      label: "Clientes cadastrados",
    },
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-left">
            <button
                type="button"
                className={`admin-dashboard-menu-button ${
                    isSidebarOpen ? "admin-dashboard-menu-button-open" : ""
                }`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Abrir ou fechar menu lateral"
            >
                ☰
            </button>

            <div className="admin-dashboard-brand">
              <img
                src="/logo-smartclub.png"
                alt="Logo Smart Club"
                className="admin-dashboard-logo"
              />
              <span className="admin-dashboard-brand-name">SmartClub</span>
            </div>
          </div>

          <div className="admin-dashboard-header-right">
            <span className="admin-dashboard-admin-label">ADM</span>

            <Link
              to="/acesso-admin-smartclub"
              className="admin-dashboard-exit-button"
            >
              Sair
            </Link>
          </div>
        </header>

        <div className="admin-dashboard-body">
          <aside
            className={`admin-dashboard-sidebar ${
              isSidebarOpen
                ? "admin-dashboard-sidebar-open"
                : "admin-dashboard-sidebar-closed"
            }`}
          >
            <div className="admin-dashboard-sidebar-panel">
              <div className="admin-dashboard-sidebar-title">
                Navegação
              </div>

              {menuOptions.map((option) => (
                <Link
                  key={option.path}
                  to={option.path}
                  className="admin-dashboard-sidebar-link"
                >
                  {option.title}
                </Link>
              ))}
            </div>
          </aside>

          <main
            className={`admin-dashboard-main ${
              isSidebarOpen
                ? "admin-dashboard-main-with-sidebar"
                : "admin-dashboard-main-full"
            }`}
          >
            <div className="admin-dashboard-main-header">
              <h1 className="admin-dashboard-title">Painel Administrativo</h1>
            </div>

            <section className="admin-dashboard-summary-grid">
              {summaryCards.map((card) => (
                <div key={card.label} className="admin-dashboard-summary-card">
                  <span className="admin-dashboard-summary-number">
                    {card.number}
                  </span>
                  <span className="admin-dashboard-summary-label">
                    {card.label}
                  </span>
                </div>
              ))}
            </section>

            <section className="admin-dashboard-info-panel">
              <h2 className="admin-dashboard-info-title">
                Área inicial do administrador
              </h2>
              <p className="admin-dashboard-info-text">
                Esta tela funciona como ponto central de acesso às áreas administrativas do sistema.
                A partir do menu lateral, será possível inserir clientes, gerenciar espaços,
                consultar relatórios, acompanhar pagamentos e realizar novas reservas.
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}