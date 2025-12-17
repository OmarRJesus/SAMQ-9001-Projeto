import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Documentos.css';
import Header from '../../components/Header/Header';

const Documentos = ({ onVoltar, userRole, onLogout }) => {
    // Estados do Formulário
    const [titulo, setTitulo] = useState('');
    const [tipo, setTipo] = useState('PDF');
    const [seccao, setSeccao] = useState('');
    const [docs, setDocs] = useState([]);

    // PERMISSÕES:
    // 1. Quem pode CRIAR/EDITAR documentos? (Chefes e Diretor)
    // O Auditor NÃO PODE (Apenas consulta)
    const podeEditar = userRole === 'Chefe' || userRole === 'Diretor';

    // 2. Quem pode APROVAR? (Apenas Diretor)
    const podeAprovar = userRole === 'Diretor';

    const carregarDocumentos = () => {
        fetch('http://localhost:3001/api/documentos')
            .then(res => res.json())
            .then(data => setDocs(data))
            .catch(err => console.error(err));
    };

    useEffect(() => { carregarDocumentos(); }, []);

    const isFormularioValido = titulo.trim() !== '' && seccao.trim() !== '';

    const handleSubmit = (e) => {
        e.preventDefault();
        const novoDoc = { titulo, tipo, seccao };

        fetch('http://localhost:3001/api/documentos', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoDoc)
        }).then(res => {
            if (res.ok) {
                alert("Documento criado!");
                setTitulo(''); setSeccao(''); carregarDocumentos();
            }
        });
    };

    const handleAprovar = (id) => {
        if (!window.confirm("Aprovar este documento tornará as versões anteriores OBSOLETAS. Continuar?")) return;
        fetch(`http://localhost:3001/api/documentos/${id}/aprovar`, { method: 'PUT' })
            .then(res => res.json())
            .then(data => { alert(data.message); carregarDocumentos(); });
    };

    const handleNovaVersao = (id) => {
        if (!window.confirm("Quer criar uma nova versão (rascunho) deste documento?")) return;
        fetch(`http://localhost:3001/api/documentos/${id}/nova-versao`, { method: 'POST' })
            .then(res => res.json())
            .then(data => { alert(data.message); carregarDocumentos(); });
    };

    return (
        <div className="dashboard-container">
            <Sidebar ativo="documentos" aoNavegar={onVoltar} userRole={userRole} />

            <main className="main-content">
                <Header titulo="Gestão Documental" userRole={userRole} onLogout={onLogout} />

                {/* SECÇÃO DE CRIAÇÃO - SÓ APARECE SE PUDER EDITAR (CHEFE/DIRETOR) */}
                {podeEditar ? (
                    <section className="doc-form-card">
                        <h3>📂 Novo Documento (v1)</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Título *</label>
                                    <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Ex: Procedimento X" />
                                </div>
                                <div className="form-group">
                                    <label>Tipo *</label>
                                    <select value={tipo} onChange={e => setTipo(e.target.value)}>
                                        <option value="PDF">PDF</option>
                                        <option value="DOCX">DOCX</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Secção *</label>
                                    <input type="text" value={seccao} onChange={e => setSeccao(e.target.value)} required placeholder="Ex: RH" />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={!isFormularioValido}
                                    style={{
                                        backgroundColor: isFormularioValido ? '#27ae60' : '#95a5a6',
                                        cursor: isFormularioValido ? 'pointer' : 'not-allowed',
                                        opacity: isFormularioValido ? 1 : 0.6,
                                        border: 'none', color: 'white'
                                    }}
                                >
                                    + Adicionar Documento
                                </button>
                            </div>
                        </form>
                    </section>
                ) : (
                    // MENSAGEM PARA O AUDITOR
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #8e44ad', color: '#555' }}>
                        ℹ️ <strong>Modo de Leitura:</strong> Como Auditor, tem acesso total para consultar os documentos, mas não pode criar ou editar novos registos.
                    </div>
                )}

                <section className="recent-activity">
                    <h3>🗄️ Repositório Central</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Versão</th>
                                <th>Título</th>
                                <th>Tipo</th>
                                <th>Secção</th>
                                <th>Estado</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.map(doc => {
                                const isObsoleto = doc.estado === 'Obsoleto';
                                const rowStyle = isObsoleto ? { opacity: 0.5, backgroundColor: '#f9f9f9' } : {};

                                return (
                                    <tr key={doc.id} style={rowStyle}>
                                        <td><span style={{ background: '#34495e', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>v{doc.versao || 1}</span></td>
                                        <td style={{ textDecoration: isObsoleto ? 'line-through' : 'none' }}>{doc.titulo}</td>
                                        <td><span style={{ fontWeight: 'bold', color: doc.tipo === 'PDF' ? '#e74c3c' : '#2980b9' }}>{doc.tipo}</span></td>
                                        <td>{doc.seccao}</td>
                                        <td>
                                            <span style={{
                                                padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                                                backgroundColor: doc.estado === 'Aprovado' ? '#eafaf1' : (doc.estado === 'Obsoleto' ? '#ecf0f1' : '#fef9e7'),
                                                color: doc.estado === 'Aprovado' ? '#27ae60' : (doc.estado === 'Obsoleto' ? '#7f8c8d' : '#f1c40f'),
                                            }}>
                                                {doc.estado}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '5px' }}>

                                            {/* Botão APROVAR: Só Diretor */}
                                            {doc.estado === 'Pendente' && podeAprovar && (
                                                <button className="btn-approve" onClick={() => handleAprovar(doc.id)}>✅ Aprovar</button>
                                            )}

                                            {/* Botão NOVA VERSÃO: Só Chefe ou Diretor (Auditor não vê) */}
                                            {doc.estado === 'Aprovado' && podeEditar && (
                                                <button
                                                    onClick={() => handleNovaVersao(doc.id)}
                                                    style={{ padding: '5px 10px', background: '#8e44ad', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    title="Criar nova versão deste documento"
                                                >
                                                    🆙 Nova Versão
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default Documentos;