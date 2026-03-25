import React from 'react'
import { Link } from 'react-router-dom';
import {
  FaFacebookF, FaInstagram, FaTiktok,
  FaWhatsapp, FaMapMarkerAlt, FaPhoneAlt,
  FaEnvelope, FaClock,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiSend } from 'react-icons/fi';

const C = {
  fondFooter:    '#1A2E0E',
  vertLogo:      '#5ABF2A',
  vertLogoClr:   '#90D840', 
  or:            '#D4A017', 
  orClair:       '#F2C040', 
  orFonce:       '#B88010', 
  blanc:         '#FFFFFF', 
  blancFort:     'rgba(255,255,255,0.90)',
  blancMoyen:    'rgba(255,255,255,0.68)', 
  blancFaible:   'rgba(255,255,255,0.40)', 
  blancTresFbl:  'rgba(255,255,255,0.22)', 
  icone:         'rgba(255,255,255,0.55)', 
  inputFond:     'rgba(255,255,255,0.07)', 
  inputBordure:  'rgba(255,255,255,0.18)', 
  reseauFond:    'rgba(255,255,255,0.09)',
  reseauBordure: 'rgba(255,255,255,0.18)', 
};

const NAV_LINKS = [
  { to: '/',         label: 'Accueil'  },
  { to: '/produits', label: 'Produits' },
  { to: '/apropos', label: 'À propos' },
  { to: '/contact',  label: 'Contact'  },
];

const SOCIAL_LINKS = [
  { href: '#', icon: <FaFacebookF />, label: 'Facebook'  },
  { href: '#', icon: <FaInstagram />, label: 'Instagram' },
  { href: '#', icon: <FaXTwitter />,  label: 'X'         },
  { href: '#', icon: <FaTiktok />,    label: 'TikTok'    },
  { href: '#', icon: <FaWhatsapp />,  label: 'WhatsApp'  },
];

const CONTACT_ITEMS = [
  { icon: <FaMapMarkerAlt />, text: "Ouagadougou, Dassasgo\nface à l'ENAM", multiline: true },
  { icon: <FaPhoneAlt />,    text: '70 12 34 56 / 71 23 45 67' },
  { icon: <FaEnvelope />,    text: 'contact@laiterienasoo.bf'   },
  { icon: <FaClock />,       text: 'Mar–Sam : 7h – 22h30'      },
];

// ─────────────────────────────────────────────────────────────
// Composant titre de colonne (blanc + trait qui s'efface)
// ─────────────────────────────────────────────────────────────
function ColTitle({ children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '18px',
    }}>
      <h3 style={{
        fontSize: '14.5px',
        fontWeight: '700',
        color: C.blanc,
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
        margin: 0,
      }}>
        {children}
      </h3>
      {/* Trait dégradé blanc → transparent */}
      <div style={{
        flex: 1,
        height: '1.5px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.25), transparent)',
        borderRadius: '99px',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant icône réseau social
// ─────────────────────────────────────────────────────────────
function SocialIcon({ href, icon, label }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: hovered
          ? `linear-gradient(135deg, ${C.orClair}, ${C.orFonce})`
          : C.reseauFond,
        border: `1px solid ${hovered ? C.or : C.reseauBordure}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: hovered ? C.fondFooter : C.blancMoyen,
        transform: hovered ? 'translateY(-3px) scale(1.10)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? `0 7px 20px rgba(212,160,23,0.55)` : 'none',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      {icon}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant lien de navigation
// ─────────────────────────────────────────────────────────────
function NavLink({ to, label }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        color: hovered ? C.orClair : C.blancMoyen,
        fontSize: '13.5px',
        padding: '5px 0',
        textDecoration: 'none',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.2s ease-out',
      }}
    >
      <span style={{
        color: hovered ? C.orClair : 'rgba(255,255,255,0.30)',
        fontSize: '17px',
        fontWeight: '700',
        lineHeight: 1,
        transition: 'color 0.2s',
      }}>›</span>
      {label}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// Composant item de contact
// ─────────────────────────────────────────────────────────────
function ContactItem({ icon, text, multiline }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '11px',
        fontSize: '13px',
        color: hovered ? C.blanc : C.blancMoyen,
        listStyle: 'none',
        transition: 'color 0.22s',
        cursor: 'default',
      }}
    >
      <span style={{
        marginTop: '2px',
        flexShrink: 0,
        fontSize: '13px',
        color: hovered ? C.orClair : C.icone,
        transition: 'color 0.22s',
      }}>
        {icon}
      </span>
      {multiline
        ? <span style={{ whiteSpace: 'pre-line' }}>{text}</span>
        : <span>{text}</span>
      }
    </li>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER PRINCIPAL
// ─────────────────────────────────────────────────────────────
function Footer() {
  const [btnHovered, setBtnHovered] = React.useState(false);

  return (
    <footer style={{
      backgroundColor: C.fondFooter,
      marginTop: 'auto',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Liseré dégradé vert → or en haut ───────────────── */}
      <div style={{
        height: '3.5px',
        background: `linear-gradient(90deg, ${C.vertLogo}, ${C.vertLogoClr}, ${C.or}, ${C.vertLogoClr}, ${C.vertLogo})`,
      }} />

      {/* ── Cercles décoratifs de profondeur ────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '260px', height: '260px', borderRadius: '50%',
        background: 'rgba(90,191,42,0.05)',
        filter: 'blur(60px)',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'rgba(212,160,23,0.05)',
        filter: 'blur(70px)',
        transform: 'translate(33%,33%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '44px 28px 0',
        position: 'relative',
      }}>

        {/* ════════════════════════════════════════════════════
            GRILLE 4 COLONNES
        ════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '36px 28px',
        }}>

          {/* ── COL 1 : À PROPOS ─────────────────────────────── */}
          <div>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center',
              gap: '12px', marginBottom: '16px',
              textDecoration: 'none',
            }}>
              {/* Cercle logo vert 3D */}
              <div style={{
                position: 'relative',
                width: '46px', height: '46px',
                borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${C.vertLogo}, ${C.vertLogoClr})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px rgba(90,191,42,0.44), inset 0 2px 2px rgba(255,255,255,0.35)`,
              }}>
                {/* Reflet brillant */}
                <div style={{
                  position: 'absolute', top: '6px',
                  left: '50%', transform: 'translateX(-50%)',
                  width: '18px', height: '7px',
                  background: 'rgba(255,255,255,0.30)',
                  borderRadius: '50%',
                }} />
                <img
                  src="/images/logo2.png"
                  alt="Nasoo"
                  style={{ width: '36px', height: '36px', objectFit: 'contain' }}
                />
              </div>
              {/* Texte logo */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{
                  fontWeight: '600', color: 'rgba(255,255,255,0.55)',
                  fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                }}>
                  Laiterie
                </span>
                <span style={{
                  fontWeight: '800', color: C.orClair,
                  fontSize: '19px', fontFamily: 'Georgia, serif',
                  letterSpacing: '0.3px',
                }}>
                  Nasoo
                </span>
              </div>
            </Link>

            {/* Description */}
            <p style={{
              fontSize: '13px', color: C.blancMoyen,
              lineHeight: '1.75', marginBottom: '12px',
            }}>
              Produits laitiers et fastfood à Ouagadougou.
              Tradition et qualité au service de votre table.
            </p>

            {/* Badge "Depuis 2020" */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(212,160,23,0.12)',
              border: `1px solid rgba(212,160,23,0.30)`,
              color: C.orClair, fontSize: '11px', fontWeight: '600',
              padding: '3px 10px', borderRadius: '99px',
            }}>
              <FaClock style={{ fontSize: '10px' }} />
              Depuis 2020
            </span>
          </div>

          {/* ── COL 2 : LIENS UTILES ─────────────────────────── */}
          <div>
            <ColTitle>Liens utiles</ColTitle>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} label={label} />
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3 : CONTACT ──────────────────────────────── */}
          <div>
            <ColTitle>Contact</ColTitle>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {CONTACT_ITEMS.map(({ icon, text, multiline }, i) => (
                <ContactItem key={i} icon={icon} text={text} multiline={multiline} />
              ))}
            </ul>
          </div>

          {/* ── COL 4 : RÉSEAUX + NEWSLETTER ────────────────── */}
          <div>
            <ColTitle>Suivez-nous</ColTitle>

            {/* Icônes réseaux */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '22px' }}>
              {SOCIAL_LINKS.map(({ href, icon, label }) => (
                <SocialIcon key={label} href={href} icon={icon} label={label} />
              ))}
            </div>

            {/* Label newsletter */}
            <p style={{
              fontSize: '11px', fontWeight: '600',
              color: 'rgba(255,255,255,0.50)',
              textTransform: 'uppercase', letterSpacing: '0.5px',
              marginBottom: '9px',
            }}>
              Newsletter
            </p>

            {/* Input + bouton */}
            <div style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="Votre adresse email"
                style={{
                  flex: 1, minWidth: 0,
                  background: C.inputFond,
                  border: `1px solid ${C.inputBordure}`,
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  color: C.blanc,
                  outline: 'none',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.40)';
                  e.target.style.background = 'rgba(255,255,255,0.10)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = C.inputBordure;
                  e.target.style.background = C.inputFond;
                }}
              />
              <button
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  background: `linear-gradient(135deg, ${C.orClair}, ${C.or}, ${C.orFonce})`,
                  color: C.fondFooter,
                  fontSize: '12.5px', fontWeight: '700',
                  padding: '8px 16px',
                  borderRadius: '0 8px 8px 0',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  whiteSpace: 'nowrap',
                  boxShadow: btnHovered
                    ? '0 6px 18px rgba(212,160,23,0.60)'
                    : '0 3px 12px rgba(212,160,23,0.45)',
                  transform: btnHovered ? 'translateY(-1px)' : 'translateY(0)',
                  transition: 'all 0.22s ease-out',
                }}
              >
                <FiSend style={{ fontSize: '12px' }} />
                OK
              </button>
            </div>

            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '7px' }}>
              Offres et nouveautés en avant-première.
            </p>
          </div>

        </div>

        {/* ── Séparateur blanc/or ───────────────────────────── */}
        <div style={{
          height: '1px',
          margin: '32px 0',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), rgba(212,160,23,0.22), rgba(255,255,255,0.12), transparent)',
        }} />

        {/* ── Copyright ─────────────────────────────────────── */}
        <div style={{ textAlign: 'center', paddingBottom: '32px' }}>
          <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.40)' }}>
            © {new Date().getFullYear()}{' '}
            <span style={{ color: C.orClair, fontWeight: '600' }}>Laiterie Nasoo</span>
            {' '}— Tous droits réservés
          </p>
          <p style={{ marginTop: '7px', fontSize: '11.5px', color: 'rgba(255,255,255,0.28)' }}>
            Site conçu et développé par{' '}
            <span style={{ color: 'rgba(255,255,255,0.58)', fontWeight: '600' }}>
              Abdrafith ZONGO
            </span>
          </p>
          <p style={{ marginTop: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.18)' }}>
            Ouagadougou, Burkina Faso
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;