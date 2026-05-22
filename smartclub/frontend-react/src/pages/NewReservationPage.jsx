import React, { useState, useEffect } from "react";
import { Link } from "react-router";

export default function NewReservationPage() {
  const [spaceList, setSpaceList] = useState([]);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [spacesError, setSpacesError] = useState(null);

  const [clientTypeValue, setClientTypeValue] = useState("socio");
  const [clientIdValue, setClientIdValue] = useState("");
  const [spaceValue, setSpaceValue] = useState("");
  const [reservationDateValue, setReservationDateValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Busca espaços reais ao montar a página
  useEffect(() => {
    async function fetchSpaces() {
      try {
        const response = await fetch("http://localhost:3001/espacos");

        if (!response.ok) {
          throw new Error("Falha ao carregar espaços.");
        }

        const data = await response.json();
        setSpaceList(data.espacos);

        if (data.espacos.length > 0) {
          setSpaceValue(String(data.espacos[0].id_espaco));
        }
      } catch (error) {
        console.error(error);
        setSpacesError("Não foi possível carregar os espaços.");
      } finally {
        setSpacesLoading(false);
      }
    }

    fetchSpaces();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3001/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoCliente: clientTypeValue,
          idCliente: Number(clientIdValue),
          idEspaco: Number(spaceValue),
          dataUso: reservationDateValue,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        alert(responseData.message || "Falha ao criar reserva.");
        return;
      }

      alert("Reserva criada com sucesso!");
      handleFormReset();
    } catch (error) {
      console.error(error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFormReset() {
    setClientTypeValue("socio");
    setClientIdValue("");
    setReservationDateValue("");
    if (spaceList.length > 0) {
      setSpaceValue(String(spaceList[0].id_espaco));
    }
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
            <h1 className="admin-dashboard-title">Nova reserva</h1>
            <p className="admin-dashboard-subtitle">
              Cadastre uma nova reserva para um usuário.
            </p>
          </div>

          <section className="admin-form-panel">
            <form className="admin-form" onSubmit={handleFormSubmit}>
              <div className="admin-form-grid">

                {/* Tipo de cliente */}
                <div className="admin-form-group">
                  <label htmlFor="clientTypeValue">Tipo de cliente</label>
                  <select
                    id="clientTypeValue"
                    className="admin-form-input"
                    value={clientTypeValue}
                    onChange={(event) => setClientTypeValue(event.target.value)}
                    required
                  >
                    <option value="socio">Sócio</option>
                    <option value="nao_socio">Não sócio</option>
                  </select>
                </div>

                {/* ID do cliente */}
                <div className="admin-form-group">
                  <label htmlFor="clientIdValue">
                    {clientTypeValue === "socio"
                      ? "ID do sócio"
                      : "ID do não sócio"}
                  </label>
                  <input
                    id="clientIdValue"
                    type="number"
                    className="admin-form-input"
                    placeholder={
                      clientTypeValue === "socio"
                        ? "Digite o id_socio"
                        : "Digite o id_nao_socio"
                    }
                    value={clientIdValue}
                    onChange={(event) => setClientIdValue(event.target.value)}
                    min="1"
                    required
                  />
                </div>

                {/* Espaço */}
                <div className="admin-form-group">
                  <label htmlFor="spaceValue">Espaço</label>
                  {spacesLoading && (
                    <p className="admin-form-input">Carregando espaços...</p>
                  )}
                  {spacesError && (
                    <p className="admin-form-input">{spacesError}</p>
                  )}
                  {!spacesLoading && !spacesError && (
                    <select
                      id="spaceValue"
                      className="admin-form-input"
                      value={spaceValue}
                      onChange={(event) => setSpaceValue(event.target.value)}
                      required
                    >
                      {spaceList.map((spaceItem) => (
                        <option
                          key={spaceItem.id_espaco}
                          value={spaceItem.id_espaco}
                        >
                          {spaceItem.nome}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Data da reserva */}
                <div className="admin-form-group">
                  <label htmlFor="reservationDateValue">Data da reserva</label>
                  <input
                    id="reservationDateValue"
                    type="date"
                    className="admin-form-input"
                    value={reservationDateValue}
                    onChange={(event) =>
                      setReservationDateValue(event.target.value)
                    }
                    required
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
                  disabled={isSubmitting || spacesLoading}
                >
                  {isSubmitting ? "Salvando..." : "Salvar reserva"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
