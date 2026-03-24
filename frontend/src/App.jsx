import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header        from './components/Header';
import Footer        from './components/Footer';
import Accueil       from './pages/Accueil';
import Produits      from './pages/Produits';
import Histoire      from './pages/Histoire';
import Contact       from './pages/Contact';
import Compte        from './pages/Compte';
import Panier        from './pages/Panier';
import AdminLayout   from './pages/Admin/index';
import Dashboard     from './pages/Admin/Dashboard';
import AdminProduits from './pages/Admin/Produits';

// ─────────────────────────────────────────
// Protection route admin
// ─────────────────────────────────────────
function RouteAdmin({ children }) {
  const { estAdmin, loading } = useAuth();
  if (loading) return null;
  if (!estAdmin) return <Navigate to="/" replace />;
  return children;
}

// ─────────────────────────────────────────
// Layout public — avec Header et Footer
// Reçoit totalArticles pour le badge panier
// ─────────────────────────────────────────
function LayoutPublic({ children, totalArticles }) {
  return (
    <div className="bg-fond-page min-h-screen flex flex-col">
      <Header totalArticles={totalArticles} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────
// APP
// ─────────────────────────────────────────
function App() {

  // ── Panier centralisé ici ──────────────
  const [panier, setPanier] = useState([]);

  const ajouterAuPanier = (produit) => {
    setPanier(prev => {
      const existe = prev.find(p => p.id === produit.id);
      if (existe) {
        return prev.map(p =>
          p.id === produit.id ? { ...p, quantite: p.quantite + 1 } : p
        );
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  const retirerDuPanier = (id) => {
    setPanier(prev => prev.filter(p => p.id !== id));
  };

  const modifierQuantite = (id, quantite) => {
    if (quantite <= 0) return retirerDuPanier(id);
    setPanier(prev =>
      prev.map(p => p.id === id ? { ...p, quantite } : p)
    );
  };

  const viderPanier = () => setPanier([]);

  const totalArticles = panier.reduce((acc, p) => acc + p.quantite, 0);
  const totalPrix     = panier.reduce((acc, p) => acc + p.prix * p.quantite, 0);

  return (
    <Routes>

      {/* ── ROUTES PUBLIQUES ── */}
      <Route path="/" element={
        <LayoutPublic totalArticles={totalArticles}>
          <Accueil ajouterAuPanier={ajouterAuPanier} />
        </LayoutPublic>
      } />

      <Route path="/produits" element={
        <LayoutPublic totalArticles={totalArticles}>
          <Produits ajouterAuPanier={ajouterAuPanier} />
        </LayoutPublic>
      } />

      <Route path="/histoire" element={
        <LayoutPublic totalArticles={totalArticles}>
          <Histoire />
        </LayoutPublic>
      } />

      <Route path="/contact" element={
        <LayoutPublic totalArticles={totalArticles}>
          <Contact />
        </LayoutPublic>
      } />

      <Route path="/compte" element={
        <LayoutPublic totalArticles={totalArticles}>
          <Compte />
        </LayoutPublic>
      } />

      <Route path="/panier" element={
        <LayoutPublic totalArticles={totalArticles}>
          <Panier
            panier={panier}
            totalPrix={totalPrix}
            modifierQuantite={modifierQuantite}
            retirerDuPanier={retirerDuPanier}
            viderPanier={viderPanier}
          />
        </LayoutPublic>
      } />

      {/* ── ROUTES ADMIN ── */}
      <Route path="/admin" element={
        <RouteAdmin><AdminLayout /></RouteAdmin>
      }>
        <Route index           element={<Dashboard />}     />
        <Route path="produits" element={<AdminProduits />} />
      </Route>

    </Routes>
  );
}

export default App;