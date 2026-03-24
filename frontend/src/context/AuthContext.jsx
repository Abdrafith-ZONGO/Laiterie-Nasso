import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

// ─────────────────────────────────────────
// Création du Context
// C'est la "boîte partagée" entre composants
// ─────────────────────────────────────────
const AuthContext = createContext(null);

// ─────────────────────────────────────────
// Provider — enveloppe toute l'application
// Tous les composants à l'intérieur peuvent
// accéder aux données du context
// ─────────────────────────────────────────
export function AuthProvider({ children }) {

  // ── État de l'utilisateur connecté ──────
  // null = personne connecté
  // { id, username, role, ... } = connecté
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────
  // Au chargement de l'app :
  // Vérifie si un user était déjà connecté
  // (token + user stockés dans localStorage)
  // ─────────────────────────────────────────
  useEffect(() => {
    const tokenSauvegarde = localStorage.getItem('token');
    const userSauvegarde  = localStorage.getItem('user');

    if (tokenSauvegarde && userSauvegarde) {
      // Remet l'utilisateur en mémoire
      setUser(JSON.parse(userSauvegarde));
    }
    setLoading(false);
  }, []);

  // ─────────────────────────────────────────
  // FONCTION CONNEXION
  // Appelée depuis la page Compte
  // ─────────────────────────────────────────
  const connecter = async (email, password) => {
    const reponse = await apiLogin({ email, password });
    const { token, user } = reponse.data;

    // Sauvegarde dans localStorage
    // → survit au rechargement de la page
    localStorage.setItem('token', token);
    localStorage.setItem('user',  JSON.stringify(user));

    // Met à jour l'état React
    setUser(user);

    // Redirige selon le rôle
    return user.role; // 'admin' ou 'client'
  };

  // ─────────────────────────────────────────
  // FONCTION INSCRIPTION
  // Appelée depuis la page Compte
  // ─────────────────────────────────────────
  const inscrire = async (donnees) => {
    const reponse = await apiRegister(donnees);
    const { token, user } = reponse.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user',  JSON.stringify(user));

    setUser(user);
    return user.role;
  };

  // ─────────────────────────────────────────
  // FONCTION DÉCONNEXION
  // Supprime tout et redirige vers l'accueil
  // ─────────────────────────────────────────
  const deconnecter = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ─────────────────────────────────────────
  // Ce que le Context partage avec l'app
  // ─────────────────────────────────────────
  return (
    <AuthContext.Provider value={{
      user,          // infos utilisateur connecté (ou null)
      loading,       // true pendant la vérification initiale
      connecter,     // fonction pour se connecter
      inscrire,      // fonction pour s'inscrire
      deconnecter,   // fonction pour se déconnecter
      estConnecte: !!user,           // true/false
      estAdmin: user?.role === 'admin', // true si admin
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────
// Hook personnalisé
// Permet d'utiliser le context facilement :
// const { user, connecter } = useAuth();
// au lieu de useContext(AuthContext)
// ─────────────────────────────────────────
export const useAuth = () => useContext(AuthContext);