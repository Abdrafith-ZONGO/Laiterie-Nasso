# 🥛 Laiterie Nasoo

Site e-commerce de la Laiterie Nasoo — produits laitiers et fastfood à Ouagadougou, Burkina Faso.

---

## 🚀 Stack technique

| Couche | Technologie | Hébergement |
|--------|------------|-------------|
| Frontend | React + Vite + TailwindCSS | Vercel |
| Backend | Node.js + Express + Prisma | Railway |
| Base de données | PostgreSQL | Supabase |
| Auth | JWT + bcrypt | — |

---

## 📁 Structure du projet
```
Laiterie-Nasso/
├── frontend/     # React + Vite
└── backend/      # Node.js + Express
```

---

## ⚙️ Installation locale

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase (base de données)

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Remplir les variables dans .env
npx prisma migrate dev
npm run dev
# → http://localhost:5000
```

---

## 🔐 Variables d'environnement

### `backend/.env`
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="ton_secret_jwt"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

### `frontend/.env`
```env
VITE_API_URL="http://localhost:5000"
```

---

## 👤 Rôles utilisateurs

| Rôle | Accès |
|------|-------|
| `client` | Parcourir, commander, voir son profil |
| `admin` | Gérer produits, commandes, utilisateurs |

---

## 📦 Fonctionnalités

- [x] Header responsive avec drawer mobile
- [x] Footer moderne
- [x] Page compte (connexion / inscription)
- [ ] Catalogue produits
- [ ] Panier
- [ ] Commandes
- [ ] Dashboard admin

---

## 👨‍💻 Développeur

**Abdrafith ZONGO** — Ouagadougou, Burkina Faso

---

## 📄 Licence

Projet privé — © 2025 Laiterie Nasoo. Tous droits réservés.