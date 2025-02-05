const db = require('../db');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

exports.createFuncionario = (req, res) => {
    const { username, password, nome, alergias, role = 1 } = req.body;

    if (!username || !password || !nome) {
        return res.status(400).json({ error: 'Todos os campos precisam ser preenchidos.' });
    }

    bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Ocorreu um erro.' });
        }

        const insertFuncionarioQuery = `
            INSERT INTO funcionarios (username, password, nome, role)
            VALUES (?, ?, ?, ?)
        `;
        const params = [username, hashedPassword, nome, role];

        db.run(insertFuncionarioQuery, params, function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Usuário já existe.' });
                }
                return res.status(500).json({ error: err.message });
            }

            const funcionarioId = this.lastID;

            if (alergias) {
                const insertAlergiasQuery = `
                    INSERT INTO alergias_funcionarios (funcionario_id, alergias)
                    VALUES (?, ?)
                `;
                db.run(insertAlergiasQuery, [funcionarioId, alergias], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erro ao inserir alergias.' });
                    }

                    return res.status(201).json({
                        message: `Usuário ${username} criado com sucesso!`,
                        funcionarioId,
                    });
                });
            } else {
                res.status(201).json({
                    message: `Usuário ${username} criado com sucesso!`,
                    funcionarioId: this.lastID,
                });
            }
        });
    });
};

exports.getFuncionarios = (req, res) => {
    const query = `
        SELECT 
            f.id, f.nome, f.username, f.role, a.alergias
        FROM 
            funcionarios f
        LEFT JOIN 
            alergias_funcionarios a ON f.id = a.funcionario_id
        ORDER BY 
            f.nome ASC
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};

exports.updateFuncionario = (req, res) => {
    const { id } = req.params;
    const { username, password, nome, alergias, role } = req.body;

    if (!nome) {
        return res.status(400).json({ error: 'Usuário e Nome são obrigatórios.' });
    }

    const updateFuncionarioQuery = `
    UPDATE funcionarios
    SET nome = ?, role = ?
    WHERE id = ?
  `;
    const params = [nome, role || 1, id];

    db.run(updateFuncionarioQuery, params, function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar o funcionário.' });
        }

        if (password) {
            bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao criptografar a senha.' });
                }

                const updatePasswordQuery = `UPDATE funcionarios SET password = ? WHERE id = ?`;
                db.run(updatePasswordQuery, [hashedPassword, id]);
            });
        }

        if (alergias) {
            const checkAlergiasQuery = `SELECT * FROM alergias_funcionarios WHERE funcionario_id = ?`;

            db.get(checkAlergiasQuery, [id], (err, existingAlergias) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao verificar alergias.' });
                }

                if (existingAlergias) {
                    const updateAlergiasQuery = `
            UPDATE alergias_funcionarios
            SET alergias = ?
            WHERE funcionario_id = ?
          `;
                    db.run(updateAlergiasQuery, [alergias, id]);
                } else {
                    const insertAlergiasQuery = `
            INSERT INTO alergias_funcionarios (funcionario_id, alergias)
            VALUES (?, ?)
          `;
                    db.run(insertAlergiasQuery, [id, alergias]);
                }
            });
        }

        res.status(200).json({
            message: `Funcionário ${username} atualizado com sucesso!`,
        });
    });
}
