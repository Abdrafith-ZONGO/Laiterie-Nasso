const express                                              = require('express');
const { creerCommande, getCommandes, getMesCommandes, changerStatut } = require('../controllers/commandesController');
const { verifierToken, verifierAdmin }                     = require('../middleware/auth');

const router = express.Router();

// Client connecté
router.post('/',                verifierToken,               creerCommande);
router.get('/mes-commandes',    verifierToken,               getMesCommandes);

// Admin seulement
router.get('/',                 verifierToken, verifierAdmin, getCommandes);
router.put('/:id/statut',       verifierToken, verifierAdmin, changerStatut);

module.exports = router;