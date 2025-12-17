import React, { useState } from 'react';
import '../Dashboard.css'; // Confirma se o caminho está correto na tua estrutura
import './RegistoNC.css';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import Header from '../../components/Header/Header.jsx';

const RegistoNC = ({ onVoltar, onGuardar, userRole, userSector, onLogout }) => {
  const [risco, setRisco] = useState('Baixo');
  const [descricao, setDescricao] = useState('');

  // LÓGICA INTELIGENTE:
  // Se for Chefe, a origem começa logo definida como o seu setor (userSector).
  // Se for Diretor, começa no primeiro da lista ('Produção').
  const [origem, setOrigem] = useState(userRole === 'Chefe' ? userSector : 'Produção');

  // LISTA DE SETORES
  const setoresDisponiveis = [
    "Produção",
    "Logística",
    "Segurança",
    "Qualidade",
    "Manutenção",
    "Comercial / Vendas",
    "Recursos Humanos",
    "Financeiro",
    "Armazém",
    "TI / Informática",
    "Direção Geral"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const novaNC = {
      descricao,
      setor: origem,
      risco,
      status: "Aberta",
      registado_por: userRole || "Sistema"
    };

    onGuardar(novaNC);
  };

  return (
    <div className="dashboard-container">
      <Sidebar ativo="nova-nc" aoNavegar={onVoltar} userRole={userRole} />

      <main className="main-content">

        <Header
          titulo="Registo de Nova Não Conformidade"
          userRole={userRole}
          onLogout={onLogout}
        />

        <section className="nc-form-card">
          <h3>✍️ Nova Ocorrência</h3>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Descrição Detalhada do Problema *</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o que aconteceu, onde e quais as evidências..."
                rows="4"
                required
              />
            </div>

            <div className="form-row-split">

              {/* CAMPO DE ORIGEM (COM BLOQUEIO PARA CHEFE) */}
              <div className="form-group">
                <label>Origem (Setor/Processo) *</label>
                <select
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  required

                  // 1. BLOQUEAR SE FOR CHEFE
                  disabled={userRole === 'Chefe'}

                  // 2. ESTILO VISUAL DE "BLOQUEADO"
                  style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                    backgroundColor: userRole === 'Chefe' ? '#e9ecef' : 'white', // Fundo cinzento
                    cursor: userRole === 'Chefe' ? 'not-allowed' : 'pointer',   // Cursor de proibido
                    color: userRole === 'Chefe' ? '#7f8c8d' : '#2c3e50'          // Texto mais claro
                  }}
                >
                  {setoresDisponiveis.map((setor) => (
                    <option key={setor} value={setor}>
                      {setor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Classificação de Risco *</label>
                <select
                  value={risco}
                  onChange={(e) => setRisco(e.target.value)}
                  className={`select-risco ${risco.toLowerCase()}`}
                >
                  <option value="Baixo">Baixo</option>
                  <option value="Médio">Médio</option>
                  <option value="Alto">Alto</option>
                </select>
                <span className="help-text">Impacto potencial na qualidade.</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#7f8c8d' }}>
              👤 Registado por: <strong>{userRole}</strong>
              {userRole === 'Chefe' && <span> (Setor: {userSector})</span>}
            </div>

            <div className="nc-form-actions">
              <button type="button" onClick={() => onVoltar('dashboard')} className="btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="btn-submit">
                Registar NC
              </button>
            </div>

          </form>
        </section>
      </main>
    </div>
  );
};

export default RegistoNC;