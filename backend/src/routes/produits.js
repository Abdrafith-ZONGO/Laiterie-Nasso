const express = require('express');
const {
  getProduits, getProduitById,
  creerProduit, modifierProduit, supprimerProduit,
} = require('../controllers/produitsController');
const { verifierToken, verifierAdmin } = require('../middleware/auth');

const router = express.Router();

// ── Publiques ─────────────────────────────
router.get('/',    getProduits);
router.get('/:id', getProduitById);

// ── Admin seulement ───────────────────────
router.post('/',    verifierToken, verifierAdmin, creerProduit);
router.put('/:id',  verifierToken, verifierAdmin, modifierProduit);
router.delete('/:id', verifierToken, verifierAdmin, supprimerProduit);

module.exports = router;
