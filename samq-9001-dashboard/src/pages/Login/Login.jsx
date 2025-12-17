import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [step, setStep] = useState('selecao-perfil'); // 'selecao-perfil' ou 'selecao-setor'
    const [setorSelecionado, setSetorSelecionado] = useState('Produção');

    const setores = [
        "Produção", "Logística", "Segurança", "Qualidade",
        "Manutenção", "Comercial / Vendas", "Recursos Humanos",
        "Financeiro", "Armazém", "TI / Informática", "Direção Geral"
    ];

    const handleLoginDiretor = () => {
        onLogin('Diretor', null);
    };
    const handleLoginAuditor = () => {
        // Auditor também vê tudo, logo o setor é null
        onLogin('Auditor', null);
    };

    const handleAvancarChefe = () => {
        setStep('selecao-setor');
    };

    const handleConfirmarChefe = () => {
        onLogin('Chefe', setorSelecionado);
    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* Cabeçalho com Ícone e Título */}
                <div className="login-header">
                    <span className="login-icon">💎</span>
                    <h2>SAMQ-9001</h2>
                    <p>Sistema de Gestão da Qualidade</p>
                </div>

                {/* PASSO 1: ESCOLHA DE PERFIL */}
                {step === 'selecao-perfil' && (
                    <div className="login-body">
                        <button className="btn-login btn-director" onClick={handleLoginDiretor}>
                            👤 Entrar como <strong>DIRETOR</strong>
                        </button>

                        <button className="btn-login btn-auditor" onClick={handleLoginAuditor}>
                            📋 Entrar como <strong>AUDITOR</strong>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                            <span style={{ height: '1px', background: '#eee', flex: 1 }}></span>
                            <span style={{ color: '#ccc', padding: '0 10px', fontSize: '0.8rem' }}>OU</span>
                            <span style={{ height: '1px', background: '#eee', flex: 1 }}></span>
                        </div>

                        <button className="btn-login btn-chefe" onClick={handleAvancarChefe}>
                            👷 Entrar como <strong>CHEFE DE SECÇÃO</strong>
                        </button>
                    </div>
                )}

                {/* PASSO 2: ESCOLHA DE SETOR (Apenas para Chefes) */}
                {step === 'selecao-setor' && (
                    <div className="login-body">
                        <label className="label-text">Selecione o seu departamento:</label>

                        <select
                            className="select-setor"
                            value={setorSelecionado}
                            onChange={(e) => setSetorSelecionado(e.target.value)}
                        >
                            {setores.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <button className="btn-login btn-confirm" onClick={handleConfirmarChefe}>
                            🚀 Confirmar e Entrar
                        </button>

                        <button className="btn-back" onClick={() => setStep('selecao-perfil')}>
                            Voltar à seleção de perfil
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Login;