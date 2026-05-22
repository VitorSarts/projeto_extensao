import React, { useState, useEffect } from "react";
import { Link } from "react-router";

// Mapeamento local: nome do espaço (banco) → imagem em /public/spaces/
// Adicione entradas aqui conforme novas imagens forem disponibilizadas.
const IMAGE_MAP = {
  "Quiosque 1":        "/spaces/quiosque1.png",
  "Mini salão":        "/spaces/minisalao.jpeg",
  "Casarão":           "/spaces/casarao.jpeg",
  "Salão Social Dia":  "/spaces/salaosocial.jpeg",
  "Salão Social Noite":"/spaces/salaosocial.jpeg",
};

const DEFAULT_IMAGE = "/spaces/quiosque1.png";

function getImagePath(nome) {
  return IMAGE_MAP[nome] ?? DEFAULT_IMAGE;
}

export default function SpaceInformationPage() {
  const [spaceList, setSpaceList] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

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
          setSelectedSpaceId(data.espacos[0].id_espaco);
        }
      } catch (error) {
        console.error(error);
        setLoadError("Não foi possível carregar os espaços. Verifique a conexão com o servidor.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpaces();
  }, []);

  const selectedSpace = spaceList.find(
    (spaceItem) => spaceItem.id_espaco === selectedSpaceId
  );

  function handleEditImage() {
    alert(`Editar imagem de: ${selectedSpace.nome}`);
  }

  function handleEditDescription() {
    alert(`Editar descrição de: ${selectedSpace.nome}`);
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
            <h1 className="admin-dashboard-title">Informações dos espaços</h1>
            <p className="admin-dashboard-subtitle">
              Visualize e edite as imagens e descrições dos espaços disponíveis.
            </p>
          </div>

          {isLoading && (
            <p className="admin-dashboard-info-text">Carregando espaços...</p>
          )}

          {loadError && (
            <p className="admin-dashboard-info-text">{loadError}</p>
          )}

          {!isLoading && !loadError && spaceList.length === 0 && (
            <p className="admin-dashboard-info-text">Nenhum espaço ativo encontrado.</p>
          )}

          {!isLoading && !loadError && spaceList.length > 0 && selectedSpace && (
            <section className="space-information-panel">
              <div className="space-information-tabs">
                {spaceList.map((spaceItem) => (
                  <button
                    key={spaceItem.id_espaco}
                    type="button"
                    className={`space-information-tab-button ${
                      selectedSpaceId === spaceItem.id_espaco
                        ? "space-information-tab-button-active"
                        : ""
                    }`}
                    onClick={() => setSelectedSpaceId(spaceItem.id_espaco)}
                  >
                    {spaceItem.nome}
                  </button>
                ))}
              </div>

              <div className="space-information-content">
                <h2 className="space-information-space-title">
                  {selectedSpace.nome}
                </h2>

                <div className="space-information-image-wrapper">
                  <button
                    type="button"
                    className="space-information-arrow-button"
                    onClick={() => alert("Depois podemos implementar navegação lateral de imagens.")}
                  >
                    &#8249;
                  </button>

                  <div className="space-information-image-card">
                    <img
                      src={getImagePath(selectedSpace.nome)}
                      alt={selectedSpace.nome}
                      className="space-information-image"
                    />

                    <div className="space-information-image-actions">
                      <button
                        type="button"
                        className="space-information-secondary-button"
                        onClick={handleEditImage}
                      >
                        Editar foto
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="space-information-arrow-button"
                    onClick={() => alert("Depois podemos implementar navegação lateral de imagens.")}
                  >
                    &#8250;
                  </button>
                </div>

                <div className="space-information-description-card">
                  <p className="space-information-description-text">
                    {selectedSpace.descricao ?? "Sem descrição cadastrada."}
                  </p>

                  <div className="space-information-description-actions">
                    <button
                      type="button"
                      className="space-information-secondary-button"
                      onClick={handleEditDescription}
                    >
                      Editar descrição
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}