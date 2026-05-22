import React, { useState } from "react";
import { Link } from "react-router";

export default function LoginPage() {
  const [emailAddressValue, setEmailAddressValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: emailAddressValue,
          password: passwordValue,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(responseData.message || "Falha na conexão.");
        return;
      }

      console.log("Connected user:", responseData);
      alert("Conectado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Acesse sua conta para continuar.</p>

        <form className="login-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="emailAddressValue">E-mail</label>
            <input
              id="emailAddressValue"
              className="text-input"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={emailAddressValue}
              onChange={(event) => setEmailAddressValue(event.target.value)}
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
            Já tem conta de sócio? <Link to="/login-socio">Clique aqui</Link>
          </p>
          <p>
            Ainda não é não-sócio? <Link to="/cadastro">Clique aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}