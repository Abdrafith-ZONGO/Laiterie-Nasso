const prisma = require('../lib/prisma');

// ─────────────────────────────────────────
// LISTE TOUS LES UTILISATEURS
// GET /api/utilisateurs
// ─────────────────────────────────────────
const getUtilisateurs = async (req, res) => {
  try {
    const { recherche, role } = req.query;
    
    // Construction du filtre WHERE
    let where = {};
    
    // Filtre par recherche (nom, prénom, email, username)
    if (recherche) {
      where.OR = [
        { nom: { contains: recherche, mode: 'insensitive' } },
        { prenom: { contains: recherche, mode: 'insensitive' } },
        { email: { contains: recherche, mode: 'insensitive' } },
        { username: { contains: recherche, mode: 'insensitive' } },
      ];
    }
    
    // Filtre par rôle
    if (role && role !== 'tous') {
      where.role = role;
    }
    
    const utilisateurs = await prisma.user.findMany({
      where,
      select: {
        id: true,
        prenom: true,
        nom: true,
        username: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return res.status(200).json({
      success: true,
      utilisateurs,
    });
    
  } catch (err) {
    console.error('Erreur getUtilisateurs:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// MODIFIER UN UTILISATEUR
// PUT /api/utilisateurs/:id
// ─────────────────────────────────────────
const modifierUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const { prenom, nom, email, telephone, role } = req.body;
    
    // Vérifier que l'utilisateur existe
    const existe = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!existe) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }
    
    // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
    if (email && email !== existe.email) {
      const emailExiste = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé',
        });
      }
    }
    
    // Mise à jour
    const utilisateur = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        prenom: prenom || existe.prenom,
        nom: nom || existe.nom,
        email: email || existe.email,
        telephone: telephone || existe.telephone,
        role: role || existe.role,
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        username: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
      },
    });
    
    return res.status(200).json({
      success: true,
      message: 'Utilisateur modifié avec succès',
      utilisateur,
    });
    
  } catch (err) {
    console.error('Erreur modifierUtilisateur:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// DÉTAILS D'UN UTILISATEUR
// GET /api/utilisateurs/:id
// ─────────────────────────────────────────
const getUtilisateurById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const utilisateur = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        prenom: true,
        nom: true,
        username: true,
        email: true,
        telephone: true,
        role: true,
        createdAt: true,
      },
    });
    
    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }
    
    return res.status(200).json({
      success: true,
      utilisateur,
    });
    
  } catch (err) {
    console.error('Erreur getUtilisateurById:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  getUtilisateurs,
  modifierUtilisateur,
  getUtilisateurById,
};