import React, { useState, useEffect } from 'react';
import { getCommandes, changerStatut } from '../../services/api';
import { FiPackage, FiClock, FiCheck, FiPhone } from 'react-icons/fi';

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
};

const STATUTS = {
  EN_ATTENTE: { label: 'En attente', couleur: '#F2C040', bg: 'rgba(212,160,23,0.15)' },
  RECU:       { label: 'Recu',       couleur: '#5ABF2A', bg: 'rgba(90,191,42,0.15)'  },
  TERMINE:    { label: 'Termine',    couleur: '#3B8BD4', bg: 'rgba(59,139,212,0.15)' },
};

const NUMERO_WHATSAPP = '22670000000'; // ← Remplace par le vrai numéro

function AdminCommandes() {
  const [commandes,  setCommandes]  = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre,     setFiltre]     = useState('TOUS');

  const chargerCommandes = async () => {
    setChargement(true);
    try {
      const res = await getCommandes();
      setCommandes(res.data.commandes);
    } catch (err) {
      console.error('Erreur chargement commandes:', err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { chargerCommandes(); }, []);

  // ── Changer le statut ───────────────────
  const handleStatut = async (id, statut) => {
    try {
      await changerStatut(id, statut);
      chargerCommandes();
    } catch (err) {
      console.error('Erreur changement statut:', err);
    }
  };

  // ── Lien WhatsApp ───────────────────────
  const ouvrirWhatsApp = (commande) => {
    const client  = commande.user;
    const date    = new Date(commande.createdAt).toLocaleDateString('fr-FR');
    const message = `Bonjour ${client.prenom} ${client.nom}, votre commande #${commande.id} du ${date} a ete recue. Total: ${commande.total.toLocaleString()} FCFA. Nous vous contactons pour confirmation. Merci de votre confiance - Laiterie Nasoo`;
    const url     = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const commandesFiltrees = filtre === 'TOUS'
    ? commandes
    : commandes.filter(c => c.statut === filtre);

  return (
    <div>

      {/* En-tête */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: C.texte }}>
          Commandes
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: C.texteClair }}>
          {commandes.length} commande{commandes.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Stats rapides */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
        gap: '12px', marginBottom: '24px',
      }}>
        {[
          { label: 'Total',      val: commandes.length,                                    couleur: C.vert    },
          { label: 'En attente', val: commandes.filter(c => c.statut === 'EN_ATTENTE').length, couleur: C.orClair },
          { label: 'Recues',     val: commandes.filter(c => c.statut === 'RECU').length,       couleur: C.vert    },
          { label: 'Terminees',  val: commandes.filter(c => c.statut === 'TERMINE').length,    couleur: C.bleu    },
        ].map((s, i) => (
          <div key={i} style={{
            background: C.carte, borderRadius: '12px',
            border: `1px solid ${C.bordure}`, padding: '16px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: s.couleur }}>
              {s.val}
            </div>
            <div style={{ fontSize: '12px', color: C.texteClair, marginTop: '2px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['TOUS', 'EN_ATTENTE', 'RECU', 'TERMINE'].map(f => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            style={{
              padding: '7px 16px', borderRadius: '99px', border: 'none',
              background: filtre === f
                ? 'linear-gradient(135deg,#5ABF2A,#90D840)'
                : 'rgba(255,255,255,0.06)',
              color: filtre === f ? '#0f1a0f' : C.texteClair,
              fontSize: '12.5px', fontWeight: filtre === f ? '700' : '400',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {f === 'TOUS' ? 'Toutes' : STATUTS[f]?.label}
          </button>
        ))}
      </div>

      {/* Chargement */}
      {chargement && (
        <div style={{ textAlign: 'center', padding: '60px', color: C.texteClair }}>
          Chargement...
        </div>
      )}

      {/* Liste commandes */}
      {!chargement && commandesFiltrees.length === 0 && (
        <div style={{
          background: C.carte, borderRadius: '14px',
          border: `1px solid ${C.bordure}`,
          padding: '60px', textAlign: 'center',
        }}>
          <FiPackage style={{ fontSize: '36px', color: 'rgba(232,245,208,0.30)', marginBottom: '12px' }} />
          <p style={{ color: C.texteClair, margin: 0 }}>Aucune commande</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {commandesFiltrees.map(c => {
          const statut = STATUTS[c.statut] || STATUTS.EN_ATTENTE;
          const date   = new Date(c.createdAt).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
          });

          return (
            <div key={c.id} style={{
              background: C.carte, borderRadius: '14px',
              border: `1px solid ${C.bordure}`, overflow: 'hidden',
            }}>

              {/* En-tête commande */}
              <div style={{
                padding: '14px 20px',
                borderBottom: `1px solid ${C.bordure}`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: C.texte }}>
                      Commande #{c.id}
                    </div>
                    <div style={{ fontSize: '12px', color: C.texteClair, marginTop: '2px' }}>
                      {date}
                    </div>
                  </div>

                  {/* Client */}
                  <div style={{
                    padding: '6px 12px', borderRadius: '8px',
                    background: 'rgba(90,191,42,0.08)',
                    border: '1px solid rgba(90,191,42,0.20)',
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: C.vert }}>
                      {c.user.prenom} {c.user.nom}
                    </div>
                    <div style={{ fontSize: '11px', color: C.texteClair }}>
                      {c.user.telephone}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Total */}
                  <div style={{ fontSize: '16px', fontWeight: '800', color: C.orClair }}>
                    {c.total.toLocaleString()} FCFA
                  </div>

                  {/* Badge statut */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 12px', borderRadius: '99px',
                    background: statut.bg, color: statut.couleur,
                    fontSize: '12px', fontWeight: '700',
                    border: `1px solid ${statut.couleur}40`,
                  }}>
                    {statut.label}
                  </div>

                  {/* Bouton WhatsApp */}
                  <button
                    onClick={() => ouvrirWhatsApp(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '7px 14px', borderRadius: '8px', border: 'none',
                      background: 'rgba(37,211,102,0.15)',
                      color: '#25d366', fontSize: '12px', fontWeight: '700',
                      cursor: 'pointer', border: '1px solid rgba(37,211,102,0.30)',
                    }}
                  >
                    <FiPhone style={{ fontSize: '13px' }} />
                    WhatsApp
                  </button>
                </div>
              </div>

              {/* Articles */}
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.bordure}` }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {c.items.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '6px 10px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${C.bordure}`,
                    }}>
                      {item.produit?.imageUrl && (
                        <img src={item.produit.imageUrl} alt={item.produit.nom}
                          style={{ width: '28px', height: '28px', borderRadius: '5px', objectFit: 'cover' }} />
                      )}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: C.texte }}>
                          {item.produit?.nom}
                        </div>
                        <div style={{ fontSize: '11px', color: C.texteClair }}>
                          x{item.quantite} — {item.prixUnitaire.toLocaleString()} FCFA
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions statut */}
              <div style={{ padding: '12px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: C.texteClair, alignSelf: 'center', marginRight: '4px' }}>
                  Changer statut :
                </span>
                {['EN_ATTENTE', 'RECU', 'TERMINE'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatut(c.id, s)}
                    disabled={c.statut === s}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', border: 'none',
                      background: c.statut === s
                        ? STATUTS[s].bg
                        : 'rgba(255,255,255,0.06)',
                      color: c.statut === s ? STATUTS[s].couleur : C.texteClair,
                      fontSize: '12px', fontWeight: c.statut === s ? '700' : '400',
                      cursor: c.statut === s ? 'default' : 'pointer',
                      border: `1px solid ${c.statut === s ? STATUTS[s].couleur + '40' : 'transparent'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    {STATUTS[s].label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminCommandes;