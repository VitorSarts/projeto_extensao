import React, { useState } from "react";
import { Link } from "react-router";

export default function InsertUserPage() {
  const [fullNameValue, setFullNameValue] = useState("");
  const [userTypeValue, setUserTypeValue] = useState("nao_socio");
  const [emailAddressValue, setEmailAddressValue] = useState("");
  const [phoneNumberValue, setPhoneNumberValue] = useState("");
  const [documentNumberValue, setDocumentNumberValue] = useState("");
  const [membershipNumberValue, setMembershipNumberValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [birthDateValue, setBirthDateValue] = useState("");
  const [notesValue, setNotesValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3001/admin/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType: userTypeValue,
          fullName: fullNameValue,
          emailAddress: emailAddressValue,
          password: passwordValue || undefined,
          cpf: documentNumberValue || undefined,
          phoneNumber: phoneNumberValue || undefined,
          membershipNumber: membershipNumberValue || undefined,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(responseData.message || "Falha ao cadastrar usuário.");
        return;
      }

      alert(responseData.message);
      handleFormReset();
    } catch (error) {
      console.error(error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFormReset() {
    setFullNameValue("");
    setUserTypeValue("nao_socio");
    setEmailAddressValue("");
    setPhoneNumberValue("");
    setDocumentNumberValue("");
    setMembershipNumberValue("");
    setPasswordValue("");
    setIsPasswordVisible(false);
    setBirthDateValue("");
    setNotesValue("");
  }

  const isNaoSocio = userTypeValue === "nao_socio";

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

            <Link
              to="/area-admin"
              className="admin-dashboard-exit-button"
            >
              Voltar
            </Link>
          </div>
        </header>

        <div className="admin-dashboard-main admin-dashboard-main-full">
          <div className="admin-dashboard-main-header">
            <h1 className="admin-dashboard-title">Inserir Usuário</h1>
            <p className="admin-dashboard-subtitle">
              Cadastre um novo usuário no sistema administrativo.
            </p>
          </div>

          <section className="admin-form-panel">
            <form className="admin-form" onSubmit={handleFormSubmit}>
              <div className="admin-form-grid">

                {/* Nome completo */}
                <div className="admin-form-group admin-form-group-full">
                  <label htmlFor="fullNameValue">Nome completo</label>
                  <input
                    id="fullNameValue"
                    type="text"
                    className="admin-form-input"
                    placeholder="Digite o nome completo"
                    value={fullNameValue}
                    onChange={(event) => setFullNameValue(event.target.value)}
                    required
                  />
                </div>

                {/* Tipo de usuário */}
                <div className="admin-form-group">
                  <label htmlFor="userTypeValue">Tipo de usuário</label>
                  <select
                    id="userTypeValue"
                    className="admin-form-input"
                    value={userTypeValue}
                    onChange={(event) => setUserTypeValue(event.target.value)}
                    required
                  >
                    <option value="nao_socio">Não sócio</option>
                    <option value="socio">Sócio</option>
                  </select>
                </div>

                {/* Data de nascimento */}
                <div className="admin-form-group">
                  <label htmlFor="birthDateValue">Data de nascimento</label>
                  <input
                    id="birthDateValue"
                    type="date"
                    className="admin-form-input"
                    value={birthDateValue}
                    onChange={(event) => setBirthDateValue(event.target.value)}
                  />
                </div>

                {/* E-mail */}
                <div className="admin-form-group">
                  <label htmlFor="emailAddressValue">E-mail</label>
                  <input
                    id="emailAddressValue"
                    type="email"
                    className="admin-form-input"
                    placeholder="Digite o e-mail"
                    value={emailAddressValue}
                    onChange={(event) => setEmailAddressValue(event.target.value)}
                    required
                  />
                </div>

                {/* Número da carteirinha — apenas para sócio */}
                {!isNaoSocio && (
                  <div className="admin-form-group">
                    <label htmlFor="membershipNumberValue">Número da carteirinha</label>
                    <input
                      id="membershipNumberValue"
                      type="text"
                      className="admin-form-input"
                      placeholder="Ex: S1IV"
                      value={membershipNumberValue}
                      onChange={(event) => setMembershipNumberValue(event.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Telefone — apenas para não-sócio */}
                {isNaoSocio && (
                  <div className="admin-form-group">
                    <label htmlFor="phoneNumberValue">Telefone</label>
                    <input
                      id="phoneNumberValue"
                      type="text"
                      className="admin-form-input"
                      placeholder="(00) 00000-0000"
                      value={phoneNumberValue}
                      onChange={(event) => setPhoneNumberValue(event.target.value)}
                      required
                    />
                  </div>
                )}

                {/* CPF — apenas para não-sócio */}
                {isNaoSocio && (
                  <div className="admin-form-group admin-form-group-full">
                    <label htmlFor="documentNumberValue">CPF</label>
                    <input
                      id="documentNumberValue"
                      type="text"
                      className="admin-form-input"
                      placeholder="000.000.000-00"
                      value={documentNumberValue}
                      onChange={(event) => setDocumentNumberValue(event.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Senha */}
                <div className="admin-form-group admin-form-group-full">
                  <label htmlFor="passwordValue">
                    Senha <span style={{ fontWeight: "normal", fontSize: "0.85em" }}>(opcional)</span>
                  </label>
                  <div className="password-row">
                    <input
                      id="passwordValue"
                      type={isPasswordVisible ? "text" : "password"}
                      className="admin-form-input password-input"
                      placeholder="Deixe em branco para definir depois"
                      value={passwordValue}
                      onChange={(event) => setPasswordValue(event.target.value)}
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

                {/* Observações */}
                <div className="admin-form-group admin-form-group-full">
                  <label htmlFor="notesValue">Observações</label>
                  <textarea
                    id="notesValue"
                    className="admin-form-textarea"
                    placeholder="Digite observações adicionais"
                    value={notesValue}
                    onChange={(event) => setNotesValue(event.target.value)}
                    rows={5}
                  />
                </div>

              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-form-secondary-button"
                  onClick={handleFormReset}
                  disabled={isSubmitting}
                >
                  Limpar
                </button>

                <button
                  type="submit"
                  className="admin-form-primary-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar usuário"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
