import React, { createContext, useContext, useState, useEffect } from 'react';

// ─────────────────────────────────────────
// Context Panier — partagé dans toute l'app
// Stocké dans localStorage pour persister
// ─────────────────────────────────────────
const PanierContext = createContext(null);

export function PanierProvider({ children }) {
  const [panier, setPanier] = useState(() => {
    // Charge le panier depuis localStorage au démarrage
    try {
      const sauvegarde = localStorage.getItem('panier');
      return sauvegarde ? JSON.parse(sauvegarde) : [];
    } catch {
      return [];
    }
  });

  // Sauvegarde dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(panier));
  }, [panier]);

  // ── Ajouter un produit ──────────────────
  const ajouterAuPanier = (produit, quantite = 1) => {
    setPanier(prev => {
      const existe = prev.find(p => p.id === produit.id);
      if (existe) {
        return prev.map(p =>
          p.id === produit.id
            ? { ...p, quantite: p.quantite + quantite }
            : p
        );
      }
      return [...prev, { ...produit, quantite }];
    });
  };

  // ── Modifier la quantité ────────────────
  const modifierQuantite = (id, quantite) => {
    if (quantite <= 0) {
      supprimerDuPanier(id);
      return;
    }
    setPanier(prev =>
      prev.map(p => p.id === id ? { ...p, quantite } : p)
    );
  };

  // ── Supprimer un article ────────────────
  const supprimerDuPanier = (id) => {
    setPanier(prev => prev.filter(p => p.id !== id));
  };

  // ── Vider le panier ─────────────────────
  const viderPanier = () => {
    setPanier([]);
    localStorage.removeItem('panier');
  };

  // ── Calculs ─────────────────────────────
  const totalArticles = panier.reduce((acc, p) => acc + p.quantite, 0);
  const totalPrix     = panier.reduce((acc, p) => acc + p.prix * p.quantite, 0);

  return (
    <PanierContext.Provider value={{
      panier,
      ajouterAuPanier,
      modifierQuantite,
      supprimerDuPanier,
      viderPanier,
      totalArticles,
      totalPrix,
    }}>
      {children}
    </PanierContext.Provider>
  );
}

export const usePanier = () => useContext(PanierContext);