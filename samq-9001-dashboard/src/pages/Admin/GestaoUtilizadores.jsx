import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';

const GestaoUtilizadores = ({ onVoltar, userRole, onLogout }) => {
    const [users, setUsers] = useState([]);
    
    // Formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('Chefe de Secção');
    const [setor, setSetor] = useState('Produção');

    // Se não for Diretor, expulsa ou mostra erro (CA 7.1 e CA 7.3)
    if (userRole !== 'Diretor') {
        return (
            <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>
                <h1>⛔ Acesso Negado</h1>
                <p>Apenas o Diretor pode aceder a esta página.</p>
                <button onClick={() => onVoltar('dashboard')}>Voltar</button>
            </div>
        );
    }

    useEffect(() => {
        fetch('http://localhost:3001/api/users').then(r => r.json()).then(setUsers);
    }, []);

    const handleCriarUser = (e) => {
        e.preventDefault();

        fetch('http://localhost:3001/api/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                requesterRole: userRole, // Envia quem está a pedir (para validar o 403 no backend)
                nome, email, cargo, 
                setor: cargo === 'Chefe de Secção' ? setor : null
            })
        })
        .then(async (res) => {
            if (res.status === 403) {
                alert("⛔ ERRO DE SEGURANÇA: O servidor rejeitou o pedido (403).");
                return;
            }
            const data = await res.json();
            alert(data.message);
            // Recarregar lista...
            window.location.reload(); // Simplificação para recarregar
        });
    };

    return (
        <div className="dashboard-container">
            <Sidebar ativo="admin-users" aoNavegar={onVoltar} userRole={userRole} />
            <main className="main-content">
                <Header titulo="Gestão de Utilizadores e Perfis" userRole={userRole} onLogout={onLogout} />

                <section className="nc-form-card">
                    <h3>👤 Adicionar Novo Utilizador</h3>
                    <form onSubmit={handleCriarUser}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nome</label>
                                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            
                            {/* CA 7.2 - Apenas estas opções disponíveis */}
                            <div className="form-group">
                                <label>Perfil / Cargo</label>
                                <select value={cargo} onChange={e => setCargo(e.target.value)} style={{padding:'10px'}}>
                                    <option value="Chefe de Secção">Chefe de Secção</option>
                                    <option value="Auditor">Auditor</option>
                                    <option value="Diretor">Diretor</option>
                                </select>
                            </div>

                            {cargo === 'Chefe de Secção' && (
                                <div className="form-group">
                                    <label>Setor</label>
                                    <select value={setor} onChange={e => setSetor(e.target.value)} style={{padding:'10px'}}>
                                        <option value="Produção">Produção</option>
                                        <option value="Logística">Logística</option>
                                        {/* ... outros setores ... */}
                                    </select>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn-submit" style={{marginTop:'15px'}}>Criar Utilizador</button>
                    </form>
                </section>

                <section className="recent-activity">
                    <h3>Utilizadores do Sistema</h3>
                    <table className="table">
                        <thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>Cargo</th><th>Setor</th></tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>#{u.id}</td>
                                    <td>{u.nome}</td>
                                    <td>{u.email}</td>
                                    <td><strong>{u.cargo}</strong></td>
                                    <td>{u.setor || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default GestaoUtilizadores;