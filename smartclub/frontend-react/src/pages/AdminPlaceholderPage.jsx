import React from "react";
import { Link, useLocation } from "react-router";

export default function AdminPlaceholderPage() {
  const location = useLocation();

  return (
    <div className="admin-board-page">
      <div className="admin-board-container">
        <div className="admin-board-column">
          <div className="admin-board-column-header">
            <h2 className="admin-board-column-title">Página em desenvolvimento</h2>
            <span className="admin-board-column-count">1</span>
          </div>

          <div className="admin-board-cards">
            <div className="admin-board-card admin-board-card-static">
              <span className="admin-board-card-title">
                Esta funcionalidade ainda será construída
              </span>
              <p className="admin-board-placeholder-route">
                Rota atual: {location.pathname}
              </p>
            </div>
          </div>

          <div className="admin-board-actions">
            <Link to="/area-admin" className="admin-board-back-button">
              Voltar ao painel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}