import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PanierProvider, usePanier } from './context/PanierContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Produits from './pages/Produits';
import Histoire from './pages/Histoire';
import Contact from './pages/Contact';
import Compte from './pages/Compte';
import Profil from './pages/Profil';
import Panier from './pages/Panier';
import MesCommandes from './pages/MesCommandes';
import AdminLayout from './pages/Admin/index';
import Dashboard from './pages/Admin/Dashboard';
import AdminProduits from './pages/Admin/Produits';
import AdminCommandes from './pages/Admin/Commandes';
import Utilisateurs from './pages/Admin/Utilisateurs';

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
// Lit totalArticles depuis le contexte Panier
// ─────────────────────────────────────────
function LayoutPublic({ children }) {
  const { totalArticles } = usePanier();  // ← UNE SEULE SOURCE

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
  return (
    <PanierProvider>
      <Routes>

        {/* ── ROUTES PUBLIQUES ── */}
        <Route path="/" element={
          <LayoutPublic>
            <Accueil />
          </LayoutPublic>
        } />

        <Route path="/produits" element={
          <LayoutPublic>
            <Produits />
          </LayoutPublic>
        } />

        <Route path="/histoire" element={
          <LayoutPublic>
            <Histoire />
          </LayoutPublic>
        } />

        <Route path="/contact" element={
          <LayoutPublic>
            <Contact />
          </LayoutPublic>
        } />

        <Route path="/compte" element={
          <LayoutPublic>
            <Compte />
          </LayoutPublic>
        } />

        <Route path="/panier" element={
          <LayoutPublic>
            <Panier />
          </LayoutPublic>
        } />

        <Route path="/profil" element={
  <LayoutPublic>
    <Profil />
  </LayoutPublic>
} />

        <Route path="/mes-commandes" element={
          <LayoutPublic>
            <MesCommandes />
         </LayoutPublic>
        } />

        {/* ── ROUTES ADMIN ── */}
        <Route path="/admin" element={
          <RouteAdmin><AdminLayout /></RouteAdmin>
        }>
          <Route index element={<Dashboard />} />
          <Route path="produits" element={<AdminProduits />} />
          <Route path="commandes" element={<AdminCommandes />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
        </Route>

      </Routes>
    </PanierProvider>
  );
}

export default App;