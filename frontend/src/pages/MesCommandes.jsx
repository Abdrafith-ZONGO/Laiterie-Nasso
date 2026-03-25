import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMesCommandes } from '../services/api';
import { FiPackage, FiClock, FiCheck, FiArrowRight } from 'react-icons/fi';

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
  bordure:    '#C6E4A0',
  rouge:      '#E53535',
};

const STATUTS = {
  EN_ATTENTE: { label: 'En attente',  couleur: '#D4A017', bg: 'rgba(212,160,23,0.12)', icon: <FiClock /> },
  RECU:       { label: 'Recu',        couleur: '#5ABF2A', bg: 'rgba(90,191,42,0.12)',  icon: <FiPackage /> },
  TERMINE:    { label: 'Termine',     couleur: '#3B8BD4', bg: 'rgba(59,139,212,0.12)', icon: <FiCheck /> },
};

function MesCommandes() {
  const [commandes,  setCommandes]  = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getMesCommandes();
        setCommandes(res.data.commandes);
      } catch (err) {
        console.error('Erreur chargement commandes:', err);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  if (chargement) {
    return (
      <div style={{ minHeight: '100vh', background: C.fond, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: C.texteClair }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ background: C.fond, minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* En-tête */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: C.texte, margin: '0 0 4px' }}>
              Mes commandes
            </h1>
            <p style={{ fontSize: '14px', color: C.texteClair, margin: 0 }}>
              {commandes.length} commande{commandes.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '99px',
            background: `linear-gradient(135deg,${C.vert},${C.vertClair})`,
            color: '#fff', fontSize: '13px', fontWeight: '700',
            textDecoration: 'none',
          }}>
            Continuer mes achats
            <FiArrowRight style={{ fontSize: '13px' }} />
          </Link>
        </div>

        {/* Aucune commande */}
        {commandes.length === 0 && (
          <div style={{
            background: C.blanc, borderRadius: '16px',
            border: `1px solid ${C.bordure}`,
            padding: '60px', textAlign: 'center',
          }}>
            <FiPackage style={{ fontSize: '40px', color: C.texteClair, marginBottom: '12px' }} />
            <p style={{ color: C.texteClair, margin: 0, fontSize: '15px' }}>
              Vous n'avez pas encore de commande
            </p>
          </div>
        )}

        {/* Liste commandes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {commandes.map(c => {
            const statut = STATUTS[c.statut] || STATUTS.EN_ATTENTE;
            const date   = new Date(c.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit', month: 'long', year: 'numeric',
            });

            return (
              <div key={c.id} style={{
                background: C.blanc, borderRadius: '16px',
                border: `1px solid ${C.bordure}`,
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(30,90,8,0.05)',
              }}>
                {/* En-tête commande */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: `1px solid ${C.bordure}`,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: C.texte }}>
                      Commande #{c.id}
                    </div>
                    <div style={{ fontSize: '12.5px', color: C.texteClair, marginTop: '2px' }}>
                      {date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Badge statut */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '5px 12px', borderRadius: '99px',
                      background: statut.bg, color: statut.couleur,
                      fontSize: '12px', fontWeight: '700',
                      border: `1px solid ${statut.couleur}35`,
                    }}>
                      {statut.icon}
                      {statut.label}
                    </div>
                    {/* Total */}
                    <div style={{ fontSize: '16px', fontWeight: '800', color: C.or }}>
                      {c.total.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>

                {/* Articles */}
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {c.items.map(item => (
                    <div key={item.id} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '8px',
                        background: 'rgba(90,191,42,0.08)',
                        border: `1px solid ${C.bordure}`,
                        overflow: 'hidden', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {item.produit?.imageUrl ? (
                          <img src={item.produit.imageUrl} alt={item.produit.nom}
                            style={{ width: '44px', height: '44px', objectFit: 'cover' }} />
                        ) : (
                          <FiPackage style={{ fontSize: '18px', color: C.texteClair }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: C.texte }}>
                          {item.produit?.nom || 'Produit supprime'}
                        </div>
                        <div style={{ fontSize: '12px', color: C.texteClair }}>
                          {item.quantite} x {item.prixUnitaire.toLocaleString()} FCFA
                        </div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: C.texte }}>
                        {(item.quantite * item.prixUnitaire).toLocaleString()} FCFA
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MesCommandes;