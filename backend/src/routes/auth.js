const express                          = require('express');
const { register, login, getProfil }   = require('../controllers/authController');
const { verifierToken }                = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────
// Routes publiques (sans token)
// ─────────────────────────────────────────
router.post('/register', register);  // Inscription
router.post('/login',    login);     // Connexion

// ─────────────────────────────────────────
// Routes privées (token JWT requis)
// ─────────────────────────────────────────
router.get('/profil', verifierToken, getProfil); // Mon profil

module.exports = router;