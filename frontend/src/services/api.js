import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ─────────────────────────────────────────
// INTERCEPTEUR REQUÊTE
// Ajoute le token JWT dans le header Authorization
// ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─────────────────────────────────────────
// INTERCEPTEUR RÉPONSE
// Si le backend répond 401 (non autorisé)
// → token expiré ou invalide
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
// ─────────────────────────────────────────
export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getProfil = () => api.get('/api/auth/profil');

// ─────────────────────────────────────────
// FONCTIONS PRODUITS
// ─────────────────────────────────────────
export const getProduits = () => api.get('/api/produits');
export const getProduitById = (id) => api.get(`/api/produits/${id}`);
export const creerProduit = (data) => api.post('/api/produits', data);
export const modifierProduit = (id, data) => api.put(`/api/produits/${id}`, data);
export const supprimerProduit = (id) => api.delete(`/api/produits/${id}`);

// ─────────────────────────────────────────
// FONCTIONS COMMANDES
// ─────────────────────────────────────────
export const creerCommande = (data) => api.post('/api/commandes', data);
export const getCommandes = () => api.get('/api/commandes');
export const getMesCommandes = () => api.get('/api/commandes/mes-commandes');
export const changerStatut = (id, statut) => api.put(`/api/commandes/${id}/statut`, { statut });

// ─────────────────────────────────────────
// FONCTIONS UTILISATEURS
// ─────────────────────────────────────────

// Récupère tous les utilisateurs (admin)
export const getUtilisateurs = (params = {}) => {
  const { recherche, role } = params;
  let url = '/api/utilisateurs';
  const queryParams = [];
  
  if (recherche) queryParams.push(`recherche=${encodeURIComponent(recherche)}`);
  if (role && role !== 'tous') queryParams.push(`role=${role}`);
  
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  
  return api.get(url);
};

// Modifie un utilisateur (admin)
export const modifierUtilisateur = (id, data) =>
  api.put(`/api/utilisateurs/${id}`, data);

// Récupère les détails d'un utilisateur
export const getUtilisateurById = (id) =>
  api.get(`/api/utilisateurs/${id}`);

export default api;