const express = require('express');
const router = express.Router();
const { getFuncionarios, createFuncionario, updateFuncionario } = require('../controllers/funcionarioController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/:page/:limit', authenticateToken, authorizeRole(1), getFuncionarios);
router.post('/', authenticateToken, authorizeRole(3), createFuncionario);
router.put('/:id', authenticateToken, authorizeRole(1), updateFuncionario);

module.exports = router;
