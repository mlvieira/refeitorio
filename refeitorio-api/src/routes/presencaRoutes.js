const express = require('express');
const router = express.Router();
const { confirmarPresenca, listarAlmoco, listarPresencaPorId } = require('../controllers/presencaController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/confirmar/:id', authenticateToken, authorizeRole(1), confirmarPresenca);
router.get('/listar-almoco', authenticateToken, authorizeRole(2), listarAlmoco);
router.get('/:id', authenticateToken, authorizeRole(1), listarPresencaPorId);

module.exports = router;
