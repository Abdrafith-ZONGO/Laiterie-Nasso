const express = require('express');
const router = express.Router();
const { verifierToken, verifierAdmin } = require('../middleware/auth');
const {
  getUtilisateurs,
  modifierUtilisateur,
  getUtilisateurById,
} = require('../controllers/utilisateursController');

// Toutes les routes nécessitent d'être connecté et admin
router.use(verifierToken, verifierAdmin);

router.get('/', getUtilisateurs);
router.get('/:id', getUtilisateurById);
router.put('/:id', modifierUtilisateur);

module.exports = router;