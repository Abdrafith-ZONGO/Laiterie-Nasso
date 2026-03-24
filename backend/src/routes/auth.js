const express = require('express');
const { register, login, getProfil } = require('../controllers/authController');
const { verifierToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login',    login);
router.get('/profil',    verifierToken, getProfil);

module.exports = router;
