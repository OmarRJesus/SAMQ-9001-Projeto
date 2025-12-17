import React, { useState, useEffect } from 'react';
import '../Dashboard.css';
import './GestaoKPI.css'; // O teu novo CSS
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import Header from '../../components/Header/Header';

// 1. Recebemos 'onGuardar' para comunicar com o App.jsx
const GestaoKPI = ({ onVoltar, onGuardar, userRole, onLogout }) => {
  const [indicadores, setIndicadores] = useState([]);
  const [historico, setHistorico] = useState([]);

  // Estados do Formulário
  const [indicadorId, setIndicadorId] = useState('');
  const [valor, setValor] = useState('');
  const [dataMedicao, setDataMedicao] = useState('');

  useEffect(() => {
    carregarTudo();
  }, []);

  const carregarTudo = () => {
    // Carrega a lista de indicadores (para o Dropdown)
    fetch('http://localhost:3001/api/indicadores')
      .then(res => res.json())
      .then(data => {
        setIndicadores(data);
        // Seleciona o primeiro por defeito se a lista não estiver vazia
        if(data.length > 0 && !indicadorId) setIndicadorId(data[0].id);
      });

    // Carrega o histórico da tabela local
    fetch('http://localhost:3001/api/medicoes')
      .then(res => res.json())
      .then(data => setHistorico(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar o objeto tal como o backend espera
    const novaMedicao = { 
        indicador_id: indicadorId, 
        valor: valor, 
        data_medicao: dataMedicao 
    };

    // 2. ALTERAÇÃO PRINCIPAL:
    // Em vez de fazer o fetch aqui, usamos o onGuardar do pai (App.jsx).
    // Isto garante que o Dashboard Global sabe que há dados novos!
    onGuardar(novaMedicao);

    // Limpeza e atualização local
    setValor('');
    
    // Pequeno truque: damos 500ms para o servidor processar antes de atualizar a tabela local
    setTimeout(() => {
        carregarTudo();
    }, 500);
  };

  return (
    <div className="dashboard-container">
      <Sidebar ativo="kpis" aoNavegar={onVoltar} userRole={userRole} />

      <main className="main-content">
        <Header 
            titulo="Monitorização e KPIs" 
            userRole={userRole} 
            onLogout={onLogout} 
        />

        {/* Formulário de Inserção (Estilo 100% largura) */}
        <section className="kpi-card">
          <h3>📈 Registar Nova Medição</h3>
          <form onSubmit={handleSubmit}>
            
            {/* Linha única com Flexbox */}
            <div className="kpi-form-row">
                
                {/* Indicador (Mais largo: flex 2) */}
                <div className="kpi-group" style={{flex: 2}}>
                    <label>Indicador *</label>
                    <select value={indicadorId} onChange={e => setIndicadorId(e.target.value)}>
                        {indicadores.map(ind => (
                            <option key={ind.id} value={ind.id}>
                                {ind.nome} (Meta: {ind.meta}{ind.unidade})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Valor (Mais curto: flex 1) */}
                <div className="kpi-group" style={{flex: 1}}>
                    <label>Valor Medido *</label>
                    <input 
                        type="number" step="0.01" 
                        value={valor} onChange={e => setValor(e.target.value)} 
                        required placeholder="Ex: 95.5"
                    />
                </div>

                {/* Data (Mais curto: flex 1) */}
                <div className="kpi-group" style={{flex: 1}}>
                    <label>Data *</label>
                    <input 
                        type="date" 
                        value={dataMedicao} onChange={e => setDataMedicao(e.target.value)} 
                        required
                    />
                </div>

                {/* Botão (Tamanho automático) */}
                <button type="submit" className="btn-kpi-submit">
                    + Registar
                </button>
            </div>
          </form>
        </section>

        {/* Histórico de Medições */}
        <section className="kpi-card">
            <h3>🗂️ Histórico de Registos</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{width: '20%'}}>Data</th>
                        <th style={{width: '60%'}}>Indicador</th>
                        <th style={{width: '20%'}}>Valor Medido</th>
                    </tr>
                </thead>
                <tbody>
                    {historico.length === 0 ? (
                        <tr><td colSpan="3" style={{textAlign:'center'}}>Sem registos.</td></tr>
                    ) : (
                        historico.map(reg => (
                            <tr key={reg.id}>
                                <td>{new Date(reg.data_medicao).toLocaleDateString()}</td>
                                <td>{reg.nome}</td>
                                <td>
                                    <span style={{
                                        fontWeight: 'bold', 
                                        color: '#8e44ad', 
                                        background: '#f5eef8', 
                                        padding: '5px 10px', 
                                        borderRadius: '15px'
                                    }}>
                                        {reg.valor}{reg.unidade}
                                    </span>
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

export default GestaoKPI;