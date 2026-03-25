import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePanier } from '../context/PanierContext';
import { useAuth }   from '../context/AuthContext';
import { creerCommande } from '../services/api';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowRight, FiPackage } from 'react-icons/fi';

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

function Panier() {
  const navigate = useNavigate();
  const { panier, modifierQuantite, supprimerDuPanier, viderPanier, totalArticles, totalPrix } = usePanier();
  const { estConnecte, user } = useAuth();

  const [chargement, setChargement] = useState(false);
  const [erreur,     setErreur]     = useState('');
  const [succes,     setSucces]     = useState(false);

  // ─────────────────────────────────────────
  // Valider la commande
  // ─────────────────────────────────────────
  const validerCommande = async () => {
    setErreur('');

    if (!estConnecte) {
      navigate('/compte');
      return;
    }

    setChargement(true);
    try {
      const items = panier.map(p => ({
        produitId:    p.id,
        quantite:     p.quantite,
        prixUnitaire: p.prix,
      }));

      await creerCommande({ items });
      viderPanier();
      setSucces(true);

    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setChargement(false);
    }
  };

  // ── Panier vide ─────────────────────────
  if (panier.length === 0 && !succes) {
    return (
      <div style={{
        minHeight: '100vh', background: C.fond,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '20px', padding: '40px',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(90,191,42,0.10)',
          border: `2px solid ${C.bordure}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FiShoppingCart style={{ fontSize: '32px', color: C.texteClair }} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: C.texte, margin: 0 }}>
          Votre panier est vide
        </h2>
        <p style={{ fontSize: '14px', color: C.texteClair, margin: 0 }}>
          Ajoutez des produits depuis la page d'accueil
        </p>
        
        {/* Boutons groupés */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 28px', borderRadius: '99px',
            background: `linear-gradient(135deg,${C.vert},${C.vertClair})`,
            color: '#fff', fontSize: '14px', fontWeight: '700',
            textDecoration: 'none', boxShadow: '0 4px 14px rgba(90,191,42,0.35)',
          }}>
            Voir nos produits
            <FiArrowRight />
          </Link>
          
          {/* Bouton Mes commandes - TOUJOURS VISIBLE si connecté */}
          {estConnecte && (
            <Link to="/mes-commandes" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '99px',
              border: `1.5px solid ${C.bordure}`,
              background: C.blanc,
              color: C.texte, fontSize: '14px', fontWeight: '500',
              textDecoration: 'none',
            }}>
              <FiPackage style={{ fontSize: '16px' }} />
              Mes commandes
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ── Commande passée avec succès ─────────
  if (succes) {
    return (
      <div style={{
        minHeight: '100vh', background: C.fond,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '20px', padding: '40px',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(90,191,42,0.15)',
          border: `2px solid ${C.vert}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px',
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: C.texte, margin: 0 }}>
          Commande passée !
        </h2>
        <p style={{ fontSize: '14px', color: C.texteClair, margin: 0, textAlign: 'center', maxWidth: '400px' }}>
          Votre commande a été enregistrée. Nous vous contacterons bientôt pour confirmation.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/mes-commandes" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '99px',
            background: `linear-gradient(135deg,${C.vert},${C.vertClair})`,
            color: '#fff', fontSize: '14px', fontWeight: '700',
            textDecoration: 'none',
          }}>
            Mes commandes
          </Link>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '99px',
            border: `1.5px solid ${C.bordure}`,
            background: C.blanc,
            color: C.texte, fontSize: '14px', fontWeight: '500',
            textDecoration: 'none',
          }}>
            Retour accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.fond, minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* En-tête avec bouton Mes commandes */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: C.texte, margin: '0 0 6px' }}>
              Mon panier
            </h1>
            <p style={{ fontSize: '14px', color: C.texteClair, margin: 0 }}>
              {totalArticles} article{totalArticles > 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Bouton Mes commandes en haut à droite */}
          {estConnecte && (
            <Link to="/mes-commandes" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '99px',
              border: `1px solid ${C.bordure}`,
              background: C.blanc,
              color: C.texte, fontSize: '13px', fontWeight: '500',
              textDecoration: 'none',
            }}>
              <FiPackage style={{ fontSize: '14px' }} />
              Mes commandes
            </Link>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

          {/* Liste articles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {panier.map(p => (
              <div key={p.id} style={{
                background:   C.blanc,
                borderRadius: '14px',
                border:       `1px solid ${C.bordure}`,
                padding:      '16px',
                display:      'flex',
                alignItems:   'center',
                gap:          '16px',
                boxShadow:    '0 2px 8px rgba(30,90,8,0.05)',
              }}>
                {/* Image */}
                <div style={{
                  width: '70px', height: '70px', borderRadius: '10px',
                  background: 'rgba(90,191,42,0.08)',
                  border: `1px solid ${C.bordure}`,
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.nom}
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                  ) : (
                    <FiPackage style={{ fontSize: '24px', color: C.texteClair }} />
                  )}
                </div>

                {/* Infos */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: C.texte, marginBottom: '4px' }}>
                    {p.nom}
                  </div>
                  <div style={{ fontSize: '13px', color: C.texteClair }}>
                    {p.prix.toLocaleString()} FCFA / unité
                  </div>
                </div>

                {/* Quantité */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => modifierQuantite(p.id, p.quantite - 1)}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      border: `1px solid ${C.bordure}`, background: C.blanc,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: C.texte,
                    }}
                  >
                    <FiMinus style={{ fontSize: '13px' }} />
                  </button>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: C.texte, minWidth: '24px', textAlign: 'center' }}>
                    {p.quantite}
                  </span>
                  <button
                    onClick={() => modifierQuantite(p.id, p.quantite + 1)}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      border: `1px solid ${C.bordure}`, background: C.blanc,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: C.texte,
                    }}
                  >
                    <FiPlus style={{ fontSize: '13px' }} />
                  </button>
                </div>

                {/* Sous-total */}
                <div style={{
                  fontSize: '16px', fontWeight: '800', color: C.or,
                  minWidth: '100px', textAlign: 'right',
                }}>
                  {(p.prix * p.quantite).toLocaleString()} FCFA
                </div>

                {/* Supprimer */}
                <button
                  onClick={() => supprimerDuPanier(p.id)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    border: '1px solid rgba(229,53,53,0.25)',
                    background: 'rgba(229,53,53,0.06)', color: C.rouge,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <FiTrash2 style={{ fontSize: '14px' }} />
                </button>
              </div>
            ))}

            {/* Vider le panier */}
            <button
              onClick={viderPanier}
              style={{
                background: 'none', border: 'none',
                color: C.rouge, fontSize: '13px', cursor: 'pointer',
                textAlign: 'left', padding: '4px 0',
                textDecoration: 'underline',
              }}
            >
              Vider le panier
            </button>
          </div>

          {/* Récapitulatif */}
          <div style={{
            background:   C.blanc,
            borderRadius: '16px',
            border:       `1px solid ${C.bordure}`,
            padding:      '24px',
            boxShadow:    '0 2px 12px rgba(30,90,8,0.06)',
            position:     'sticky',
            top:          '100px',
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '700', color: C.texte }}>
              Récapitulatif
            </h3>

            {/* Lignes articles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {panier.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: C.texteClair }}>
                    {p.nom} x{p.quantite}
                  </span>
                  <span style={{ color: C.texte, fontWeight: '600' }}>
                    {(p.prix * p.quantite).toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>

            {/* Séparateur */}
            <div style={{ height: '1px', background: C.bordure, marginBottom: '16px' }} />

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: C.texte }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: C.or }}>
                {totalPrix.toLocaleString()} FCFA
              </span>
            </div>

            {/* Message non connecté */}
            {!estConnecte && (
              <div style={{
                background: 'rgba(212,160,23,0.10)',
                border: '1px solid rgba(212,160,23,0.30)',
                borderRadius: '8px', padding: '10px 14px',
                marginBottom: '14px', fontSize: '13px', color: C.or,
              }}>
                Connectez-vous pour passer commande
              </div>
            )}

            {/* Erreur */}
            {erreur && (
              <div style={{
                background: 'rgba(229,53,53,0.08)',
                border: '1px solid rgba(229,53,53,0.25)',
                borderRadius: '8px', padding: '10px 14px',
                marginBottom: '14px', fontSize: '13px', color: C.rouge,
              }}>
                {erreur}
              </div>
            )}

            {/* Bouton commander */}
            <button
              onClick={validerCommande}
              disabled={chargement}
              style={{
                width:        '100%', padding: '14px',
                borderRadius: '99px', border: 'none',
                background:   chargement
                  ? 'rgba(90,191,42,0.4)'
                  : `linear-gradient(155deg,${C.orClair},${C.or},${C.orFonce})`,
                color:        C.texte, fontSize: '15px', fontWeight: '700',
                cursor:       chargement ? 'not-allowed' : 'pointer',
                boxShadow:    '0 6px 20px rgba(212,160,23,0.45)',
                marginBottom: '12px',
              }}
            >
              {chargement ? 'Commande en cours...' : estConnecte ? 'Commander maintenant' : 'Se connecter pour commander'}
            </button>

            {/* Lien mes commandes */}
            {estConnecte && (
              <Link to="/mes-commandes" style={{
                display: 'block', textAlign: 'center',
                fontSize: '13px', color: C.texteClair,
                textDecoration: 'none',
              }}>
                Voir mes commandes précédentes
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Panier;