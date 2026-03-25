const prisma = require('../lib/prisma');

// ─────────────────────────────────────────
// CRÉER UNE COMMANDE
// POST /api/commandes
// Privé — client connecté
// ─────────────────────────────────────────
const creerCommande = async (req, res) => {
  try {
    const { items } = req.body;
    const userId    = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le panier est vide',
      });
    }

    // Vérifie que chaque produit existe et a du stock
    for (const item of items) {
      const produit = await prisma.produit.findUnique({
        where: { id: item.produitId },
      });

      if (!produit) {
        return res.status(404).json({
          success: false,
          message: `Produit #${item.produitId} introuvable`,
        });
      }

      if (produit.stock < item.quantite) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour "${produit.nom}"`,
        });
      }
    }

    // Calcule le total
    let total = 0;
    for (const item of items) {
      total += item.prixUnitaire * item.quantite;
    }

    // Crée la commande + items en une seule transaction
    const commande = await prisma.commande.create({
      data: {
        userId,
        total,
        statut: 'EN_ATTENTE',
        items: {
          create: items.map(item => ({
            produitId:    item.produitId,
            quantite:     item.quantite,
            prixUnitaire: item.prixUnitaire,
          })),
        },
      },
      include: {
        items: { include: { produit: true } },
        user:  true,
      },
    });

    // Déduit le stock pour chaque produit
    for (const item of items) {
      await prisma.produit.update({
        where: { id: item.produitId },
        data:  { stock: { decrement: item.quantite } },
      });
    }

    return res.status(201).json({
      success:  true,
      message:  'Commande créée avec succès',
      commande,
    });

  } catch (err) {
    console.error('Erreur creerCommande:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// LISTE TOUTES LES COMMANDES
// GET /api/commandes
// Privé — admin seulement
// ─────────────────────────────────────────
const getCommandes = async (req, res) => {
  try {
    const commandes = await prisma.commande.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user:  { select: { id: true, prenom: true, nom: true, username: true, telephone: true, email: true } },
        items: { include: { produit: { select: { id: true, nom: true, imageUrl: true } } } },
      },
    });

    return res.status(200).json({ success: true, commandes });

  } catch (err) {
    console.error('Erreur getCommandes:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// MES COMMANDES — client connecté
// GET /api/commandes/mes-commandes
// Privé — client connecté
// ─────────────────────────────────────────
const getMesCommandes = async (req, res) => {
  try {
    const commandes = await prisma.commande.findMany({
      where:   { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            produit: { select: { id: true, nom: true, imageUrl: true, categorie: true } },
          },
        },
      },
    });

    return res.status(200).json({ success: true, commandes });

  } catch (err) {
    console.error('Erreur getMesCommandes:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// CHANGER STATUT D'UNE COMMANDE
// PUT /api/commandes/:id/statut
// Privé — admin seulement
// ─────────────────────────────────────────
const changerStatut = async (req, res) => {
  try {
    const { id }     = req.params;
    const { statut } = req.body;

    const statutsValides = ['EN_ATTENTE', 'RECU', 'TERMINE'];
    if (!statutsValides.includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide',
      });
    }

    const commande = await prisma.commande.update({
      where: { id: parseInt(id) },
      data:  { statut },
      include: {
        user:  { select: { prenom: true, nom: true, telephone: true } },
        items: { include: { produit: true } },
      },
    });

    return res.status(200).json({
      success:  true,
      message:  'Statut mis à jour',
      commande,
    });

  } catch (err) {
    console.error('Erreur changerStatut:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { creerCommande, getCommandes, getMesCommandes, changerStatut };