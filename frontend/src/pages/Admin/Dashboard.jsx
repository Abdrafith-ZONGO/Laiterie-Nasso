import React, { useState, useEffect } from 'react';
import { getProduits, getCommandes, getUtilisateurs } from '../../services/api';
import { FiPackage, FiUsers, FiShoppingBag, FiTrendingUp, FiUserPlus } from 'react-icons/fi';

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
// Composant carte de statistique
// ─────────────────────────────────────────
function StatCard({ titre, valeur, icon, couleur, sousTitre }) {
  return (
    <div style={{
      background:   C.carte,
      borderRadius: '14px',
      border:       `1px solid ${C.bordure}`,
      padding:      '22px 24px',
      display:      'flex',
      alignItems:   'center',
      gap:          '18px',
      boxShadow:    '0 4px 20px rgba(0,0,0,0.20)',
    }}>
      <div style={{
        width:          '52px', height: '52px',
        borderRadius:   '14px',
        background:     `${couleur}18`,
        border:         `1px solid ${couleur}35`,
        display:        'flex', alignItems: 'center', justifyContent: 'center',
        fontSize:       '22px',
        color:          couleur,
        flexShrink:     0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize:   '28px',
          fontWeight: '800',
          color:      C.texte,
          lineHeight: 1,
          marginBottom: '4px',
        }}>
          {valeur}
        </div>
        <div style={{ fontSize: '13px', color: C.texteClair }}>
          {titre}
        </div>
        {sousTitre && (
          <div style={{ fontSize: '11.5px', color: couleur, marginTop: '3px' }}>
            {sousTitre}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState({
    produits:        0,
    disponibles:     0,
    rupture:         0,
    commandes:       0,
    commandesAttente: 0,
    utilisateurs:    0,
    admins:          0,
  });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const [produitsRes, commandesRes, utilisateursRes] = await Promise.all([
          getProduits(),
          getCommandes(),
          getUtilisateurs(),
        ]);

        const produits = produitsRes.data.produits;
        const commandes = commandesRes.data.commandes;
        const utilisateurs = utilisateursRes.data.utilisateurs;

        setStats({
          produits:   produits.length,
          disponibles: produits.filter(p => p.disponible).length,
          rupture:    produits.filter(p => p.stock === 0).length,
          commandes:  commandes.length,
          commandesAttente: commandes.filter(c => c.statut === 'EN_ATTENTE').length,
          utilisateurs: utilisateurs.length,
          admins: utilisateurs.filter(u => u.role === 'admin').length,
        });
      } catch (err) {
        console.error('Erreur chargement stats:', err);
      } finally {
        setChargement(false);
      }
    };

    chargerStats();
  }, []);

  if (chargement) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(232,245,208,0.60)' }}>
        Chargement...
      </div>
    );
  }

  return (
    <div>

      {/* ── Titre ──────────────────────────── */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: '700',
          color: '#e8f5d0', margin: 0, marginBottom: '6px',
        }}>
          Bienvenue sur le dashboard 👋
        </h2>
        <p style={{ fontSize: '13.5px', color: 'rgba(232,245,208,0.60)', margin: 0 }}>
          Vue d'ensemble de la Laiterie Nasoo
        </p>
      </div>

      {/* ── Grille de statistiques ──────────── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap:                 '16px',
        marginBottom:        '32px',
      }}>
        <StatCard
          titre="Total produits"
          valeur={stats.produits}
          icon={<FiPackage />}
          couleur={C.vert}
          sousTitre="dans le catalogue"
        />
        <StatCard
          titre="Produits disponibles"
          valeur={stats.disponibles}
          icon={<FiTrendingUp />}
          couleur={C.orClair}
          sousTitre="en vente actuellement"
        />
        <StatCard
          titre="Rupture de stock"
          valeur={stats.rupture}
          icon={<FiShoppingBag />}
          couleur={C.rouge}
          sousTitre="à réapprovisionner"
        />
        <StatCard
          titre="Commandes"
          valeur={stats.commandes}
          icon={<FiShoppingBag />}
          couleur={C.bleu}
          sousTitre={`dont ${stats.commandesAttente} en attente`}
        />
        <StatCard
          titre="Utilisateurs"
          valeur={stats.utilisateurs}
          icon={<FiUsers />}
          couleur={C.violet}
          sousTitre={`${stats.admins} administrateur${stats.admins > 1 ? 's' : ''}`}
        />
      </div>

      {/* ── Accès rapides ───────────────────── */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{
          fontSize: '15px', fontWeight: '600',
          color: '#e8f5d0', margin: '0 0 16px 0',
        }}>
          Accès rapides
        </h3>

        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap:                 '12px',
        }}>

          <a href="/admin/produits" style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '12px',
            padding:        '16px 20px',
            borderRadius:   '12px',
            background:     'rgba(90,191,42,0.08)',
            border:         '1px solid rgba(90,191,42,0.25)',
            textDecoration: 'none',
            color:          '#e8f5d0',
            fontSize:       '13.5px',
            fontWeight:     '500',
            transition:     'all 0.2s ease',
          }}>
            <FiPackage style={{ color: C.vert, fontSize: '18px' }} />
            Gérer les produits
          </a>

          <a href="/admin/commandes" style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '12px',
            padding:        '16px 20px',
            borderRadius:   '12px',
            background:     'rgba(212,160,23,0.08)',
            border:         '1px solid rgba(212,160,23,0.25)',
            textDecoration: 'none',
            color:          '#e8f5d0',
            fontSize:       '13.5px',
            fontWeight:     '500',
            transition:     'all 0.2s ease',
          }}>
            <FiShoppingBag style={{ color: C.orClair, fontSize: '18px' }} />
            Voir les commandes
          </a>

          <a href="/admin/utilisateurs" style={{
            display:        'flex',
            alignItems:     'center',
            gap:            '12px',
            padding:        '16px 20px',
            borderRadius:   '12px',
            background:     'rgba(155,107,255,0.08)',
            border:         '1px solid rgba(155,107,255,0.25)',
            textDecoration: 'none',
            color:          '#e8f5d0',
            fontSize:       '13.5px',
            fontWeight:     '500',
            transition:     'all 0.2s ease',
          }}>
            <FiUserPlus style={{ color: C.violet, fontSize: '18px' }} />
            Gérer les utilisateurs
          </a>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;