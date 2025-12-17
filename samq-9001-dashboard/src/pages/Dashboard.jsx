import React from 'react';
import './Dashboard.css';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Header from '../components/Header/Header.jsx';

const Dashboard = ({ ncs, medicoes, aoNavegar, userRole, userSector, onLogout }) => {

  // 1. FILTRAGEM
  const ncsFiltradas = ncs ? ncs.filter(nc => {
      // REGRA: Diretor e Auditor têm acesso total (Visão Global)
      if (userRole === 'Diretor' || userRole === 'Auditor') {
          return true; 
      }
      // Chefes só veem o seu próprio setor
      return nc.setor === userSector;
  }) : [];

  // 2. CORREÇÃO DO ERRO DO ECRÃ BRANCO AQUI:
  // Usamos [...medicoes] para criar uma cópia antes de ordenar.
  // Se tentarmos ordenar 'medicoes' diretamente, o React bloqueia.
  const ultimaEficacia = medicoes && medicoes.length > 0
    ? [...medicoes] // <--- CRIA CÓPIA SEGURA
        .sort((a, b) => b.id - a.id) // Ordena do mais recente para o antigo
        .find(m => m.nome.toLowerCase().includes('eficácia')) 
    : null;

  // Se não encontrar "Eficácia", mostra o último valor inserido de qualquer coisa
  const kpiDisplay = ultimaEficacia || (medicoes && medicoes.length > 0 ? medicoes[medicoes.length - 1] : null);

  const valorEficacia = kpiDisplay ? `${kpiDisplay.valor}%` : "S/ Dados";

  const kpiData = {
    totalNC: ncsFiltradas.length,
    acoesAbertas: ncsFiltradas.filter(n => n.status === 'Aberta').length,
    auditoriasProx: 2,
    eficacia: valorEficacia
  };

  return (
    <div className="dashboard-container">
      <Sidebar ativo="dashboard" aoNavegar={aoNavegar} userRole={userRole} />

      <main className="main-content">
        
        <Header
          titulo={
            userRole === 'Diretor' || userRole === 'Auditor' 
            ? "Painel Global de Auditoria" 
            : `Painel - ${userSector}`
          }
          userRole={userRole}
          onLogout={onLogout}
        />

        <section
          className="politica-qualidade"
          onClick={() => window.open('/NP EN ISO 9001_2015.pdf', '_blank')}
          title="Clique para ler o documento oficial"
          style={{
            background: '#dff9fb',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '5px solid #22a6b3',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📜 Política da Qualidade</h3>
          <p style={{ fontStyle: 'italic', color: '#535c68', marginBottom: '5px' }}>
            "Compromisso com a satisfação do cliente e melhoria contínua segundo a ISO 9001."
          </p>
          <small style={{ color: '#2980b9', fontWeight: 'bold', textDecoration: 'underline' }}>
            (Clique aqui para consultar o PDF da Norma)
          </small>
        </section>

        <section className="kpi-grid">
          <div className="kpi-card">
            <h3>Total NCs</h3>
            <p>{kpiData.totalNC}</p>
          </div>
          <div className="kpi-card">
            <h3>NCs em Aberto</h3>
            <p style={{ color: '#d35400' }}>{kpiData.acoesAbertas}</p>
          </div>
          <div className="kpi-card">
            <h3>Próximas Auditorias</h3>
            <p>{kpiData.auditoriasProx}</p>
          </div>
          <div className="kpi-card">
            <h3>Eficácia</h3>
            <p style={{ color: '#27ae60' }}>{kpiData.eficacia}</p>
          </div>
        </section>

        <section className="recent-activity">
          <h3>Registo de Não Conformidades</h3>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Descrição</th><th>Setor</th><th>Risco</th><th>Estado</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {(!ncsFiltradas || ncsFiltradas.length === 0) ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    {ncs ? "Não existem registos neste setor." : "A carregar dados..."}
                  </td>
                </tr>
              ) : (
                ncsFiltradas.map((nc) => (
                  <tr key={nc.id}>
                    <td>#{nc.id}</td>
                    <td>{nc.descricao}</td>
                    <td>{nc.setor}</td>
                    <td><span style={{fontWeight:'bold', color: nc.risco === 'Alto' ? '#c0392b' : nc.risco === 'Médio' ? '#f39c12' : 'green'}}>{nc.risco}</span></td>
                    <td><span className={`status ${nc.status ? nc.status.toLowerCase().replace(' ', '') : ''}`}>{nc.status}</span></td>
                    <td>
                      <button
                        onClick={() => aoNavegar('detalhes-nc', nc)}
                        style={{padding: '6px 12px', background: '#34495e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                      >
                         {userRole === 'Auditor' ? '👁️ Auditar' : '✏️ Analisar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;