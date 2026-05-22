import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function MemberLoginPage() {
  const [memberIdentifierValue, setMemberIdentifierValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  async function handleFormSubmit(event) {
    event.preventDefault();

    try {
      const serverResponse = await fetch("http://localhost:3001/member-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberIdentifier: memberIdentifierValue,
          password: passwordValue,
        }),
      });

      const serverResponseData = await serverResponse.json();

      if (!serverResponse.ok) {
        alert(serverResponseData.message || "Falha na conexão.");
        return;
      }

      alert("Conectado com sucesso!");
      navigate("/area-socio");
    } catch (error) {
      console.error("Request error:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Login do Sócio</h1>
        <p className="login-subtitle">Digite sua carteirinha para continuar.</p>

        <form className="login-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="memberIdentifierValue">Número da Carteirinha</label>
            <input
              id="memberIdentifierValue"
              className="text-input"
              type="text"
              placeholder="Digite o número da carteirinha"
              value={memberIdentifierValue}
              onChange={(event) => setMemberIdentifierValue(event.target.value)}
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
                className="toggle-button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="submit-row">
            <button type="submit" className="submit-button">
              Entrar
            </button>
          </div>
        </form>

        <div className="auth-links">
          <p>
            Já tem conta de não-sócio? <Link to="/login">Clique aqui</Link>
          </p>
          <p>
            Ainda não é sócio? <Link to="/cadastro">Clique aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}