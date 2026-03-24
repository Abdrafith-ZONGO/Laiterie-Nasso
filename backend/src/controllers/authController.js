const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// ─────────────────────────────────────────
// INSCRIPTION — POST /api/auth/register
// ─────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { prenom, nom, username, email, telephone, password } = req.body;

    if (!prenom || !nom || !username || !email || !telephone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires',
      });
    }

    const emailExiste = await prisma.user.findUnique({ where: { email } });
    if (emailExiste) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
    }

    const usernameExiste = await prisma.user.findUnique({ where: { username } });
    if (usernameExiste) {
      return res.status(400).json({ success: false, message: "Ce nom d'utilisateur est déjà pris" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { prenom, nom, username, email, telephone, password: passwordHash, role: 'client' },
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      token,
      user: {
        id: user.id, prenom: user.prenom, nom: user.nom,
        username: user.username, email: user.email, role: user.role,
      },
    });

  } catch (err) {
    console.error('Erreur register:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur', detail: err.message });
  }
};

// ─────────────────────────────────────────
// CONNEXION — POST /api/auth/login
// ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(password, user.password);
    if (!motDePasseValide) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id, prenom: user.prenom, nom: user.nom,
        username: user.username, email: user.email, role: user.role,
      },
    });

  } catch (err) {
    console.error('Erreur login:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ─────────────────────────────────────────
// PROFIL — GET /api/auth/profil
// Route protégée — token JWT requis
// ─────────────────────────────────────────
const getProfil = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, prenom: true, nom: true,
        username: true, email: true,
        telephone: true, role: true, createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    }

    return res.status(200).json({ success: true, user });

  } catch (err) {
    console.error('Erreur profil:', err.message);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = { register, login, getProfil };
