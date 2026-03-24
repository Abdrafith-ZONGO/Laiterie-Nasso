const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

const app = express();

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./src/routes/auth'));
app.use('/api/produits', require('./src/routes/produits'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🥛 API Laiterie Nasoo opérationnelle' });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route introuvable : ${req.method} ${req.path}` });
});

// ─── Erreur globale ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Erreur globale]', err);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

  // Test de connexion Prisma au démarrage
  const prisma = require('./src/lib/prisma');
  try {
    const count = await prisma.produit.count();
    console.log(`✅ Supabase connecté — ${count} produit(s) en base`);
  } catch (err) {
    console.error('❌ Erreur connexion Prisma:', err.message);
  }
});
