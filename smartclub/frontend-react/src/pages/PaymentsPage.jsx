import React from "react";
import { Link } from "react-router";

export default function PaymentsPage() {
  const paymentList = [
    {
      id: 1,
      userName: "João Silva",
      userType: "Sócio",
      spaceName: "Quiosque 1",
      reservationDate: "2026-06-15",
      amountValue: "R$ 0,00",
      paymentStatus: "Isento",
    },
    {
      id: 2,
      userName: "Maria Oliveira",
      userType: "Não sócio",
      spaceName: "Mini Salão",
      reservationDate: "2026-06-18",
      amountValue: "R$ 400,00",
      paymentStatus: "Pendente",
    },
    {
      id: 3,
      userName: "Carlos Souza",
      userType: "Sócio",
      spaceName: "Casarão",
      reservationDate: "2026-06-20",
      amountValue: "R$ 600,00",
      paymentStatus: "Pago",
    },
    {
      id: 4,
      userName: "Fernanda Lima",
      userType: "Não sócio",
      spaceName: "Salão Social",
      reservationDate: "2026-06-22",
      amountValue: "R$ 1750,00",
      paymentStatus: "Pendente",
    },
  ];

  function handleViewPayment(paymentIdValue) {
    alert(`Visualizar pagamento da reserva ${paymentIdValue}`);
  }

  function handleMarkAsPaid(paymentIdValue) {
    alert(`Marcar pagamento da reserva ${paymentIdValue} como pago`);
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <header className="admin-dashboard-header">
          <div className="admin-dashboard-header-left">
            <div className="admin-dashboard-brand">
              <img
                src="/logo-smartclub.png"
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
            <h1 className="admin-dashboard-title">Pagamentos</h1>
            <p className="admin-dashboard-subtitle">
              Visualize os pagamentos relacionados às reservas do sistema.
            </p>
          </div>

          <section className="payments-page-panel">
            <div className="payments-page-summary-row">
              <div className="payments-page-summary-card">
                <span className="payments-page-summary-number">2</span>
                <span className="payments-page-summary-label">
                  Pagamentos pendentes
                </span>
              </div>

              <div className="payments-page-summary-card">
                <span className="payments-page-summary-number">1</span>
                <span className="payments-page-summary-label">
                  Pagamentos concluídos
                </span>
              </div>

              <div className="payments-page-summary-card">
                <span className="payments-page-summary-number">1</span>
                <span className="payments-page-summary-label">
                  Reservas isentas
                </span>
              </div>
            </div>

            <div className="payments-page-table-wrapper">
              <table className="payments-page-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Tipo</th>
                    <th>Espaço</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {paymentList.map((paymentItem) => (
                    <tr key={paymentItem.id}>
                      <td>{paymentItem.userName}</td>
                      <td>{paymentItem.userType}</td>
                      <td>{paymentItem.spaceName}</td>
                      <td>{paymentItem.reservationDate}</td>
                      <td>{paymentItem.amountValue}</td>
                      <td>
                        <span
                          className={`payments-page-status-badge ${
                            paymentItem.paymentStatus === "Pago"
                              ? "payments-page-status-paid"
                              : paymentItem.paymentStatus === "Pendente"
                              ? "payments-page-status-pending"
                              : "payments-page-status-exempt"
                          }`}
                        >
                          {paymentItem.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="payments-page-action-group">
                          <button
                            type="button"
                            className="payments-page-action-button"
                            onClick={() => handleViewPayment(paymentItem.id)}
                          >
                            Ver
                          </button>

                          {paymentItem.paymentStatus === "Pendente" && (
                            <button
                              type="button"
                              className="payments-page-action-button payments-page-action-button-primary"
                              onClick={() => handleMarkAsPaid(paymentItem.id)}
                            >
                              Marcar como pago
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}