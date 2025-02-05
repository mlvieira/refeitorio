const db = require('./db');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    const args = process.argv.slice(2);
    const [username, password, nome, role] = args;

    if (!username || !password || !nome || !role) {
        console.log('Uso: node createAdmin.js <usuario> <senha> <nome> <cargo>');
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO funcionarios (username, password, nome, role) VALUES (?, ?, ?, ?)`,
            [username, hashedPassword, nome, role],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        console.log(' O usuário admin já existe.');
                    } else {
                        console.error('Erro ao criar o admin:', err.message);
                    }
                } else {
                    console.log(`Admin criado com sucesso! (ID: ${this.lastID})`);
                }
            }
        );
    } catch (error) {
        console.error('Erro ao criar admin:', error);
    }
};

createAdmin();
