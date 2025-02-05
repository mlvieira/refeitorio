const db = require('../db');

exports.confirmarPresenca = (req, res) => {
    const { id } = req.params;
    const { presenca } = req.body;

    db.get('SELECT id FROM funcionarios WHERE id = ?', [id], (err, funcionario) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado.' });
        }

        const funcionarioId = funcionario.id;

        db.get('SELECT id FROM presencas WHERE funcionario_id = ? AND data = DATE("now")', [funcionarioId], (err, existingPresenca) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (existingPresenca) {
                db.run(
                    'UPDATE presencas SET presenca = ? WHERE funcionario_id = ? AND DATE("now")',
                    [presenca, funcionarioId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        return res.status(200).json({
                            message: 'Presença atualizada com sucesso!',
                            presencaId: existingPresenca.id,
                        });
                    }
                );
            } else {
                db.run(
                    'INSERT INTO presencas (funcionario_id, presenca) VALUES (?, ?)',
                    [funcionarioId, presenca],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        return res.status(201).json({
                            message: 'Presença confirmada com sucesso!',
                            presencaId: this.lastID,
                        });
                    }
                );
            }
        });
    });
};

exports.listarAlmoco = (req, res) => {

    const query = `
        SELECT 
            f.nome,
            a.alergias
        FROM 
            presencas p
        JOIN 
            funcionarios f ON p.funcionario_id = f.id
        LEFT JOIN 
            alergias_funcionarios a ON f.id = a.funcionario_id
        WHERE 
            p.presenca = 1
            AND p.data = DATE('now')
        ORDER BY
            f.nome
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(rows);
    });
}