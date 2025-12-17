import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './RegistoNC.css';
import Header from '../../components/Header/Header';

const DetalhesNC = ({ nc, onVoltar, onAtualizar, userRole, onLogout }) => {
  const [causa, setCausa] = useState(nc.causa_raiz || '');
  const [status, setStatus] = useState(nc.status);
  const [risco, setRisco] = useState(nc.risco || 'Baixo');
  const [acoes, setAcoes] = useState([]);
  
  // PERMISSÕES
  const podeVerificar = userRole === 'Diretor' || userRole === 'Auditor';
  const podeEditar = (userRole === 'Chefe' || userRole === 'Diretor') && (status === 'Aberta' || status === 'Em Análise');

  const [novaAcao, setNovaAcao] = useState({
    descricao: '', porque: '', responsavel: '', onde: '',
    como: '', quanto: '', prazo: '', observacoes: ''
  });

  const [obsEficacia, setObsEficacia] = useState(nc.obs_eficacia || '');

  useEffect(() => { carregarAcoes(); }, [nc.id]);

  const carregarAcoes = () => {
    fetch(`http://localhost:3001/api/ncs/${nc.id}/acoes`)
      .then(res => res.json())
      .then(data => setAcoes(data));
  };

  /* --- VALIDAÇÕES --- */

  // 1. Contagem de caracteres reais (sem espaços)
  const caracteresReais = causa.replace(/\s/g, '').length;
  
  // 2. Validação da Causa (Bloqueia o PAC se for falso)
  const isCausaValida = caracteresReais >= 100;

  // 3. Validação para Fechar a NC
  const temAcoes = acoes.length > 0;
  const tudoConcluido = acoes.every(acao => acao.estado === 'Concluída');
  const podeSolicitarVerificacao = isCausaValida && temAcoes && tudoConcluido;

  /* ------------------ */

  const handleAdicionarAcao = (e) => {
    e.preventDefault();
    
    // SEGURANÇA EXTRA: Se alguém tentar forçar o envio
    if (!isCausaValida) {
        alert("A Análise de Causa Raiz está incompleta. Não é possível criar ações.");
        return;
    }

    fetch('http://localhost:3001/api/acoes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...novaAcao, nc_id: nc.id })
    }).then(() => {
      setNovaAcao({ descricao: '', porque: '', responsavel: '', onde: '', como: '', quanto: '', prazo: '', observacoes: '' });
      carregarAcoes();
    });
  };

  const handleConcluirAcao = (id) => {
    fetch(`http://localhost:3001/api/acoes/${id}/concluir`, { method: 'PUT' }).then(() => carregarAcoes());
  };

  const handleGuardarNC = (novoStatus) => {
    if (!podeSolicitarVerificacao) {
      alert(`⚠️ Ainda não pode fechar a NC!\n\nRequisitos:\n1. Análise Causa > 100 caracteres\n2. Pelo menos 1 ação no PAC\n3. Todas as ações "Concluídas"`);
      return;
    }
    onAtualizar(nc.id, { causa_raiz: causa, status: novoStatus, risco: risco });
  };

  const handleSalvarAlteracoes = () => {
    onAtualizar(nc.id, { causa_raiz: causa, status: status, risco: risco });
    alert("Alterações guardadas com sucesso!");
  };

  const handleVerificarEficacia = (resultado) => {
    if (!obsEficacia) { alert("Justifique a decisão."); return; }
    fetch(`http://localhost:3001/api/ncs/${nc.id}/verificar`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultado, obs: obsEficacia })
    }).then(res => res.json()).then(data => { alert(data.message); onVoltar('dashboard'); });
  };

  return (
    <div className="dashboard-container">
      <Sidebar ativo="dashboard" aoNavegar={onVoltar} userRole={userRole} />

      <main className="main-content">
        <Header titulo="Pac - Não Conformidade" userRole={userRole} onLogout={onLogout} />

        <section className="nc-form-card">

          {/* Cabeçalho de Informação */}
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e9ecef' }}>
            <div className="form-row-split" style={{ alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ flex: 2 }}>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: '#7f8c8d', textTransform: 'uppercase' }}>Problema</strong>
                <span style={{ fontSize: '1.1rem', color: '#2c3e50' }}>{nc.descricao}</span>
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: '#7f8c8d', textTransform: 'uppercase' }}>Origem</strong>
                <span style={{ fontSize: '1.1rem', color: '#2c3e50' }}>{nc.setor}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: '#7f8c8d', textTransform: 'uppercase' }}>Risco Atual</strong>
                {podeEditar ? (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '2px' }}>
                    <select value={risco} onChange={(e) => setRisco(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', fontWeight: 'bold', width: '100%' }}>
                      <option value="Baixo">Baixo</option><option value="Médio">Médio</option><option value="Alto">Alto</option>
                    </select>
                    <button onClick={handleSalvarAlteracoes} title="Guardar Risco" style={{ cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '1.2rem' }}>💾</button>
                  </div>
                ) : (
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{risco}</span>
                )}
              </div>
            </div>
          </div>

          {/* 1. ANÁLISE DE CAUSA RAIZ */}
          <h3>🔍 1. Análise de Causa Raiz</h3>
          <div className="form-group">
            <textarea rows="4" value={causa} onChange={(e) => setCausa(e.target.value)}
              disabled={!podeEditar}
              placeholder="Descreva a causa raiz detalhadamente..."
              style={{
                borderColor: isCausaValida ? '#27ae60' : '#e74c3c', // Verde se OK, Vermelho se não
                borderWidth: '2px',
                backgroundColor: !podeEditar ? '#f8f9fa' : 'white'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '5px' }}>
              <span style={{ color: isCausaValida ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                {isCausaValida ? "✅ Análise Completa" : "⚠️ Mínimo 100 caracteres para desbloquear o PAC"}
              </span>
              <span>{caracteresReais} / 100</span>
            </div>
          </div>

          {/* 2. PLANO DE AÇÃO CORRETIVA */}
          <h3 style={{ marginTop: '30px' }}>📋 2. Plano de Ação Corretiva</h3>
          
          {/* LÓGICA DE BLOQUEIO: Só mostra o formulário se a Causa for Válida E se puder editar */}
          {podeEditar && status !== 'Fechada' ? (
              isCausaValida ? (
                /* FORMULÁRIO DO PAC (Desbloqueado) */
                <form onSubmit={handleAdicionarAcao} style={{ marginBottom: '20px', background: '#fdfefe', border: '1px dashed #bdc3c7', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}><label style={{ fontSize: '0.75rem' }}>O Que? (What) *</label><input type="text" value={novaAcao.descricao} onChange={e => setNovaAcao({ ...novaAcao, descricao: e.target.value })} required /></div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}><label style={{ fontSize: '0.75rem' }}>Porquê? (Why) *</label><input type="text" value={novaAcao.porque} onChange={e => setNovaAcao({ ...novaAcao, porque: e.target.value })} required /></div>
                    <div className="form-group"><label style={{ fontSize: '0.75rem' }}>Quem? (Who) *</label><input type="text" value={novaAcao.responsavel} onChange={e => setNovaAcao({ ...novaAcao, responsavel: e.target.value })} required /></div>
                    <div className="form-group"><label style={{ fontSize: '0.75rem' }}>Quando? (When) *</label><input type="date" value={novaAcao.prazo} onChange={e => setNovaAcao({ ...novaAcao, prazo: e.target.value })} required /></div>
                    <div className="form-group"><label style={{ fontSize: '0.75rem' }}>Onde? (Where) *</label><input type="text" value={novaAcao.onde} onChange={e => setNovaAcao({ ...novaAcao, onde: e.target.value })} required /></div>
                    <div className="form-group"><label style={{ fontSize: '0.75rem' }}>Como? (How) *</label><input type="text" value={novaAcao.como} onChange={e => setNovaAcao({ ...novaAcao, como: e.target.value })} required /></div>
                    <div className="form-group"><label style={{ fontSize: '0.75rem' }}>Quanto? (Cost) *</label><input type="text" value={novaAcao.quanto} onChange={e => setNovaAcao({ ...novaAcao, quanto: e.target.value })} required /></div>
                    <div className="form-group" style={{ gridColumn: 'span 3' }}><label style={{ fontSize: '0.75rem' }}>Observações</label><input type="text" value={novaAcao.observacoes} onChange={e => setNovaAcao({ ...novaAcao, observacoes: e.target.value })} /></div>
                  </div>
                  <button type="submit" className="btn-submit" style={{ width: '100%' }}>+ Adicionar ao Plano</button>
                </form>
              ) : (
                /* MENSAGEM DE BLOQUEIO */
                <div style={{
                    padding: '20px', 
                    background: '#fff3cd', 
                    color: '#856404', 
                    border: '1px solid #ffeeba', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    ⛔ <strong>Ação Bloqueada:</strong> O Plano de Ação só fica disponível após preencher corretamente a <strong>Análise de Causa Raiz</strong> (Mín. 100 caracteres).
                </div>
              )
          ) : null}

          <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
            <table className="table" style={{ marginBottom: '0', minWidth: '1200px' }}>
              <thead style={{ background: '#0097e6', color: 'white' }}>
                <tr><th style={{ width: '20%' }}>WHAT</th><th style={{ width: '15%' }}>WHY</th><th style={{ width: '10%' }}>WHO</th><th style={{ width: '10%' }}>WHERE</th><th style={{ width: '10%' }}>WHEN</th><th style={{ width: '10%' }}>HOW</th><th style={{ width: '10%' }}>COST</th><th style={{ width: '10%' }}>STATUS</th><th style={{ width: '5%' }}>Ação</th></tr>
              </thead>
              <tbody>
                {acoes.map(acao => (
                  <tr key={acao.id} style={{ opacity: acao.estado === 'Concluída' ? 0.6 : 1, background: acao.estado === 'Concluída' ? '#f0fff4' : 'white' }}>
                    <td><strong>{acao.descricao}</strong></td><td>{acao.porque || '-'}</td><td>{acao.responsavel}</td><td>{acao.onde || '-'}</td><td>{new Date(acao.prazo).toLocaleDateString()}</td><td>{acao.como || '-'}</td><td>{acao.quanto || '-'}</td>
                    <td style={{ color: acao.estado === 'Concluída' ? 'green' : 'orange', fontWeight: 'bold' }}>{acao.estado}</td>
                    <td>
                      {podeEditar && acao.estado === 'Pendente' && (
                        <button onClick={() => handleConcluirAcao(acao.id)} title="Marcar como Feito">✔</button>
                      )}
                    </td>
                  </tr>
                ))}
                {acoes.length === 0 && <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Nenhuma ação definida.</td></tr>}
              </tbody>
            </table>
          </div>

          {/* 3. VERIFICAÇÃO DE EFICÁCIA */}
          {(status === 'Resolvida' || status === 'Fechada') && (
            <div style={{ marginTop: '40px', borderTop: '2px solid #3498db', paddingTop: '20px', background: '#ebf5fb', padding: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#2980b9', margin: 0 }}>🛡️ 3. Verificação de Eficácia</h3>
                {!podeVerificar && status === 'Resolvida' && (
                  <span style={{ fontSize: '0.8rem', background: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>🔒 Acesso de Leitura</span>
                )}
              </div>
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Observações do Auditor:</label>
                <textarea rows="3" value={obsEficacia} onChange={e => setObsEficacia(e.target.value)} disabled={status === 'Fechada' || !podeVerificar} style={{ backgroundColor: !podeVerificar ? '#f8f9fa' : 'white' }} />
              </div>
              {status === 'Resolvida' && podeVerificar && (
                <div className="nc-form-actions" style={{ justifyContent: 'flex-start' }}>
                  <button onClick={() => handleVerificarEficacia('Eficaz')} className="btn-submit" style={{ background: '#27ae60' }}>✅ Eficaz</button>
                  <button onClick={() => handleVerificarEficacia('Não Eficaz')} className="btn-submit" style={{ background: '#c0392b' }}>❌ Não Eficaz</button>
                </div>
              )}
              {status === 'Fechada' && <p style={{ color: 'green', fontWeight: 'bold' }}>🔒 NC Encerrada com Sucesso.</p>}
            </div>
          )}

          {/* BOTÕES FINAIS */}
          <div className="nc-form-actions" style={{ marginTop: '30px', justifyContent: 'space-between' }}>
            {podeEditar && (<button onClick={handleSalvarAlteracoes} className="btn-submit" style={{ backgroundColor: '#34495e' }}>💾 Guardar Alterações</button>)}
            <div style={{ display: 'flex', gap: '10px' }}>
              {status !== 'Resolvida' && status !== 'Fechada' && podeEditar && (
                <button onClick={() => handleGuardarNC('Resolvida')} disabled={!podeSolicitarVerificacao} className="btn-submit" style={{ backgroundColor: podeSolicitarVerificacao ? '#f39c12' : '#95a5a6', cursor: podeSolicitarVerificacao ? 'pointer' : 'not-allowed' }}>
                  {podeSolicitarVerificacao ? "✅ Solicitar Verificação" : "🚫 Aguardando Conclusão..."}
                </button>
              )}
              <button onClick={() => onVoltar('dashboard')} className="btn-cancel">Voltar</button>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default DetalhesNC;