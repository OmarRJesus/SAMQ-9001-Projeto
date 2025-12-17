import React from 'react';
import './Sidebar.css';

const Sidebar = ({ ativo, aoNavegar, userRole }) => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <span className="logo-icon">💎</span>
        <span className="logo-text">SAMQ-9001</span>
      </div>

      <nav>
        <button
          onClick={() => aoNavegar('dashboard')}
          className={ativo === 'dashboard' ? 'active' : ''}
        >
          📊 Dashboard
        </button>
        <button 
          onClick={() => aoNavegar('nova-nc')} 
          className={ativo === 'nova-nc' ? 'active' : ''}
        >
          ⚠️ Nova NC
        </button>

        <button
          onClick={() => aoNavegar('documentos')}
          className={ativo === 'documentos' ? 'active' : ''}
        >
          📄 Documentos
        </button>

        <button
          onClick={() => aoNavegar('kpis')}
          className={ativo === 'kpis' ? 'active' : ''}
        >
          📈 KPIs
        </button>

        {/* APENAS O DIRETOR VÊ ESTE BOTÃO */}
        {userRole === 'Diretor' && (
          <button
            onClick={() => aoNavegar('admin-users')}
            className={ativo === 'admin-users' ? 'active' : ''}
            style={{ color: '#f1c40f' }}
          >
            👥 Gestão Utilizadores
          </button>
        )}
      </nav>

      {/* Rodapé da Sidebar */}
      <div style={{ marginTop: 'auto', padding: '20px', fontSize: '0.8rem', color: '#bdc3c7' }}>
        <p>Utilizador:</p>
        <strong style={{ color: 'white' }}>{userRole || 'Visitante'}</strong>
      </div>
    </aside>
  );
};

export default Sidebar;