require('dotenv').config();
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT f.*, a.alergias 
            FROM funcionarios f
            LEFT JOIN alergias_funcionarios a ON f.id = a.funcionario_id
            WHERE username = ?
        `, [username], (err, user) => {
        if (err || !user) return res.status(401).json({ message: 'Credenciais inválida' });

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            return res.json({
                token,
                user: {
                    id: user.id,
                    nome: user.nome,
                    username: user.username,
                    role: user.role,
                    alergias: user.alergias || '',
                }
            });
        } else {
            return res.status(401).json({ message: 'Credenciais inválida' });
        }
    });
};