import React, { useState } from "react";
import { Link } from "react-router";

export default function RegisterPage() {
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [birthDateValue, setBirthDateValue] = useState("");
  const [cpfValue, setCpfValue] = useState("");
  const [phoneNumberValue, setPhoneNumberValue] = useState("");
  const [emailAddressValue, setEmailAddressValue] = useState("");
  const [confirmEmailAddressValue, setConfirmEmailAddressValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (emailAddressValue !== confirmEmailAddressValue) {
      alert("Os e-mails não coincidem.");
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstNameValue,
          lastName: lastNameValue,
          birthDate: birthDateValue,
          cpf: cpfValue,
          phoneNumber: phoneNumberValue,
          emailAddress: emailAddressValue,
          password: passwordValue,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(responseData.message || "Falha no cadastro.");
        return;
      }

      console.log("Registered successfully:", responseData);
      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Cadastro</h1>
        <p className="login-subtitle">
          Preencha seus dados para continuar.
        </p>

        <form className="login-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="firstNameValue">Nome</label>
            <input
              id="firstNameValue"
              className="text-input"
              type="text"
              placeholder="Digite seu nome"
              value={firstNameValue}
              onChange={(event) => setFirstNameValue(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastNameValue">Sobrenome</label>
            <input
              id="lastNameValue"
              className="text-input"
              type="text"
              placeholder="Digite seu sobrenome"
              value={lastNameValue}
              onChange={(event) => setLastNameValue(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="birthDateValue">Data de Nascimento</label>
            <input
              id="birthDateValue"
              className="text-input"
              type="date"
              value={birthDateValue}
              onChange={(event) => setBirthDateValue(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpfValue">CPF</label>
            <input
              id="cpfValue"
              className="text-input"
              type="text"
              placeholder="000.000.000-00"
              value={cpfValue}
              onChange={(event) => setCpfValue(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumberValue">Telefone</label>
            <input
              id="phoneNumberValue"
              className="text-input"
              type="text"
              placeholder="(00) 00000-0000"
              value={phoneNumberValue}
              onChange={(event) => setPhoneNumberValue(event.target.value)}
              required
            />
          </div>

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
            <label htmlFor="confirmEmailAddressValue">Confirmar E-mail</label>
            <input
              id="confirmEmailAddressValue"
              className="text-input"
              type="email"
              placeholder="Digite seu e-mail novamente"
              value={confirmEmailAddressValue}
              onChange={(event) =>
                setConfirmEmailAddressValue(event.target.value)
              }
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

          <div className="form-group">
            <label htmlFor="confirmPasswordValue">Confirmar Senha</label>

            <div className="password-row">
              <input
                id="confirmPasswordValue"
                className="text-input password-input"
                type={isConfirmPasswordVisible ? "text" : "password"}
                placeholder="Digite sua senha novamente"
                value={confirmPasswordValue}
                onChange={(event) =>
                  setConfirmPasswordValue(event.target.value)
                }
                required
              />

              <button
                type="button"
                className="toggle-button"
                onClick={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              >
                {isConfirmPasswordVisible ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="submit-row">
            <button type="submit" className="submit-button">
              Cadastrar
            </button>
          </div>
        </form>

        <div className="auth-links">
          <p>
            Já tem conta de não-sócio? <Link to="/login">Clique aqui</Link>
          </p>
          <p>
           Já tem conta de sócio? <Link to="/login-socio">Clique aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}