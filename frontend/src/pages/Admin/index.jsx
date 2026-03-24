import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag,
  FiUsers, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';

// ─────────────────────────────────────────
// PALETTE Admin — tons sombres professionnels
// ─────────────────────────────────────────
const C = {
  fond:        '#0f1a0f',   // fond très sombre vert nuit
  sidebar:     '#162016',   // fond menu latéral
  carte:       '#1e2e1e',   // fond cartes
  bordure:     'rgba(90,191,42,0.15)',
  texte:       '#e8f5d0',   // texte principal clair
  texteClair:  'rgba(232,245,208,0.60)',
  vert:        '#5ABF2A',
  vertClair:   '#90D840',
  or:          '#D4A017',
  orClair:     '#F2C040',
  rouge:       '#E53535',
  blanc:       '#FFFFFF',
};

// ─────────────────────────────────────────
// Liens du menu latéral
// ─────────────────────────────────────────
const MENU_LINKS = [
  { to: '/admin',          label: 'Dashboard',  icon: <FiGrid />     },
  { to: '/admin/produits', label: 'Produits',   icon: <FiPackage />  },
  { to: '/admin/commandes',label: 'Commandes',  icon: <FiShoppingBag /> },
  { to: '/admin/users',    label: 'Utilisateurs', icon: <FiUsers />  },
];

// ─────────────────────────────────────────
// Lien du menu latéral
// ─────────────────────────────────────────
function MenuLink({ to, label, icon, active }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            '12px',
        padding:        '11px 16px',
        borderRadius:   '10px',
        textDecoration: 'none',
        fontSize:       '13.5px',
        fontWeight:     active ? '600' : '400',
        // Actif  : fond vert + texte blanc
        // Hover  : fond légèrement vert
        // Repos  : transparent
        color:          active ? C.blanc : hov ? C.texte : C.texteClair,
        background:     active
          ? `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`
          : hov ? 'rgba(90,191,42,0.10)' : 'transparent',
        boxShadow:      active
          ? '0 4px 14px rgba(90,191,42,0.35)'
          : 'none',
        transition:     'all 0.2s ease',
        // Barre dorée à gauche sur lien actif
        borderLeft:     active
          ? `3px solid ${C.or}`
          : '3px solid transparent',
      }}
    >
      {/* Icône */}
      <span style={{ fontSize: '16px', flexShrink: 0 }}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

// ─────────────────────────────────────────
// LAYOUT ADMIN
// Structure :
// ┌──────────┬──────────────────────────┐
// │ Sidebar  │  Contenu (Outlet)        │
// │ (menu)   │                          │
// └──────────┴──────────────────────────┘
// ─────────────────────────────────────────
function AdminLayout() {
  const location             = useLocation();
  const navigate             = useNavigate();
  const { user, deconnecter, estAdmin } = useAuth();
  const [sidebarOpen, setSidebar] = useState(false);

  // ─────────────────────────────────────────
  // Protection de la route admin
  // Si l'utilisateur n'est pas admin
  // on le redirige vers l'accueil
  // ─────────────────────────────────────────
  if (!estAdmin) {
    navigate('/');
    return null;
  }

  const handleDeconnexion = () => {
    deconnecter();
    navigate('/');
  };

  return (
    <div style={{
      display:    'flex',
      minHeight:  '100vh',
      background: C.fond,
      color:      C.texte,
      fontFamily: 'system-ui, sans-serif',
    }}>

      {/* ════════════════════════════════════
          SIDEBAR — menu latéral
          Fixe sur desktop, drawer sur mobile
      ════════════════════════════════════ */}
      <aside style={{
        width:          '240px',
        flexShrink:     0,
        background:     C.sidebar,
        borderRight:    `1px solid ${C.bordure}`,
        display:        'flex',
        flexDirection:  'column',
        position:       'sticky',
        top:            0,
        height:         '100vh',
        overflowY:      'auto',
        // Sur mobile : caché par défaut
        // (géré via className ci-dessous)
      }}
        className="hidden lg:flex"
      >
        {/* Logo dans la sidebar */}
        <div style={{
          padding:      '24px 20px 20px',
          borderBottom: `1px solid ${C.bordure}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width:          '38px', height: '38px',
              borderRadius:   '50%',
              background:     `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
              display:        'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow:      '0 3px 10px rgba(90,191,42,0.40)',
              flexShrink:     0,
            }}>
              <img src="/images/logo2.png" alt="Nasoo"
                style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '10px', color: C.texteClair, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Admin
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: C.or, fontFamily: 'Georgia, serif' }}>
                Nasoo
              </div>
            </div>
          </div>

          {/* Info utilisateur connecté */}
          <div style={{
            marginTop:    '14px',
            padding:      '10px 12px',
            borderRadius: '8px',
            background:   'rgba(90,191,42,0.08)',
            border:       `1px solid ${C.bordure}`,
          }}>
            <div style={{ fontSize: '11px', color: C.texteClair, marginBottom: '2px' }}>
              Connecté en tant que
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: C.vert }}>
              {user?.username}
            </div>
          </div>
        </div>

        {/* Liens de navigation */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ fontSize: '10px', color: C.texteClair, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
            Navigation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {MENU_LINKS.map(({ to, label, icon }) => (
              <MenuLink
                key={to}
                to={to}
                label={label}
                icon={icon}
                active={location.pathname === to}
              />
            ))}
          </div>
        </nav>

        {/* Bouton déconnexion en bas */}
        <div style={{ padding: '16px 12px', borderTop: `1px solid ${C.bordure}` }}>
          <button
            onClick={handleDeconnexion}
            style={{
              width:          '100%',
              display:        'flex',
              alignItems:     'center',
              gap:            '10px',
              padding:        '10px 16px',
              borderRadius:   '10px',
              border:         '1px solid rgba(229,53,53,0.25)',
              background:     'rgba(229,53,53,0.08)',
              color:          C.rouge,
              fontSize:       '13px',
              fontWeight:     '500',
              cursor:         'pointer',
              transition:     'all 0.2s ease',
            }}
          >
            <FiLogOut style={{ fontSize: '15px' }} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════
          CONTENU PRINCIPAL
          Outlet = la page active
          (Dashboard, Produits, etc.)
      ════════════════════════════════════ */}
      <main style={{ flex: 1, overflowX: 'hidden' }}>

        {/* Barre du haut */}
        <div style={{
          padding:        '0 28px',
          height:         '64px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          borderBottom:   `1px solid ${C.bordure}`,
          background:     C.sidebar,
          position:       'sticky',
          top:            0,
          zIndex:         10,
        }}>
          <h1 style={{
            fontSize:   '16px',
            fontWeight: '600',
            color:      C.texte,
            margin:     0,
          }}>
            {/* Titre dynamique selon la page */}
            {location.pathname === '/admin'            && 'Dashboard'}
            {location.pathname === '/admin/produits'   && 'Gestion des produits'}
            {location.pathname === '/admin/commandes'  && 'Gestion des commandes'}
            {location.pathname === '/admin/users'      && 'Utilisateurs'}
          </h1>

          {/* Lien retour au site */}
          <Link to="/" style={{
            fontSize:       '12.5px',
            color:          C.texteClair,
            textDecoration: 'none',
            padding:        '6px 12px',
            borderRadius:   '8px',
            border:         `1px solid ${C.bordure}`,
            transition:     'all 0.2s',
          }}>
            ← Retour au site
          </Link>
        </div>

        {/* Zone de contenu — Outlet affiche
            la page correspondant à la route */}
        <div style={{ padding: '28px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;