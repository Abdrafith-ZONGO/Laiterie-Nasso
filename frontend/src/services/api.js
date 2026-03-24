import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─────────────────────────────────────────
// INTERCEPTEUR DE RÉPONSE
//
// Après CHAQUE réponse du backend,
// ce code s'exécute automatiquement.
//
// Si le backend répond 401 (non autorisé)
// → le token est expiré ou invalide
// → on supprime le token du localStorage
// → on redirige vers /compte pour reconnecter
// ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/compte';
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────
// FONCTIONS AUTH
//
// On regroupe ici tous les appels API
// liés à l'authentification.
// Le reste du code importe ces fonctions
// au lieu d'écrire axios partout.
// ─────────────────────────────────────────

// Inscription — envoie les données du formulaire
export const register = (data) =>
  api.post('/api/auth/register', data);

// Connexion — envoie email + password
export const login = (data) =>
  api.post('/api/auth/login', data);

// Récupère le profil de l'utilisateur connecté
export const getProfil = () =>
  api.get('/api/auth/profil');

// ─────────────────────────────────────────
// FONCTIONS PRODUITS
// ─────────────────────────────────────────

// Récupère tous les produits
export const getProduits = () =>
  api.get('/api/produits');

// Récupère un produit par ID
export const getProduitById = (id) =>
  api.get(`/api/produits/${id}`);

// Crée un produit (admin)
export const creerProduit = (data) =>
  api.post('/api/produits', data);

// Modifie un produit (admin)
export const modifierProduit = (id, data) =>
  api.put(`/api/produits/${id}`, data);

// Supprime un produit (admin)
export const supprimerProduit = (id) =>
  api.delete(`/api/produits/${id}`);

export default api;