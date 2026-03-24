import React, { useState } from 'react';
import { useNavigate }     from 'react-router-dom';
import { useAuth }         from '../context/AuthContext';

// ─────────────────────────────────────────
// PALETTE — cohérente avec le reste du site
// ─────────────────────────────────────────
const C = {
  fond:        '#F8FDF2',
  blanc:       '#FFFFFF',
  texte:       '#2D4A1E',
  texteClair:  '#5A7A40',
  vertFonce:   '#1E5A08',
  vert:        '#5ABF2A',
  vertClair:   '#90D840',
  or:          '#D4A017',
  orClair:     '#F2C040',
  orFonce:     '#B88010',
  bordure:     '#C6E4A0',
  rouge:       '#E53535',
  placeholder: '#8AAA70',
};

// ─────────────────────────────────────────
// Composant : champ de formulaire
// ─────────────────────────────────────────
function Field({ label, type = 'text', placeholder, value, onChange, icon }) {
  const [focus, setFocus] = useState(false);

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display:      'block',
        fontSize:     '12.5px',
        fontWeight:   '600',
        color:        focus ? C.vertFonce : C.texteClair,
        marginBottom: '6px',
        transition:   'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
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
            border:       `1.5px solid ${focus ? C.vert : C.bordure}`,
            borderRadius: '10px',
            padding:      icon ? '10px 14px 10px 40px' : '10px 14px',
            fontSize:     '13.5px',
            color:        C.texte,
            outline:      'none',
            boxSizing:    'border-box',
            boxShadow:    focus
              ? '0 0 0 3px rgba(90,191,42,0.14)'
              : '0 1px 4px rgba(30,90,8,0.06)',
            transition:   'all 0.2s ease',
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Composant : bouton doré principal
// ─────────────────────────────────────────
function BtnOr({ onClick, children, loading = false }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:         '100%',
        padding:       '12px 28px',
        borderRadius:  '11px',
        border:        '1px solid rgba(184,128,16,0.22)',
        background:    loading
          ? 'rgba(200,150,10,0.5)'
          : `linear-gradient(155deg, ${C.orClair}, ${C.or}, ${C.orFonce})`,
        color:         '#1A2E0E',
        fontSize:      '14px',
        fontWeight:    '700',
        cursor:        loading ? 'not-allowed' : 'pointer',
        boxShadow:     hov && !loading
          ? '0 8px 24px rgba(212,160,23,0.55)'
          : '0 4px 16px rgba(212,160,23,0.45)',
        transform:     hov && !loading ? 'translateY(-2px)' : 'translateY(0)',
        transition:    'all 0.22s ease',
      }}
    >
      {/* Affiche "Chargement..." pendant la requête API */}
      {loading ? 'Chargement...' : children}
    </button>
  );
}

// ─────────────────────────────────────────
// PAGE COMPTE
// ─────────────────────────────────────────
function Compte() {
  const navigate        = useNavigate();

  // ── Récupère les fonctions du Context ───
  // connecter() et inscrire() appellent
  // l'API et sauvegardent le token
  const { connecter, inscrire } = useAuth();

  // ── Mode actif : connexion ou inscription ─
  const [mode, setMode] = useState('connexion');

  // ── États de chargement et d'erreur ─────
  const [chargement, setChargement] = useState(false);
  const [erreur,     setErreur]     = useState('');

  // ── Champs connexion ────────────────────
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass,  setLoginPass]  = useState('');

  // ── Champs inscription ──────────────────
  const [reg, setReg] = useState({
    prenom: '', nom: '', username: '',
    email: '', telephone: '', password: '', confirm: '',
  });

  const setRegField = (key, val) =>
    setReg(prev => ({ ...prev, [key]: val }));

  // ─────────────────────────────────────────
  // CONNEXION
  // 1. Appelle connecter() du Context
  // 2. connecter() appelle l'API backend
  // 3. Sauvegarde token + user
  // 4. Redirige selon le rôle
  // ─────────────────────────────────────────
  const handleConnexion = async () => {
    setErreur('');

    if (!loginEmail || !loginPass) {
      setErreur('Veuillez remplir tous les champs.');
      return;
    }

    setChargement(true);
    try {
      const role = await connecter(loginEmail, loginPass);

      // Redirection selon le rôle
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Affiche le message d'erreur du backend
      setErreur(
        err.response?.data?.message || 'Erreur de connexion'
      );
    } finally {
      setChargement(false);
    }
  };

  // ─────────────────────────────────────────
  // INSCRIPTION
  // ─────────────────────────────────────────
  const handleInscription = async () => {
    setErreur('');

    const { prenom, nom, username, email, telephone, password, confirm } = reg;

    if (!prenom || !nom || !username || !email || !telephone || !password || !confirm) {
      setErreur('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirm) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    setChargement(true);
    try {
      const role = await inscrire({ prenom, nom, username, email, telephone, password });

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErreur(
        err.response?.data?.message || "Erreur lors de l'inscription"
      );
    } finally {
      setChargement(false);
    }
  };

  // ── Icônes SVG inline ───────────────────
  const IconMail  = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
  const IconLock  = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  const IconUser  = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const IconPhone = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.62 19 19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.27 6.27l1.91-1.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
  const IconTag   = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;

  return (
    <div style={{
      minHeight:      '100vh',
      background:     C.fond,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '40px 16px',
      position:       'relative',
      overflow:       'hidden',
    }}>

      {/* Décors de fond */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'rgba(90,191,42,0.06)', filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-60px',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'rgba(212,160,23,0.07)', filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Carte principale */}
      <div style={{
        width:        '100%',
        maxWidth:     '460px',
        background:   C.blanc,
        borderRadius: '20px',
        border:       `1px solid ${C.bordure}`,
        boxShadow:    '0 8px 40px rgba(30,90,8,0.10)',
        overflow:     'hidden',
        position:     'relative',
        zIndex:       1,
      }}>

        {/* Liseré vert-or */}
        <div style={{
          height:     '4px',
          background: `linear-gradient(90deg, ${C.vert}, ${C.vertClair}, ${C.or}, ${C.vertClair}, ${C.vert})`,
        }} />

        <div style={{ padding: '32px 36px 36px' }}>

          {/* Logo + titre */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{
              position: 'relative', width: '60px', height: '60px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 5px 18px rgba(80,180,40,0.42)',
              marginBottom: '14px',
            }}>
              <div style={{
                position: 'absolute', top: '6px', left: '50%',
                transform: 'translateX(-50%)', width: '24px', height: '8px',
                background: 'rgba(255,255,255,0.30)', borderRadius: '50%',
              }} />
              <img
                src="/images/logo2.png"
                alt="Nasoo"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: C.texteClair, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                Laiterie
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: C.or, fontFamily: 'Georgia, serif' }}>
                Nasoo
              </div>
            </div>
          </div>

          {/* Sélecteur mode */}
          <div style={{
            display: 'flex', background: C.fond,
            borderRadius: '12px', padding: '4px',
            marginBottom: '28px', border: `1px solid ${C.bordure}`,
          }}>
            {['connexion', 'inscription'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setErreur(''); }}
                style={{
                  flex: 1, padding: '9px', borderRadius: '9px',
                  border: 'none', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.22s ease',
                  background: mode === m ? C.blanc : 'transparent',
                  color:      mode === m ? C.vertFonce : C.texteClair,
                  boxShadow:  mode === m ? '0 2px 8px rgba(30,90,8,0.10)' : 'none',
                }}
              >
                {m === 'connexion' ? 'Se connecter' : "S'inscrire"}
              </button>
            ))}
          </div>

          {/* ── MODE CONNEXION ── */}
          {mode === 'connexion' && (
            <div>
              <Field
                label="Adresse email" type="email"
                placeholder="votre@email.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                icon={IconMail}
              />
              <Field
                label="Mot de passe" type="password"
                placeholder="••••••••"
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                icon={IconLock}
              />

              {/* Message d'erreur */}
              {erreur && (
                <div style={{
                  background: 'rgba(229,53,53,0.08)',
                  border: `1px solid rgba(229,53,53,0.30)`,
                  borderRadius: '8px', padding: '10px 14px',
                  marginBottom: '16px', fontSize: '13px', color: C.rouge,
                }}>
                  {erreur}
                </div>
              )}

              <BtnOr onClick={handleConnexion} loading={chargement}>
                Se connecter
              </BtnOr>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
                <span style={{ fontSize: '12px', color: C.placeholder }}>ou</span>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: C.texteClair }}>Pas encore de compte ? </span>
                <button
                  onClick={() => setMode('inscription')}
                  style={{ background: 'none', border: 'none', color: C.vertFonce, fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  S'inscrire
                </button>
              </div>
            </div>
          )}

          {/* ── MODE INSCRIPTION ── */}
          {mode === 'inscription' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Prénom" placeholder="Jean" value={reg.prenom} onChange={e => setRegField('prenom', e.target.value)} icon={IconUser} />
                <Field label="Nom" placeholder="Dupont" value={reg.nom} onChange={e => setRegField('nom', e.target.value)} icon={IconUser} />
              </div>
              <Field label="Nom d'utilisateur" placeholder="jean_dupont" value={reg.username} onChange={e => setRegField('username', e.target.value)} icon={IconTag} />
              <Field label="Adresse email" type="email" placeholder="votre@email.com" value={reg.email} onChange={e => setRegField('email', e.target.value)} icon={IconMail} />
              <Field label="Téléphone" type="tel" placeholder="70 12 34 56" value={reg.telephone} onChange={e => setRegField('telephone', e.target.value)} icon={IconPhone} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Mot de passe" type="password" placeholder="••••••••" value={reg.password} onChange={e => setRegField('password', e.target.value)} icon={IconLock} />
                <Field label="Confirmer" type="password" placeholder="••••••••" value={reg.confirm} onChange={e => setRegField('confirm', e.target.value)} icon={IconLock} />
              </div>

              {/* Message d'erreur */}
              {erreur && (
                <div style={{
                  background: 'rgba(229,53,53,0.08)',
                  border: `1px solid rgba(229,53,53,0.30)`,
                  borderRadius: '8px', padding: '10px 14px',
                  marginBottom: '16px', fontSize: '13px', color: C.rouge,
                }}>
                  {erreur}
                </div>
              )}

              <BtnOr onClick={handleInscription} loading={chargement}>
                Créer mon compte
              </BtnOr>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
                <span style={{ fontSize: '12px', color: C.placeholder }}>ou</span>
                <div style={{ flex: 1, height: '1px', background: C.bordure }} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: C.texteClair }}>Déjà un compte ? </span>
                <button
                  onClick={() => setMode('connexion')}
                  style={{ background: 'none', border: 'none', color: C.vertFonce, fontSize: '13px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
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