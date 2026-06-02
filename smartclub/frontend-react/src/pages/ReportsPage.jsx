import React from "react";
import { Link } from "react-router";

export default function ReportsPage() {
  const reportCardList = [
    {
      title: "Relatório de reservas",
      description:
        "Visualize a listagem de reservas realizadas, com informações de usuário, espaço, data e status.",
      buttonText: "Abrir relatório",
    },
    {
      title: "Relatório de pagamentos",
      description:
        "Acompanhe os pagamentos vinculados às reservas, incluindo valores, status e pendências.",
      buttonText: "Abrir relatório",
    },
    {
      title: "Relatório de espaços",
      description:
        "Consulte informações gerais sobre os espaços cadastrados, disponibilidade e utilização.",
      buttonText: "Abrir relatório",
    },
    {
      title: "Relatório gerencial",
      description:
        "Obtenha uma visão resumida do sistema com os principais indicadores administrativos.",
      buttonText: "Abrir relatório",
    },
  ];

  function handleOpenReport(reportTitleValue) {
    alert(`Abrir ${reportTitleValue}`);
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-left">
            <div className="admin-dashboard-brand">
              <img
                src="/logo-smartclub.jpeg"
                alt="Logo SmartClub"
                className="admin-dashboard-logo"
              />
              <span className="admin-dashboard-brand-name">SmartClub</span>
            </div>
          </div>

          <div className="admin-dashboard-header-right">
            <span className="admin-dashboard-admin-label">ADM</span>

            <Link to="/area-admin" className="admin-dashboard-exit-button">
              Voltar
            </Link>
          </div>
        </header>

        <div className="admin-dashboard-main admin-dashboard-main-full">
          <div className="admin-dashboard-main-header">
            <h1 className="admin-dashboard-title">Relatórios</h1>
            <p className="admin-dashboard-subtitle">
              Acesse os relatórios disponíveis para acompanhamento administrativo
              do sistema.
            </p>
          </div>

          <section className="reports-page-panel">
            <div className="reports-page-summary-row">
              <div className="reports-page-summary-card">
                <span className="reports-page-summary-number">4</span>
                <span className="reports-page-summary-label">
                  Relatórios disponíveis
                </span>
              </div>

              <div className="reports-page-summary-card">
                <span className="reports-page-summary-number">1</span>
                <span className="reports-page-summary-label">
                  Relatório gerencial
                </span>
              </div>

              <div className="reports-page-summary-card">
                <span className="reports-page-summary-number">3</span>
                <span className="reports-page-summary-label">
                  Relatórios operacionais
                </span>
              </div>
            </div>

            <div className="reports-page-grid">
              {reportCardList.map((reportItem) => (
                <div
                  key={reportItem.title}
                  className="reports-page-report-card"
                >
                  <h2 className="reports-page-report-title">
                    {reportItem.title}
                  </h2>

                  <p className="reports-page-report-description">
                    {reportItem.description}
                  </p>

                  <div className="reports-page-report-actions">
                    <button
                      type="button"
                      className="reports-page-action-button"
                      onClick={() => handleOpenReport(reportItem.title)}
                    >
                      {reportItem.buttonText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}