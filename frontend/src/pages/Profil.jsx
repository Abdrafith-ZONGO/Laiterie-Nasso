import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfil, modifierUtilisateur } from '../services/api';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiEdit2, FiUserCheck } from 'react-icons/fi';

// ─────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────
const C = {
  fond:       '#F8FDF2',
  blanc:      '#FFFFFF',
  texte:      '#2D4A1E',
  texteClair: '#5A7A40',
  vertFonce:  '#1E5A08',
  vert:       '#5ABF2A',
  vertClair:  '#90D840',
  or:         '#D4A017',
  orClair:    '#F2C040',
  orFonce:    '#B88010',
  bordure:    '#C6E4A0',
  rouge:      '#E53535',
};

// ─────────────────────────────────────────
// MODAL CHANGEMENT MOT DE PASSE
// ─────────────────────────────────────────
function ModalMotDePasse({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    ancienMdp: '',
    nouveauMdp: '',
    confirmation: '',
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nouveauMdp !== form.confirmation) {
      setErreur('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.nouveauMdp.length < 6) {
      setErreur('Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    setChargement(true);
    setErreur('');
    try {
      // Appel API pour changer le mot de passe
      await modifierUtilisateur(1, { password: form.nouveauMdp }); // À adapter avec l'ID réel
      onSuccess();
      onClose();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: C.blanc,
        borderRadius: '20px',
        width: '450px',
        maxWidth: '90%',
        border: `1px solid ${C.bordure}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${C.bordure}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: C.texte }}>
            Changer le mot de passe
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
            color: C.texteClair,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
              Ancien mot de passe
            </label>
            <input
              type="password"
              name="ancienMdp"
              value={form.ancienMdp}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '12px',
                border: `1px solid ${C.bordure}`,
                borderRadius: '8px', fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              name="nouveauMdp"
              value={form.nouveauMdp}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '12px',
                border: `1px solid ${C.bordure}`,
                borderRadius: '8px', fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmation"
              value={form.confirmation}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '12px',
                border: `1px solid ${C.bordure}`,
                borderRadius: '8px', fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {erreur && (
            <div style={{
              background: 'rgba(229,53,53,0.1)',
              border: `1px solid ${C.rouge}`,
              borderRadius: '8px', padding: '10px',
              marginBottom: '16px', fontSize: '13px', color: C.rouge,
            }}>
              {erreur}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: '8px',
                border: `1px solid ${C.bordure}`, background: 'transparent',
                color: C.texteClair, cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={chargement}
              style={{
                flex: 2, padding: '12px', borderRadius: '8px', border: 'none',
                background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
                color: '#fff', fontWeight: '700', cursor: 'pointer',
              }}
            >
              {chargement ? 'Chargement...' : 'Changer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE PROFIL
// ─────────────────────────────────────────
function Profil() {
  const navigate = useNavigate();
  const { user, estConnecte, deconnecter } = useAuth();
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [edition, setEdition] = useState(false);
  const [form, setForm] = useState({});
  const [modalMdp, setModalMdp] = useState(false);
  const [message, setMessage] = useState('');

  console.log('🔄 Composant rendu - edition:', edition, 'form:', form);

  // Charger le profil
  useEffect(() => {
      console.log('🔄 useEffect chargement profil - estConnecte:', estConnecte)
    if (!estConnecte) {
      navigate('/compte');
      return;
    }

    const chargerProfil = async () => {
      console.log('🔄 Chargement du profil...');
      try {
        const res = await getProfil();
        setProfil(res.data.user);
        setForm({
          prenom: res.data.user.prenom,
          nom: res.data.user.nom,
          email: res.data.user.email,
          telephone: res.data.user.telephone,
        });
      } catch (err) {
        console.error('Erreur chargement profil:', err);
      } finally {
        setChargement(false);
      }
    };
    chargerProfil();
  }, [estConnecte, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm('Voulez-vous vraiment enregistrer les modifications ?');
    if (!confirmation) return;
    try {
      await modifierUtilisateur(user.id, form);
      setProfil({ ...profil, ...form });
      setEdition(false);
      setMessage('Informations mises à jour avec succès');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Erreur modification:', err);
    }
  };

  if (chargement) {
    return (
      <div style={{ background: C.fond, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: C.texteClair }}>Chargement...</p>
      </div>
    );
  }

  if (!profil) {
    return (
      <div style={{ background: C.fond, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: C.texteClair }}>Erreur de chargement</p>
      </div>
    );
  }

  return (
    <div style={{ background: C.fond, minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Message de succès */}
        {message && (
          <div style={{
            background: 'rgba(90,191,42,0.1)',
            border: `1px solid ${C.vert}`,
            borderRadius: '12px',
            padding: '12px 20px',
            marginBottom: '24px',
            color: C.vert,
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        {/* Carte du profil */}
        <div style={{
          background: C.blanc,
          borderRadius: '24px',
          border: `1px solid ${C.bordure}`,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}>

          {/* En-tête */}
          <div style={{
            background: `linear-gradient(135deg, ${C.vertFonce}, #2D4A1E)`,
            padding: '40px 32px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: C.blanc,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <FiUser size={40} color={C.vert} />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '8px',
            }}>
              {profil.prenom} {profil.nom}
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
            }}>
              @{profil.username}
            </p>
          </div>

          {/* Formulaire */}
          <div style={{ padding: '32px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    disabled={!edition}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${C.bordure}`,
                      borderRadius: '10px',
                      fontSize: '13px',
                      background: edition ? C.blanc : 'rgba(0,0,0,0.02)',
                      cursor: edition ? 'text' : 'default',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    disabled={!edition}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${C.bordure}`,
                      borderRadius: '10px',
                      fontSize: '13px',
                      background: edition ? C.blanc : 'rgba(0,0,0,0.02)',
                      cursor: edition ? 'text' : 'default',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!edition}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${C.bordure}`,
                    borderRadius: '10px',
                    fontSize: '13px',
                    background: edition ? C.blanc : 'rgba(0,0,0,0.02)',
                    cursor: edition ? 'text' : 'default',
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  disabled={!edition}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${C.bordure}`,
                    borderRadius: '10px',
                    fontSize: '13px',
                    background: edition ? C.blanc : 'rgba(0,0,0,0.02)',
                    cursor: edition ? 'text' : 'default',
                  }}
                />
              </div>

              {/* Boutons d'action */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: `1px solid ${C.bordure}`,
                paddingTop: '24px',
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {!edition ? (
                    <button
                      type="button"
                      onClick={() => setEdition(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      <FiEdit2 />
                      Modifier mes informations
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        <FiSave />
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEdition(false);
                          setForm({
                            prenom: profil.prenom,
                            nom: profil.nom,
                            email: profil.email,
                            telephone: profil.telephone,
                          });
                        }}
                        style={{
                          padding: '10px 20px',
                          background: 'transparent',
                          border: `1px solid ${C.bordure}`,
                          borderRadius: '10px',
                          color: C.texteClair,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Annuler
                      </button>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setModalMdp(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'transparent',
                    border: `1px solid ${C.or}`,
                    borderRadius: '10px',
                    color: C.or,
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  <FiLock />
                  Changer mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bouton déconnexion */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => {
              deconnecter();
              navigate('/');
            }}
            style={{
              padding: '12px 28px',
              background: 'transparent',
              border: `1px solid ${C.rouge}`,
              borderRadius: '10px',
              color: C.rouge,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Modal changement mot de passe */}
      {modalMdp && (
        <ModalMotDePasse
          onClose={() => setModalMdp(false)}
          onSuccess={() => setMessage('Mot de passe modifié avec succès')}
        />
      )}
    </div>
  );
}

export default Profil;