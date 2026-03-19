import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// PALETTE — cohérente avec Header et Footer
// ─────────────────────────────────────────────────────────────
const C = {
  fond:        '#F8FDF2',   // fond page
  blanc:       '#FFFFFF',
  texte:       '#2D4A1E',   // vert foncé principal
  texteClair:  '#5A7A40',   // vert moyen
  texteTres:   '#1A2E0E',   // très foncé
  vert:        '#5ABF2A',   // vert vif
  vertClair:   '#90D840',   // vert lumineux
  vertFonce:   '#1E5A08',   // vert actif
  or:          '#D4A017',   // or principal
  orClair:     '#F2C040',   // or clair
  orFonce:     '#B88010',   // or foncé
  bordure:     '#C6E4A0',   // bordure verte pâle
  bordureFoc:  '#5ABF2A',   // bordure focus
  rouge:       '#E53535',   // erreur
  placeholder: '#8AAA70',   // placeholder inputs
};

// ─────────────────────────────────────────────────────────────
// Champ de formulaire réutilisable
// ─────────────────────────────────────────────────────────────
function Field({ label, type = 'text', placeholder, value, onChange, icon }) {
  const [focus, setFocus] = useState(false);

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Label */}
      <label style={{
        display:       'block',
        fontSize:      '12.5px',
        fontWeight:    '600',
        color:         focus ? C.vertFonce : C.texteClair,
        marginBottom:  '6px',
        letterSpacing: '0.3px',
        transition:    'color 0.2s',
      }}>
        {label}
      </label>

      {/* Wrapper input + icône */}
      <div style={{ position: 'relative' }}>
        {/* Icône à gauche */}
        {icon && (
          <span style={{
            position:      'absolute',
            left:          '13px',
            top:           '50%',
            transform:     'translateY(-50%)',
            color:         focus ? C.vert : C.placeholder,
            fontSize:      '15px',
            pointerEvents: 'none',
            transition:    'color 0.2s',
          }}>
            {icon}
          </span>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={()  => setFocus(false)}
          style={{
            width:        '100%',
            background:   focus ? C.blanc : 'rgba(255,255,255,0.7)',
            border:       `1.5px solid ${focus ? C.bordureFoc : C.bordure}`,
            borderRadius: '10px',
            padding:      icon ? '10px 14px 10px 40px' : '10px 14px',
            fontSize:     '13.5px',
            color:        C.texte,
            outline:      'none',
            boxSizing:    'border-box',
            boxShadow:    focus
              ? `0 0 0 3px rgba(90,191,42,0.14), 0 2px 8px rgba(90,191,42,0.10)`
              : '0 1px 4px rgba(30,90,8,0.06)',
            transition:   'all 0.2s ease',
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bouton principal doré
// ─────────────────────────────────────────────────────────────
function BtnOr({ onClick, children, fullWidth = true }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:          fullWidth ? '100%' : 'auto',
        padding:        '12px 28px',
        borderRadius:   '11px',
        border:         '1px solid rgba(184,128,16,0.22)',
        background:     `linear-gradient(155deg, ${C.orClair}, ${C.or}, ${C.orFonce})`,
        color:          C.texteTres,
        fontSize:       '14px',
        fontWeight:     '700',
        cursor:         'pointer',
        letterSpacing:  '0.4px',
        boxShadow:      hov
          ? '0 8px 24px rgba(212,160,23,0.55), 0 2px 6px rgba(180,130,0,0.30)'
          : '0 4px 16px rgba(212,160,23,0.45), inset 0 1px 1px rgba(255,240,170,0.50)',
        transform:      hov ? 'translateY(-2px)' : 'translateY(0)',
        transition:     'all 0.22s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Bouton secondaire vert
// ─────────────────────────────────────────────────────────────
function BtnVert({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:        '10px 22px',
        borderRadius:   '10px',
        border:         `1.5px solid ${hov ? C.vert : C.bordure}`,
        background:     hov ? 'rgba(90,191,42,0.10)' : 'transparent',
        color:          hov ? C.vertFonce : C.texteClair,
        fontSize:       '13.5px',
        fontWeight:     '600',
        cursor:         'pointer',
        boxShadow:      hov ? '0 3px 10px rgba(90,191,42,0.18)' : 'none',
        transform:      hov ? 'translateY(-1px)' : 'translateY(0)',
        transition:     'all 0.2s ease',
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE COMPTE
// ─────────────────────────────────────────────────────────────
function Compte() {
  const navigate = useNavigate();

  // Mode actif : 'connexion' ou 'inscription'
  const [mode, setMode] = useState('connexion');

  // ── Champs connexion ──
  const [loginEmail, setLoginEmail]   = useState('');
  const [loginPass,  setLoginPass]    = useState('');
  const [loginErr,   setLoginErr]     = useState('');

  // ── Champs inscription ──
  const [reg, setReg] = useState({
    prenom: '', nom: '', username: '',
    email: '', telephone: '', password: '', confirm: '',
  });
  const [regErr, setRegErr] = useState('');

  const setRegField = (key, val) =>
    setReg(prev => ({ ...prev, [key]: val }));

  // ────────────────────────────────────────────────
  // Simulation connexion (à remplacer par API réelle)
  // ────────────────────────────────────────────────
  const handleConnexion = () => {
    setLoginErr('');
    if (!loginEmail || !loginPass) {
      setLoginErr('Veuillez remplir tous les champs.');
      return;
    }
    // Simulation : admin si email contient "admin"
    if (loginEmail.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // ────────────────────────────────────────────────
  // Simulation inscription (à remplacer par API réelle)
  // ────────────────────────────────────────────────
  const handleInscription = () => {
    setRegErr('');
    const { prenom, nom, username, email, telephone, password, confirm } = reg;
    if (!prenom || !nom || !username || !email || !telephone || !password || !confirm) {
      setRegErr('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirm) {
      setRegErr('Les mots de passe ne correspondent pas.');
      return;
    }
    // Après inscription → connexion auto → page d'accueil
    navigate('/');
  };

  // ────────────────────────────────────────────────
  // Icônes SVG inline (pas de dépendance externe)
  // ────────────────────────────────────────────────
  const IconMail = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
  const IconLock = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
  const IconUser = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
  const IconPhone = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.62 19 19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.27 6.27l1.91-1.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
  const IconTag = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );

  return (
    <div style={{
      minHeight:       '100vh',
      background:      C.fond,
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         '40px 16px',
      // Cercles décoratifs en fond
      position:        'relative',
      overflow:        'hidden',
    }}>

      {/* ── Décors de fond ─────────────────────────────────── */}
      <div style={{
        position:     'absolute', top: '-80px', left: '-80px',
        width:        '320px', height: '320px', borderRadius: '50%',
        background:   'rgba(90,191,42,0.06)', filter: 'blur(60px)',
        pointerEvents:'none',
      }} />
      <div style={{
        position:     'absolute', bottom: '-60px', right: '-60px',
        width:        '280px', height: '280px', borderRadius: '50%',
        background:   'rgba(212,160,23,0.07)', filter: 'blur(60px)',
        pointerEvents:'none',
      }} />

      {/* ══════════════════════════════════════════════════════
          CARTE PRINCIPALE
      ══════════════════════════════════════════════════════ */}
      <div style={{
        width:        '100%',
        maxWidth:     '460px',
        background:   C.blanc,
        borderRadius: '20px',
        border:       `1px solid ${C.bordure}`,
        boxShadow:    '0 8px 40px rgba(30,90,8,0.10), 0 2px 8px rgba(30,90,8,0.06)',
        overflow:     'hidden',
        position:     'relative',
        zIndex:       1,
      }}>

        {/* Liseré vert-or en haut de la carte */}
        <div style={{
          height:     '4px',
          background: `linear-gradient(90deg,
            ${C.vert}, ${C.vertClair}, ${C.or}, ${C.vertClair}, ${C.vert})`,
        }} />

        <div style={{ padding: '32px 36px 36px' }}>

          {/* ── Logo + titre ─────────────────────────────────── */}
          <div style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            marginBottom:   '28px',
          }}>
            {/* Cercle logo */}
            <div style={{
              position:       'relative',
              width:          '60px', height: '60px',
              borderRadius:   '50%',
              background:     `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 5px 18px rgba(80,180,40,0.42), inset 0 2px 3px rgba(255,255,255,0.40)',
              marginBottom:   '14px',
            }}>
              <div style={{
                position:     'absolute', top: '6px',
                left:         '50%', transform: 'translateX(-50%)',
                width:        '24px', height: '8px',
                background:   'rgba(255,255,255,0.30)', borderRadius: '50%',
              }} />
              <img
                src="/images/logo2.png"
                alt="Nasoo"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
              />
            </div>

            {/* Titre */}
            <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
              <div style={{
                fontSize:      '11px', fontWeight: '600',
                color:         C.texteClair, letterSpacing: '2.5px',
                textTransform: 'uppercase', marginBottom: '2px',
              }}>
                Laiterie
              </div>
              <div style={{
                fontSize:   '22px', fontWeight: '800',
                color:      C.or, fontFamily: 'Georgia, serif',
              }}>
                Nasoo
              </div>
            </div>
          </div>

          {/* ── Sélecteur de mode (Connexion / Inscription) ──── */}
          <div style={{
            display:      'flex',
            background:   C.fond,
            borderRadius: '12px',
            padding:      '4px',
            marginBottom: '28px',
            border:       `1px solid ${C.bordure}`,
          }}>
            {['connexion', 'inscription'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setLoginErr(''); setRegErr(''); }}
                style={{
                  flex:         1,
                  padding:      '9px',
                  borderRadius: '9px',
                  border:       'none',
                  fontSize:     '13px',
                  fontWeight:   '600',
                  cursor:       'pointer',
                  letterSpacing:'0.3px',
                  transition:   'all 0.22s ease',
                  // Actif : fond blanc avec ombre + texte vert foncé
                  background:   mode === m
                    ? C.blanc
                    : 'transparent',
                  color:        mode === m ? C.vertFonce : C.texteClair,
                  boxShadow:    mode === m
                    ? '0 2px 8px rgba(30,90,8,0.10)'
                    : 'none',
                }}
              >
                {m === 'connexion' ? 'Se connecter' : "S'inscrire"}
              </button>
            ))}
          </div>

          {/* ════════════════════════════════════════════════════
              MODE CONNEXION
          ════════════════════════════════════════════════════ */}
          {mode === 'connexion' && (
            <div>
              <Field
                label="Adresse email"
                type="email"
                placeholder="votre@email.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                icon={IconMail}
              />
              <Field
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                icon={IconLock}
              />

              {/* Lien mot de passe oublié */}
              <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '-8px' }}>
                <button style={{
                  background: 'none', border: 'none',
                  color: C.texteClair, fontSize: '12.5px',
                  cursor: 'pointer', textDecoration: 'underline',
                }}>
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Message d'erreur */}
              {loginErr && (
                <div style={{
                  background:   'rgba(229,53,53,0.08)',
                  border:       `1px solid rgba(229,53,53,0.30)`,
                  borderRadius: '8px',
                  padding:      '10px 14px',
                  marginBottom: '16px',
                  fontSize:     '13px',
                  color:        C.rouge,
                }}>
                  {loginErr}
                </div>
              )}

              {/* Bouton connexion */}
              <BtnOr onClick={handleConnexion}>
                Se connecter
              </BtnOr>

              {/* Séparateur */}
              <div style={{
                display:    'flex', alignItems: 'center',
                gap:        '12px', margin: '22px 0',
              }}>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
                <span style={{ fontSize: '12px', color: C.placeholder }}>ou</span>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
              </div>

              {/* Lien vers inscription */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: C.texteClair }}>
                  Pas encore de compte ?{' '}
                </span>
                <button
                  onClick={() => setMode('inscription')}
                  style={{
                    background:     'none',
                    border:         'none',
                    color:          C.vertFonce,
                    fontSize:       '13px',
                    fontWeight:     '600',
                    cursor:         'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  S'inscrire
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════
              MODE INSCRIPTION
          ════════════════════════════════════════════════════ */}
          {mode === 'inscription' && (
            <div>
              {/* Prénom + Nom côte à côte */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field
                  label="Prénom"
                  placeholder="Yasmine"
                  value={reg.prenom}
                  onChange={e => setRegField('prenom', e.target.value)}
                  icon={IconUser}
                />
                <Field
                  label="Nom"
                  placeholder="TRAORE"
                  value={reg.nom}
                  onChange={e => setRegField('nom', e.target.value)}
                  icon={IconUser}
                />
              </div>

              <Field
                label="Nom d'utilisateur"
                placeholder="Yassi"
                value={reg.username}
                onChange={e => setRegField('username', e.target.value)}
                icon={IconTag}
              />
              <Field
                label="Adresse email"
                type="email"
                placeholder="votre@email.com"
                value={reg.email}
                onChange={e => setRegField('email', e.target.value)}
                icon={IconMail}
              />
              <Field
                label="Téléphone"
                type="tel"
                placeholder="70123456"
                value={reg.telephone}
                onChange={e => setRegField('telephone', e.target.value)}
                icon={IconPhone}
              />

              {/* Mot de passe + Confirmation côte à côte */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field
                  label="Mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={reg.password}
                  onChange={e => setRegField('password', e.target.value)}
                  icon={IconLock}
                />
                <Field
                  label="Confirmer"
                  type="password"
                  placeholder="••••••••"
                  value={reg.confirm}
                  onChange={e => setRegField('confirm', e.target.value)}
                  icon={IconLock}
                />
              </div>

              {/* Message d'erreur */}
              {regErr && (
                <div style={{
                  background:   'rgba(229,53,53,0.08)',
                  border:       `1px solid rgba(229,53,53,0.30)`,
                  borderRadius: '8px',
                  padding:      '10px 14px',
                  marginBottom: '16px',
                  fontSize:     '13px',
                  color:        C.rouge,
                }}>
                  {regErr}
                </div>
              )}

              {/* Bouton inscription */}
              <BtnOr onClick={handleInscription}>
                Créer mon compte
              </BtnOr>

              {/* Séparateur */}
              <div style={{
                display:    'flex', alignItems: 'center',
                gap:        '12px', margin: '22px 0',
              }}>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
                <span style={{ fontSize: '12px', color: C.placeholder }}>ou</span>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
              </div>

              {/* Lien vers connexion */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: C.texteClair }}>
                  Déjà un compte ?{' '}
                </span>
                <button
                  onClick={() => setMode('connexion')}
                  style={{
                    background:     'none',
                    border:         'none',
                    color:          C.vertFonce,
                    fontSize:       '13px',
                    fontWeight:     '600',
                    cursor:         'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Se connecter
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Compte;