const prisma = require('../lib/prisma');

// ─────────────────────────────────────────
// GET /api/produits — public
// ─────────────────────────────────────────
const getProduits = async (req, res) => {
  try {
    const produits = await prisma.produit.findMany({
      orderBy: { position: 'asc' },
    });

    return res.status(200).json({ success: true, produits });

  } catch (err) {
    console.error('Erreur getProduits:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// GET /api/produits/:id — public
// ─────────────────────────────────────────
const getProduitById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const produit = await prisma.produit.findUnique({ where: { id } });

    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    return res.status(200).json({ success: true, produit });

  } catch (err) {
    console.error('Erreur getProduitById:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// POST /api/produits — admin
// ─────────────────────────────────────────
const creerProduit = async (req, res) => {
  try {
    const { nom, description, prix, categorie, imageUrl, stock, disponible, position } = req.body;

    if (!nom || !prix || !categorie) {
      return res.status(400).json({
        success: false,
        message: 'Nom, prix et catégorie sont obligatoires',
      });
    }

    // Position = dernier si non fournie
    let positionFinale = position;
    if (!positionFinale) {
      const dernier = await prisma.produit.aggregate({ _max: { position: true } });
      positionFinale = (dernier._max.position ?? 0) + 1;
    }

    const produit = await prisma.produit.create({
      data: {
        nom:         nom.trim(),
        description: description?.trim() || null,
        prix:        parseFloat(prix),
        categorie:   categorie.trim(),
        imageUrl:    imageUrl || null,
        stock:       parseInt(stock) || 0,
        disponible:  disponible ?? true,
        position:    parseInt(positionFinale),
      },
    });

    return res.status(201).json({ success: true, message: 'Produit créé avec succès', produit });

  } catch (err) {
    console.error('Erreur creerProduit:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// PUT /api/produits/:id — admin
// ─────────────────────────────────────────
const modifierProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nom, description, prix, categorie, imageUrl, stock, disponible, position } = req.body;

    const existe = await prisma.produit.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    const produit = await prisma.produit.update({
      where: { id },
      data: {
        ...(nom         !== undefined && { nom: nom.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(prix        !== undefined && { prix: parseFloat(prix) }),
        ...(categorie   !== undefined && { categorie: categorie.trim() }),
        ...(imageUrl    !== undefined && { imageUrl: imageUrl || null }),
        ...(stock       !== undefined && { stock: parseInt(stock) }),
        ...(disponible  !== undefined && { disponible }),
        ...(position    !== undefined && { position: parseInt(position) }),
      },
    });

    return res.status(200).json({ success: true, message: 'Produit modifié avec succès', produit });

  } catch (err) {
    console.error('Erreur modifierProduit:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// DELETE /api/produits/:id — admin
// ─────────────────────────────────────────
const supprimerProduit = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existe = await prisma.produit.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    await prisma.produit.delete({ where: { id } });

    // Réordonner les positions après suppression
    const restants = await prisma.produit.findMany({ orderBy: { position: 'asc' } });
    await Promise.all(
      restants.map((p, index) =>
        prisma.produit.update({ where: { id: p.id }, data: { position: index + 1 } })
      )
    );

    return res.status(200).json({ success: true, message: 'Produit supprimé avec succès' });

  } catch (err) {
    console.error('Erreur supprimerProduit:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { getProduits, getProduitById, creerProduit, modifierProduit, supprimerProduit };
