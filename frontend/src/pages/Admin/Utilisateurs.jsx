import React, { useState, useEffect } from 'react';
import { getUtilisateurs, modifierUtilisateur } from '../../services/api';
import { FiSearch, FiEdit2, FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

// ─────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────
const C = {
  carte:      '#1e2e1e',
  bordure:    'rgba(90,191,42,0.15)',
  texte:      '#e8f5d0',
  texteClair: 'rgba(232,245,208,0.60)',
  vert:       '#5ABF2A',
  vertClair:  '#90D840',
  or:         '#D4A017',
  orClair:    '#F2C040',
  rouge:      '#E53535',
  bleu:       '#3B8BD4',
  violet:     '#9B6BFF',
};

// ─────────────────────────────────────────
// MODAL DE MODIFICATION
// ─────────────────────────────────────────
function ModalModifier({ utilisateur, onClose, onSave }) {
  const [form, setForm] = useState({
    prenom: utilisateur?.prenom || '',
    nom: utilisateur?.nom || '',
    email: utilisateur?.email || '',
    telephone: utilisateur?.telephone || '',
    role: utilisateur?.role || 'client',
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');
    try {
      await modifierUtilisateur(utilisateur.id, form);
      onSave();
      onClose();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la modification');
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
        background: C.carte,
        borderRadius: '16px',
        width: '500px',
        maxWidth: '90%',
        border: `1px solid ${C.bordure}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}>
        {/* En-tête */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${C.bordure}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: C.texte }}>
            Modifier l'utilisateur
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: C.texteClair,
            cursor: 'pointer', fontSize: '20px',
          }}>✕</button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
              Username
            </label>
            <input
              type="text"
              value={utilisateur?.username}
              disabled
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.bordure}`,
                borderRadius: '8px', color: C.texteClair,
                fontSize: '13px', cursor: 'not-allowed',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.bordure}`,
                  borderRadius: '8px', color: C.texte,
                  fontSize: '13px', outline: 'none',
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
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.bordure}`,
                  borderRadius: '8px', color: C.texte,
                  fontSize: '13px', outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.bordure}`,
                borderRadius: '8px', color: C.texte,
                fontSize: '13px', outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.bordure}`,
                borderRadius: '8px', color: C.texte,
                fontSize: '13px', outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: C.texteClair, marginBottom: '4px' }}>
              Rôle
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.bordure}`,
                borderRadius: '8px', color: C.texte,
                fontSize: '13px', outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
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
                color: '#0f1a0f', fontWeight: '700', cursor: 'pointer',
              }}
            >
              {chargement ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE PRINCIPALE UTILISATEURS
// ─────────────────────────────────────────
function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [filtreRole, setFiltreRole] = useState('tous');
  const [utilisateurEdit, setUtilisateurEdit] = useState(null);
  const [modalOuvert, setModalOuvert] = useState(false);

  const chargerUtilisateurs = async () => {
    setChargement(true);
    try {
      const params = {};
      if (recherche) params.recherche = recherche;
      if (filtreRole !== 'tous') params.role = filtreRole;
      
      const res = await getUtilisateurs(params);
      setUtilisateurs(res.data.utilisateurs);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, [recherche, filtreRole]);

  const handleModifier = (utilisateur) => {
    setUtilisateurEdit(utilisateur);
    setModalOuvert(true);
  };

  const handleSave = () => {
    chargerUtilisateurs();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  if (chargement && utilisateurs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: C.texteClair }}>
        Chargement...
      </div>
    );
  }

  return (
    <div>
      {/* Titre */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: '700',
          color: C.texte, margin: 0, marginBottom: '6px',
        }}>
          Utilisateurs
        </h2>
        <p style={{ fontSize: '13.5px', color: C.texteClair, margin: 0 }}>
          Gestion des comptes utilisateurs
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px',
        marginBottom: '24px', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <FiSearch style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: C.texteClair,
          }} />
          <input
            type="text"
            placeholder="Rechercher par nom, email, username..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              background: C.carte, border: `1px solid ${C.bordure}`,
              borderRadius: '8px', color: C.texte,
              fontSize: '13px', outline: 'none',
            }}
          />
        </div>

        <select
          value={filtreRole}
          onChange={(e) => setFiltreRole(e.target.value)}
          style={{
            padding: '10px 16px', background: C.carte,
            border: `1px solid ${C.bordure}`, borderRadius: '8px',
            color: C.texte, fontSize: '13px', cursor: 'pointer',
          }}
        >
          <option value="tous">Tous les rôles</option>
          <option value="client">Clients</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Tableau des utilisateurs */}
      {utilisateurs.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px',
          background: C.carte, borderRadius: '14px',
          border: `1px solid ${C.bordure}`,
          color: C.texteClair,
        }}>
          Aucun utilisateur trouvé
        </div>
      ) : (
        <div style={{
          background: C.carte, borderRadius: '14px',
          border: `1px solid ${C.bordure}`,
          overflowX: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bordure}` }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: C.texteClair, fontSize: '12px' }}>Username</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: C.texteClair, fontSize: '12px' }}>Nom complet</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: C.texteClair, fontSize: '12px' }}>Email</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: C.texteClair, fontSize: '12px' }}>Téléphone</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: C.texteClair, fontSize: '12px' }}>Rôle</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', color: C.texteClair, fontSize: '12px' }}>Inscription</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', color: C.texteClair, fontSize: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${C.bordure}` }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: C.texte }}>{u.username}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: C.texte }}>{u.prenom} {u.nom}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: C.texte }}>{u.email}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: C.texte }}>{u.telephone}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '99px',
                      fontSize: '11px', fontWeight: '600',
                      background: u.role === 'admin'
                        ? `linear-gradient(135deg, ${C.violet}, #7A4BFF)`
                        : `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
                      color: '#fff',
                    }}>
                      {u.role === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12px', color: C.texteClair }}>
                    {formatDate(u.createdAt)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleModifier(u)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: C.or, fontSize: '16px',
                      }}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de modification */}
      {modalOuvert && utilisateurEdit && (
        <ModalModifier
          utilisateur={utilisateurEdit}
          onClose={() => setModalOuvert(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Utilisateurs;