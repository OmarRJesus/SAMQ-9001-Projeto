const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // Permite que o frontend (porta 5173) fale com este backend
app.use(express.json()); // Permite ler dados JSON enviados pelo formulário React

// --- LIGAÇÃO À BASE DE DADOS ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Utilizador definido na instalação
    password: 'root',  // A password que definiste ('root')
    database: 'samq9001'
});

// Testar a ligação ao iniciar
// 2. Testar a ligação e DESATIVAR SAFE UPDATES NA SESSÃO
db.connect((err) => {
    if (err) {
        console.error('❌ Erro ao ligar à base de dados:', err.message);
    } else {
        console.log('✅ Ligado ao MySQL com sucesso!');

        // COMANDO MÁGICO: Desliga a proteção de updates nesta ligação
        db.query("SET SESSION sql_safe_updates = 0", (err) => {
            if (err) console.error("Aviso: Não foi possível desativar safe updates");
            else console.log("🔓 Modo Safe Updates desativado para esta sessão.");
        });
    }
});

// --- ROTAS (API) ---

// 1. Rota para BUSCAR (GET) todas as Não Conformidades
// Usada no Dashboard para preencher a tabela
app.get('/api/ncs', (req, res) => {
    const sql = "SELECT * FROM nao_conformidades ORDER BY id ASC";

    db.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Erro ao consultar base de dados");
        }
        return res.json(data);
    });
});

// 2. Rota para CRIAR (POST) uma nova Não Conformidade
// Usada no Formulário de Registo
// No samq-9001-backend/server.js

// CRIAR NOVA NC (Com Utilizador e Data Automática)
// CRIAR NOVA NC (Com Utilizador e Data Automática)
app.post('/api/ncs', (req, res) => {
    // Recebemos agora o 'registado_por' vindo do Frontend
    const { descricao, setor, risco, registado_por } = req.body;

    if (!descricao || !setor || !risco) {
        return res.status(400).json({ message: "Preencha os campos obrigatórios." });
    }

    // Nota: Removemos 'data' do INSERT porque vamos deixar o MySQL usar o DEFAULT CURRENT_TIMESTAMP se tiveres configurado,
    // OU usamos NOW() diretamente na query para ser infalível.
    
    const sql = "INSERT INTO nao_conformidades (descricao, setor, risco, status, registado_por, data_registo) VALUES (?, ?, ?, 'Aberta', ?, NOW())";
    
    db.query(sql, [descricao, setor, risco, registado_por], (err, data) => {
        if (err) {
            console.error("Erro SQL:", err);
            return res.status(500).json({ message: "Erro ao gravar NC" });
        }
        return res.json({ message: "NC Criada com sucesso!", id: data.insertId });
    });
});

// --- ROTAS PARA DOCUMENTOS ---

// 1. Buscar todos os documentos
app.get('/api/documentos', (req, res) => {
    const sql = "SELECT * FROM documentos ORDER BY data_upload DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// 2. Criar novo documento (RF.Doc.Obrigatorio.01)
app.post('/api/documentos', (req, res) => {
    const { titulo, tipo, seccao } = req.body;

    // Validação extra no Backend (Dupla segurança para campos obrigatórios)
    if (!titulo || !tipo || !seccao) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    const sql = "INSERT INTO documentos (titulo, tipo, seccao, url_ficheiro, estado) VALUES (?, ?, ?, 'ficheiro_exemplo.pdf', 'Pendente')";
    const values = [titulo, tipo, seccao];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Documento registado com sucesso!" });
    });
});

// 3. Rota para ATUALIZAR uma NC (Editar Causa e Status)
// ATUALIZAR NC (Rota corrigida para incluir o RISCO)
app.put('/api/ncs/:id', (req, res) => {
    const id = req.params.id;

    // 1. AQUI ESTAVA O ERRO: Tens de garantir que 'risco' está nesta lista!
    const { causa_raiz, status, risco } = req.body;

    // Debug: Vamos ver no terminal o que está a chegar
    console.log(`📝 Atualizando NC #${id}: Risco=${risco}, Status=${status}`);

    // 2. Atualizar os 3 campos na base de dados
    const sql = "UPDATE nao_conformidades SET causa_raiz = ?, status = ?, risco = ? WHERE id = ?";

    // 3. Garantir que a ordem dos valores bate certo com os '?'
    db.query(sql, [causa_raiz, status, risco, id], (err, result) => {
        if (err) {
            console.error("❌ Erro SQL:", err);
            return res.status(500).json(err);
        }
        return res.json({ message: "NC atualizada com sucesso!" });
    });
});

// --- ROTAS PARA KPIS ---

// 1. Buscar a lista de indicadores disponíveis (para preencher a dropdown)
app.get('/api/indicadores', (req, res) => {
    db.query("SELECT * FROM indicadores", (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// 2. Registar uma nova medição (RF.KPI.Inserir.01)
app.post('/api/medicoes', (req, res) => {
    const { indicador_id, valor, data_medicao } = req.body;

    const sql = "INSERT INTO medicoes_kpi (indicador_id, valor, data_medicao) VALUES (?, ?, ?)";

    db.query(sql, [indicador_id, valor, data_medicao], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json("Erro ao gravar medição");
        }
        return res.json({ message: "Medição registada com sucesso!" });
    });
});

// 3. (Opcional) Buscar histórico de medições para a tabela
app.get('/api/medicoes', (req, res) => {
    const sql = `
        SELECT m.id, i.nome, m.valor, i.unidade, m.data_medicao 
        FROM medicoes_kpi m
        JOIN indicadores i ON m.indicador_id = i.id
        ORDER BY m.data_medicao DESC
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// --- ROTAS PARA PLANO DE AÇÃO (PAC) ---

// 1. Buscar todas as ações de uma NC específica
app.get('/api/ncs/:id/acoes', (req, res) => {
    const sql = "SELECT * FROM acoes_pac WHERE nc_id = ? ORDER BY prazo ASC";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// 2. Criar uma nova ação para uma NC
app.post('/api/acoes', (req, res) => {
    // Receber todos os campos novos
    const { nc_id, descricao, porque, responsavel, onde, como, quanto, prazo, observacoes } = req.body;

    const sql = "INSERT INTO acoes_pac (nc_id, descricao, porque, responsavel, onde, como, quanto, prazo, observacoes, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendente')";

    const values = [nc_id, descricao, porque, responsavel, onde, como, quanto, prazo, observacoes];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Ação 5W2H adicionada com sucesso!", id: result.insertId });
    });
});

// 3. Marcar ação como concluída (Extra: para dar vida à lista)
app.put('/api/acoes/:id/concluir', (req, res) => {
    const sql = "UPDATE acoes_pac SET estado = 'Concluída' WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Ação concluída!" });
    });
});

// 4. Verificar Eficácia (Passo Final do Workflow)
app.put('/api/ncs/:id/verificar', (req, res) => {
    const id = req.params.id;
    const { resultado, obs } = req.body;

    let novoStatus;

    // LÓGICA DO REQUISITO RF.NC.Reabrir.01
    if (resultado === 'Não Eficaz') {
        novoStatus = 'Aberta'; // Reabre a NC para começar tudo de novo
    } else {
        novoStatus = 'Fechada'; // Fecha definitivamente o processo
    }

    const sql = "UPDATE nao_conformidades SET resultado_eficacia = ?, obs_eficacia = ?, status = ? WHERE id = ?";

    db.query(sql, [resultado, obs, novoStatus, id], (err, result) => {
        if (err) return res.status(500).json(err);

        // Mensagem personalizada dependendo do resultado
        const msg = resultado === 'Não Eficaz'
            ? "Atenção: A NC foi REABERTA porque a ação não foi eficaz."
            : "Sucesso: A NC foi encerrada e arquivada.";

        return res.json({ message: msg, novoStatus });
    });
});

// --- ROTAS DE DOCUMENTOS ATUALIZADAS ---

// 1. Criar Nova Versão (Copia o antigo, incrementa versão, estado Pendente)
app.post('/api/documentos/:id/nova-versao', (req, res) => {
    const idAntigo = req.params.id;

    // Primeiro buscamos os dados do antigo
    db.query("SELECT * FROM documentos WHERE id = ?", [idAntigo], (err, results) => {
        if (err) return res.status(500).json(err);
        const docAntigo = results[0];

        // Criar o novo (Versão + 1, Estado Pendente)
        const sql = "INSERT INTO documentos (titulo, tipo, seccao, url_ficheiro, estado, versao) VALUES (?, ?, ?, ?, 'Pendente', ?)";
        const novaVersao = docAntigo.versao + 1;

        db.query(sql, [docAntigo.titulo, docAntigo.tipo, docAntigo.seccao, docAntigo.url_ficheiro, novaVersao], (err, result) => {
            if (err) return res.status(500).json(err);
            return res.json({ message: `Versão ${novaVersao} criada com sucesso!` });
        });
    });
});

// 2. APROVAR (Atualizado para tornar os antigos OBSOLETOS)
// ATUALIZAÇÃO DA ROTA DE APROVAR (Com Logs de Diagnóstico)
// --- VERSÃO ROBUSTA DA APROVAÇÃO ---
// --- VERSÃO ROBUSTA DA APROVAÇÃO ---
app.put('/api/documentos/:id/aprovar', (req, res) => {
    const id = req.params.id;

    // 1. Descobrir o título do documento atual
    db.query("SELECT * FROM documentos WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json(err);
        const docAtual = results[0];

        console.log(`🔎 A processar aprovação para: "${docAtual.titulo}"`);

        // 2. Buscar explicitamente os IDs das versões antigas
        const sqlBuscarAntigos = "SELECT id FROM documentos WHERE titulo = ? AND id != ?";
        db.query(sqlBuscarAntigos, [docAtual.titulo, id], (err, resultsAntigos) => {
            if (err) return res.status(500).json(err);

            const idsAntigos = resultsAntigos.map(doc => doc.id);
            console.log(`📉 Versões antigas encontradas: ${idsAntigos.length} (IDs: ${idsAntigos})`);

            // Função auxiliar para aprovar o atual (passo final)
            const aprovarAtual = () => {
                db.query("UPDATE documentos SET estado = 'Aprovado' WHERE id = ?", [id], (err) => {
                    if (err) return res.status(500).json(err);
                    res.json({ message: "Documento Aprovado e versões antigas arquivadas!" });
                });
            };

            // 3. Se houver antigos, marcá-los como Obsoletos pelos IDs
            if (idsAntigos.length > 0) {
                // Nota: Usamos "id IN (?)" que funciona mesmo com Safe Update
                db.query("UPDATE documentos SET estado = 'Obsoleto' WHERE id IN (?)", [idsAntigos], (err) => {
                    if (err) {
                        console.error("Erro ao arquivar:", err);
                        return res.status(500).json(err);
                    }
                    aprovarAtual(); // Só aprova o novo depois de arquivar os velhos
                });
            } else {
                aprovarAtual(); // Não há antigos, aprova só o novo
            }
        });
    });
});
// --- GESTÃO DE UTILIZADORES (RF.Seg.Perfil.Diretor.03) ---

// 1. Listar Utilizadores
app.get('/api/users', (req, res) => {
    db.query("SELECT * FROM utilizadores", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 2. Criar/Editar Utilizador (PROTEGIDO - CA 7.4)
app.post('/api/users', (req, res) => {
    const { requesterRole, nome, email, cargo, setor } = req.body;

    // VALIDACAO DE SEGURANÇA (CA 7.4)
    // Se quem pede não for Diretor, bloqueia!
    if (requesterRole !== 'Diretor') {
        return res.status(403).json({ message: "ERRO 403: Apenas o Diretor pode gerir utilizadores." });
    }

    const sql = "INSERT INTO utilizadores (nome, email, cargo, setor) VALUES (?, ?, ?, ?)";
    db.query(sql, [nome, email, cargo, setor], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Utilizador criado com sucesso!" });
    });
});

// 3. Apagar Utilizador (PROTEGIDO - CA 7.4)
app.delete('/api/users/:id', (req, res) => {
    const { requesterRole } = req.body; // Num sistema real, isto viria do Token/Session

    if (requesterRole !== 'Diretor') {
        return res.status(403).json({ message: "ERRO 403: Sem permissão." });
    }

    db.query("DELETE FROM utilizadores WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Utilizador removido." });
    });
});
// --- ARRANCAR O SERVIDOR ---
const PORT = 3001; // Backend corre na 3001, Frontend na 5173
app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend a correr na porta ${PORT}`);
});