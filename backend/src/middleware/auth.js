const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────
// Middleware : vérifie le token JWT
// Utilisé pour protéger les routes privées
// ─────────────────────────────────────────
const verifierToken = (req, res, next) => {
  // Récupère le token dans le header Authorization
  // Format attendu : "Bearer eyJhbGc..."
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1];

  // Pas de token → accès refusé
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé — token manquant',
    });
  }

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajoute les infos de l'utilisateur à la requête
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Token invalide ou expiré',
    });
  }
};

// ─────────────────────────────────────────
// Middleware : vérifie que le rôle est admin
// À utiliser après verifierToken
// ─────────────────────────────────────────
const verifierAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé — droits admin requis',
    });
  }
  next();
};

module.exports = { verifierToken, verifierAdmin };