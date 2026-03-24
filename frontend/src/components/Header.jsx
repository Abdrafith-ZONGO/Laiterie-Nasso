import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const C = {
  fondHeader:  '#FFFFFF',
  fondDrawer:  '#FFFFFF',
  texte:       '#2D4A1E',
  texteSombre: '#1A2E0E',
  vert:        '#5ABF2A',
  vertClair:   '#90D840',
  vertFonce:   '#1E5A08',
  or:          '#D4A017',
  orClair:     '#F2C040',
  orFonce:     '#B88010',
  bordure:     '#C6E4A0',
  rouge:       '#E53535',
  blanc:       '#FFFFFF',
};

const NAV_LINKS = [
  { to: '/',         label: 'Accueil'  },
  { to: '/produits', label: 'Produits' },
  { to: '/histoire', label: 'Histoire' },
  { to: '/contact',  label: 'Contact'  },
];

const useHover = (base, hover) => {
  const [h, setH] = useState(false);
  return {
    handlers: { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) },
    style: { ...base, ...(h ? hover : {}) },
  };
};

function NavLink({ to, label, active }) {
  const { handlers, style } = useHover(
    {
      position: 'relative', display: 'inline-flex', alignItems: 'center',
      textDecoration: 'none', fontSize: '13.5px',
      fontWeight: active ? '600' : '500', padding: '7px 16px',
      borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap',
      color: active ? C.vertFonce : '#2D6010',
      background: active ? 'rgba(90,191,42,0.16)' : 'rgba(90,191,42,0.07)',
      border: active ? '1px solid rgba(90,191,42,0.45)' : '1px solid rgba(90,191,42,0.20)',
      boxShadow: active
        ? '0 3px 10px rgba(90,191,42,0.25), inset 0 1px 0 rgba(255,255,255,0.90)'
        : '0 2px 6px rgba(90,191,42,0.14), inset 0 1px 0 rgba(255,255,255,0.80)',
      transform: 'translateY(0)', transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
    },
    {
      color: C.vertFonce, background: 'rgba(90,191,42,0.13)',
      border: '1px solid rgba(90,191,42,0.35)',
      boxShadow: '0 5px 14px rgba(90,191,42,0.22), inset 0 1px 0 rgba(255,255,255,0.90)',
      transform: 'translateY(-2px)',
    }
  );
  return (
    <Link to={to} {...handlers} style={style}>
      {label}
      {active && (
        <span style={{
          position: 'absolute', bottom: '4px', left: '50%',
          transform: 'translateX(-50%)', width: '20px', height: '2.5px',
          borderRadius: '99px', background: 'linear-gradient(90deg, #D4A017, #F2C040)',
        }} />
      )}
    </Link>
  );
}

function IconBtn({ onClick, children, ariaLabel }) {
  const { handlers, style } = useHover(
    {
      width: '38px', height: '38px', borderRadius: '10px',
      border: `1.5px solid ${C.bordure}`, background: C.blanc,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0,
      boxShadow: '0 2px 6px rgba(80,180,40,0.10)',
      transform: 'translateY(0)', transition: 'all 0.2s ease-out',
    },
    {
      border: '1.5px solid rgba(90,191,42,0.50)',
      background: 'rgba(90,191,42,0.09)',
      boxShadow: '0 4px 14px rgba(80,180,40,0.20)',
      transform: 'translateY(-1px)',
    }
  );
  return (
    <button onClick={onClick} aria-label={ariaLabel} {...handlers} style={style}>
      {children}
    </button>
  );
}

function DrawerLink({ to, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to} onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 20px',
        paddingLeft: active ? '17px' : hov ? '24px' : '20px',
        fontSize: '14px', fontWeight: active ? '600' : '500',
        color: active || hov ? C.vertFonce : C.texte,
        textDecoration: 'none',
        background: active ? 'rgba(90,191,42,0.10)' : hov ? 'rgba(90,191,42,0.06)' : 'transparent',
        borderBottom: `1px solid rgba(198,228,160,0.35)`,
        borderLeft: active ? `3px solid ${C.or}` : '3px solid transparent',
        transition: 'all 0.18s ease',
      }}
    >
      {label}
      <span style={{
        color: active || hov ? C.or : C.bordure,
        fontSize: '18px', fontWeight: '700', transition: 'color 0.18s', lineHeight: 1,
      }}>›</span>
    </Link>
  );
}

// ─────────────────────────────────────────
// HEADER — reçoit totalArticles en prop
// ─────────────────────────────────────────
function Header({ totalArticles = 0 }) {
  const location = useLocation();
  const [menuOpen, setMenu]   = useState(false);
  const [states,   setStates] = useState({
    cart: false, compte: false, logo: false, search: false,
  });

  const { user, deconnecter, estConnecte } = useAuth();

  const toggle    = (key, val) => setStates(prev => ({ ...prev, [key]: val }));
  const closeMenu = () => setMenu(false);

  const handleDeconnexion = () => {
    deconnecter();
    closeMenu();
  };

  return (
    <>
      {/* Animation badge */}
      <style>{`
        @keyframes popBadge {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.35); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <header style={{
        backgroundColor: C.fondHeader,
        borderBottom:    `1px solid ${C.bordure}`,
        position:        'sticky', top: 0, zIndex: 100,
        boxShadow:       '0 4px 24px rgba(30,90,8,0.09), 0 1px 4px rgba(30,90,8,0.06)',
      }}>
        {/* Liseré */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '3.5px', pointerEvents: 'none', opacity: 0.9,
          background: `linear-gradient(90deg, ${C.vert}, ${C.vertClair}, ${C.or}, ${C.vertClair}, ${C.vert})`,
        }} />

        <div style={{ width: '100%', padding: '0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '80px', gap: '16px' }}>

            {/* LOGO */}
            <Link
              to="/"
              onMouseEnter={() => toggle('logo', true)}
              onMouseLeave={() => toggle('logo', false)}
              style={{ display: 'flex', alignItems: 'center', gap: '13px', flexShrink: 0, textDecoration: 'none' }}
            >
              <div style={{
                position: 'relative', width: '62px', height: '62px',
                borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair}, ${C.vert})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 5px 20px rgba(80,180,40,0.46), 0 2px 5px rgba(40,140,10,0.28), inset 0 2px 3px rgba(255,255,255,0.48)',
                transform: states.logo ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease-out',
              }}>
                <div style={{
                  position: 'absolute', top: '6px', left: '50%',
                  transform: 'translateX(-50%)', width: '28px', height: '10px',
                  background: 'rgba(255,255,255,0.32)', borderRadius: '50%', pointerEvents: 'none',
                }} />
                <img src="/images/logo2.png" alt="Laiterie Nasoo"
                  style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontWeight: '600', color: C.texte, fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                  Laiterie
                </span>
                <span style={{ fontWeight: '800', color: C.or, fontSize: '24px', fontFamily: 'Georgia, serif', textShadow: '0 1px 4px rgba(200,154,16,0.18)' }}>
                  Nasoo
                </span>
              </div>
            </Link>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex" style={{ alignItems: 'center', gap: '6px', marginLeft: '16px', flexShrink: 0 }}>
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} label={label} active={location.pathname === to} />
              ))}
            </nav>

            <div style={{ flex: 1 }} />

            {/* RECHERCHE */}
            <div className="hidden md:block" style={{ width: '290px', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <FiSearch style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)', color: C.vert,
                  fontSize: '15px', pointerEvents: 'none',
                }} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  onFocus={() => toggle('search', true)}
                  onBlur={()  => toggle('search', false)}
                  style={{
                    width: '100%', background: C.blanc,
                    border: `1.5px solid ${states.search ? C.vert : C.bordure}`,
                    borderRadius: '999px', padding: '8px 16px 8px 38px',
                    fontSize: '13px', color: C.texte, outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: states.search
                      ? '0 0 0 3.5px rgba(90,191,42,0.15)'
                      : '0 2px 8px rgba(30,90,8,0.07)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* BOUTONS DROITE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginRight: '6px' }}>

              <div className="md:hidden">
                <IconBtn ariaLabel="Rechercher">
                  <FiSearch style={{ fontSize: '15px', color: C.vert }} />
                </IconBtn>
              </div>

              {/* COMPTE */}
              {estConnecte ? (
                <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px' }}>
                  <Link
                    to="/profil"
                    onMouseEnter={() => toggle('compte', true)}
                    onMouseLeave={() => toggle('compte', false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '10px',
                      border: `1.5px solid ${states.compte ? 'rgba(90,191,42,0.50)' : C.bordure}`,
                      background: states.compte ? 'rgba(90,191,42,0.09)' : C.blanc,
                      color: C.texte, fontSize: '12.5px', fontWeight: '600',
                      textDecoration: 'none', transition: 'all 0.2s ease-out',
                    }}
                  >
                    <FiUser style={{ fontSize: '14px', color: C.vert }} />
                    {user.username}
                  </Link>
                  <button
                    onClick={handleDeconnexion}
                    title="Se déconnecter"
                    style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      border: `1.5px solid rgba(229,53,53,0.25)`,
                      background: 'rgba(229,53,53,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                  >
                    <FiLogOut style={{ fontSize: '14px', color: C.rouge }} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/compte"
                  onMouseEnter={() => toggle('compte', true)}
                  onMouseLeave={() => toggle('compte', false)}
                  className="hidden lg:flex"
                  style={{
                    alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '10px',
                    border: `1.5px solid ${states.compte ? 'rgba(90,191,42,0.50)' : C.bordure}`,
                    background: states.compte ? 'rgba(90,191,42,0.09)' : C.blanc,
                    color: C.texte, fontSize: '12.5px', fontWeight: '500',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    boxShadow: states.compte ? '0 4px 14px rgba(80,180,40,0.20)' : '0 2px 6px rgba(80,180,40,0.10)',
                    transform: states.compte ? 'translateY(-1px)' : 'translateY(0)',
                    transition: 'all 0.2s ease-out',
                  }}
                >
                  <FiUser style={{ fontSize: '14px', color: C.vert }} />
                  Compte
                </Link>
              )}

              {/* PANIER avec badge dynamique */}
              <Link
                to="/panier"
                onMouseEnter={() => toggle('cart', true)}
                onMouseLeave={() => toggle('cart', false)}
                style={{
                  position:       'relative',
                  display:        'flex', alignItems: 'center', gap: '7px',
                  padding:        '9px 18px', borderRadius: '11px',
                  border:         '1px solid rgba(184,128,16,0.22)',
                  background:     `linear-gradient(155deg, ${C.orClair}, ${C.or}, ${C.orFonce})`,
                  color:          C.texteSombre,
                  fontSize:       '12.5px', fontWeight: '700',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  boxShadow:      states.cart
                    ? '0 8px 26px rgba(212,160,23,0.62)'
                    : '0 5px 18px rgba(212,160,23,0.52), inset 0 1px 2px rgba(255,240,170,0.55)',
                  transform:      states.cart ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition:     'all 0.2s ease-out',
                }}
              >
                <FiShoppingCart style={{ fontSize: '17px' }} />
                <span className="hidden lg:inline">Panier</span>

                {/* Badge rouge — visible seulement si totalArticles > 0 */}
                {totalArticles > 0 && (
                  <span
                    key={totalArticles} // ← key change = animation pop à chaque ajout
                    style={{
                      position:    'absolute', top: '-7px', right: '-7px',
                      minWidth:    '18px', height: '18px',
                      borderRadius:'99px', padding: '0 4px',
                      background:  C.rouge, color: C.blanc,
                      fontSize:    '9px', fontWeight: '800',
                      display:     'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow:   '0 2px 6px rgba(220,40,40,0.42)',
                      border:      `2px solid ${C.blanc}`,
                      animation:   'popBadge 0.25s ease',
                    }}
                  >
                    {totalArticles > 99 ? '99+' : totalArticles}
                  </span>
                )}
              </Link>

              {/* Hamburger mobile */}
              <div className="lg:hidden">
                <IconBtn onClick={() => setMenu(!menuOpen)} ariaLabel="Menu">
                  {menuOpen
                    ? <FiX    style={{ fontSize: '18px', color: C.texte }} />
                    : <FiMenu style={{ fontSize: '18px', color: C.texte }} />
                  }
                </IconBtn>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className="lg:hidden"
        onClick={closeMenu}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
          background: 'rgba(10,25,5,0.38)', backdropFilter: 'blur(2px)',
          zIndex: 98,
          opacity:       menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition:    'opacity 0.3s ease',
        }}
      />

      {/* DRAWER MOBILE */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed', top: '80px', right: 0,
          width: '300px', maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto', background: C.fondDrawer,
          zIndex: 99, borderRadius: '0 0 0 16px',
          border: `1px solid ${C.bordure}`,
          borderTop: 'none', borderRight: 'none',
          boxShadow: '-6px 6px 30px rgba(30,90,8,0.16)',
          transform:  menuOpen ? 'translateX(0)' : 'translateX(110%)',
          transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{
          height: '3px',
          background: `linear-gradient(90deg, ${C.vert}, ${C.vertClair}, ${C.or}, ${C.vertClair}, ${C.vert})`,
        }} />

        <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${C.bordure}` }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: C.vert,
              fontSize: '14px', pointerEvents: 'none',
            }} />
            <input type="text" placeholder="Rechercher..."
              style={{
                width: '100%', background: '#F8FDF2',
                border: `1.5px solid ${C.bordure}`, borderRadius: '999px',
                padding: '8px 14px 8px 34px', fontSize: '13px',
                color: C.texte, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div>
          {NAV_LINKS.map(({ to, label }) => (
            <DrawerLink key={to} to={to} label={label}
              active={location.pathname === to} onClick={closeMenu} />
          ))}
        </div>

        <div style={{
          padding: '14px 16px 18px',
          borderTop: `1px solid rgba(198,228,160,0.40)`,
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          {estConnecte ? (
            <>
              <Link to="/profil" onClick={closeMenu} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: '10px',
                border: `1.5px solid ${C.bordure}`, background: C.blanc,
                fontSize: '13.5px', color: C.texte, fontWeight: '600',
                textDecoration: 'none',
              }}>
                <FiUser style={{ color: C.vert, fontSize: '15px' }} />
                {user.username}
              </Link>
              <button onClick={handleDeconnexion} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: '10px',
                border: '1.5px solid rgba(229,53,53,0.25)',
                background: 'rgba(229,53,53,0.06)',
                fontSize: '13.5px', color: C.rouge, fontWeight: '500',
                cursor: 'pointer',
              }}>
                <FiLogOut style={{ fontSize: '15px' }} />
                Se déconnecter
              </button>
            </>
          ) : (
            <Link to="/compte" onClick={closeMenu} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px', borderRadius: '10px',
              border: `1.5px solid ${C.bordure}`, background: C.blanc,
              fontSize: '13.5px', color: C.texte, fontWeight: '500',
              textDecoration: 'none',
            }}>
              <FiUser style={{ color: C.vert, fontSize: '15px' }} />
              Mon compte
            </Link>
          )}

          {/* Panier drawer avec badge */}
          <Link to="/panier" onClick={closeMenu} style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '11px 20px', borderRadius: '11px',
            background: `linear-gradient(155deg, ${C.orClair}, ${C.or}, ${C.orFonce})`,
            color: C.texteSombre, fontSize: '13.5px', fontWeight: '700',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(212,160,23,0.45)',
          }}>
            <FiShoppingCart style={{ fontSize: '16px' }} />
            Mon panier
            {totalArticles > 0 && (
              <span style={{
                background: C.rouge, color: C.blanc, fontSize: '10px',
                fontWeight: '800', borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px',
              }}>
                {totalArticles > 99 ? '99+' : totalArticles}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;