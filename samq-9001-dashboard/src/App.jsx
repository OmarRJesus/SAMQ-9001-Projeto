import React, { useState, useEffect } from 'react';
// Imports das Páginas
import Dashboard from './pages/Dashboard.jsx'; 
import RegistoNC from './pages/NaoConformidades/RegistoNC.jsx';
import Documentos from './pages/Documentos/Documentos.jsx';
import DetalhesNC from './pages/NaoConformidades/DetalhesNC.jsx';
import GestaoKPI from './pages/KPIs/GestaoKPI.jsx';
import Login from './pages/Login/Login.jsx';
import GestaoUtilizadores from './pages/Admin/GestaoUtilizadores.jsx';

function App() {
  const [userRole, setUserRole] = useState(null); 
  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  const [userSector, setUserSector] = useState(null);
  
  // Dados da Aplicação
  const [listaNCs, setListaNCs] = useState([]);
  const [medicoes, setMedicoes] = useState([]); // KPIs
  const [ncSelecionada, setNcSelecionada] = useState(null);

  // 1. ESCUTAR O BOTÃO DE VOLTAR DO BROWSER
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setPaginaAtual(event.state.pagina);
        setNcSelecionada(event.state.dados || null);
      } else {
        setPaginaAtual('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. CARREGAR DADOS INICIAIS
  useEffect(() => {
    if(userRole) {
        carregarDados();
        window.history.replaceState({ pagina: 'dashboard' }, "", "#dashboard");
    }
  }, [userRole]);

  const carregarDados = () => {
    // Carrega NCs
    fetch('http://localhost:3001/api/ncs').then(r => r.json()).then(setListaNCs);
    // Carrega Medições (KPIs)
    fetch('http://localhost:3001/api/medicoes').then(r => r.json()).then(setMedicoes);
  };

  // 3. LOGIN / LOGOUT
  const handleLogin = (role, sector) => {
    setUserRole(role);
    setUserSector(sector);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserSector(null);
    setPaginaAtual('dashboard');
    window.history.pushState(null, "", "/");
  };

  // 4. NAVEGAÇÃO
  const navegarPara = (pagina, dados = null) => {
    setNcSelecionada(dados);
    setPaginaAtual(pagina);
    
    window.history.pushState({ pagina, dados }, "", `#${pagina}`);

    // Se voltarmos ao dashboard, convém atualizar os dados para ver refletidas as alterações
    if(pagina === 'dashboard') carregarDados(); 
  };

  // --- FUNÇÕES DE API (CRUD) ---

  // A. Não Conformidades
  const adicionarNC = (d) => {
      fetch('http://localhost:3001/api/ncs', {
          method:'POST', 
          headers:{'Content-Type':'application/json'}, 
          body:JSON.stringify(d)
      })
      .then(res => res.json())
      .then(() => {
          alert("✅ NC Criada com Sucesso!"); 
          carregarDados(); 
          setPaginaAtual('dashboard');
          window.history.pushState({ pagina: 'dashboard' }, "", "#dashboard");
      })
      .catch(err => alert("Erro ao criar: " + err));
  };

  const atualizarNC = (id, d) => {
      fetch(`http://localhost:3001/api/ncs/${id}`, {
          method:'PUT', 
          headers:{'Content-Type':'application/json'}, 
          body:JSON.stringify(d)
      })
      .then(res => res.json())
      .then(() => {
          alert("✅ Alterações guardadas!"); 
          carregarDados(); 
      })
      .catch(err => alert("Erro ao atualizar"));
  };

  // B. Medições (KPIs) - NOVA FUNÇÃO
  const adicionarMedicao = (novaKPI) => {
      fetch('http://localhost:3001/api/medicoes', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(novaKPI)
      })
      .then(res => res.json())
      .then(() => {
          alert("✅ KPI Adicionado com Sucesso!");
          carregarDados(); // Atualiza o estado global (incluindo Dashboard)
      })
      .catch(err => alert("Erro ao criar KPI"));
  };


  // --- RENDERIZAÇÃO ---

  // Se não estiver logado, mostra Login
  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* 1. DASHBOARD */}
      {paginaAtual === 'dashboard' && (
        <div className="app-wrapper">
          <Dashboard 
            ncs={listaNCs} 
            medicoes={medicoes} // Passa as medições atualizadas
            aoNavegar={navegarPara} 
            userRole={userRole}
            userSector={userSector} 
            onLogout={handleLogout} 
          />
          
          <button 
            style={{position: 'fixed', bottom: 20, right: 20, padding: 15, background: '#e74c3c', color: 'white', borderRadius: '50%', border: 'none', fontSize: '20px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.3)'}} 
            onClick={() => navegarPara('nova-nc')}
            title="Registar Nova NC"
          >
            +
          </button>
        </div>
      )}

      {/* 2. PÁGINA: NOVA NC */}
      {paginaAtual === 'nova-nc' && (
        <RegistoNC 
            onVoltar={navegarPara} 
            onGuardar={adicionarNC} 
            userRole={userRole}
            userSector={userSector} 
            onLogout={handleLogout} 
        />
      )}

      {/* 3. PÁGINA: DETALHES NC */}
      {paginaAtual === 'detalhes-nc' && ncSelecionada && (
        <DetalhesNC 
            nc={ncSelecionada} 
            onVoltar={navegarPara} 
            onAtualizar={atualizarNC} 
            userRole={userRole} 
            userSector={userSector}
            onLogout={handleLogout} 
        />
      )}

      {/* 4. DOCUMENTOS */}
      {paginaAtual === 'documentos' && (
        <Documentos 
            onVoltar={navegarPara} 
            userRole={userRole}
            userSector={userSector} 
            onLogout={handleLogout} 
        />
      )}
      
      {/* 5. KPIS - AQUI PASSAMOS A NOVA FUNÇÃO onGuardar */}
      {paginaAtual === 'kpis' && (
        <GestaoKPI 
            onVoltar={navegarPara} 
            onGuardar={adicionarMedicao} // <--- LIGAÇÃO FEITA AQUI
            userRole={userRole}
            userSector={userSector} 
            onLogout={handleLogout} 
        />
      )}

      {/* 6. GESTÃO DE UTILIZADORES (ADMIN) */}
      {paginaAtual === 'admin-users' && (
        <GestaoUtilizadores 
            onVoltar={navegarPara} 
            userRole={userRole} 
            onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;