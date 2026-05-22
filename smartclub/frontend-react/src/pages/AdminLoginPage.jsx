import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function AdminLoginPage() {
  const [adminIdentifierValue, setAdminIdentifierValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  async function handleFormSubmit(event) {
    event.preventDefault();

    try {
      const serverResponse = await fetch("http://localhost:3001/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminIdentifier: adminIdentifierValue,
          password: passwordValue,
        }),
      });

      const serverResponseData = await serverResponse.json();

      if (!serverResponse.ok) {
        alert(serverResponseData.message || "Falha no login administrativo.");
        return;
      }

      alert("Administrador conectado com sucesso!");
      navigate("/area-admin");
    } catch (error) {
      console.error("Request error:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  }

return (
  <div className="admin-page">
    <div className="admin-card">
      <h1 className="admin-title">Acesso Administrativo</h1>
      <p className="admin-subtitle">
        Digite suas credenciais para continuar.
      </p>

      <form className="login-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="adminIdentifierValue">Usuário ou E-mail</label>
          <input
            id="adminIdentifierValue"
            className="text-input"
            type="text"
            placeholder="Digite seu usuário ou e-mail"
            value={adminIdentifierValue}
            onChange={(event) => setAdminIdentifierValue(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordValue">Senha</label>

          <div className="password-row">
            <input
              id="passwordValue"
              className="text-input password-input"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Digite sua senha"
              value={passwordValue}
              onChange={(event) => setPasswordValue(event.target.value)}
              required
            />

            <button
              type="button"
              className="admin-toggle-button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="submit-row">
          <button type="submit" className="admin-submit-button">
            Entrar
          </button>
        </div>
      </form>
    </div>
  </div>
)};