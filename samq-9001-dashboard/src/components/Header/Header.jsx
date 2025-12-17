import React from 'react';
import './Header.css';

const Header = ({ titulo, userRole, onLogout }) => {
    return (
        <header className="header-container">
            <div className="header-title">
                <h1>{titulo}</h1>
            </div>

            <div className="header-user-area">
                <div className="user-info">
                    <span className="welcome-text">Bem-vindo,</span>
                    <span className="user-role">{userRole}</span>
                </div>

                {/* O BOTÃO QUE PEDISTE - AZUL E BONITO */}
                <button className="btn-logout" onClick={onLogout} title="Sair do Sistema">
                    Sair ➜
                </button>
            </div>
        </header>
    );
};

export default Header;