const express = require('express');
const router = express.Router();
const { confirmarPresenca, listarAlmoco } = require('../controllers/presencaController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/confirmar/:id', authenticateToken, authorizeRole(1), confirmarPresenca);
router.get('/listar-almoco', authenticateToken, authorizeRole(2), listarAlmoco);

module.exports = router;
