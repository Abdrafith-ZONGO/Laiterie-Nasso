import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProduits } from '../services/api';
import { usePanier } from '../context/PanierContext';
import { FiShoppingCart } from 'react-icons/fi';

// Palette (tu peux la reprendre de Accueil.jsx)
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

// Composant carte produit (identique à celui de Accueil)
function CarteProduit({ produit, onAjouterPanier }) {
  const [hov, setHov] = useState(false);
  const [ajout, setAjout] = useState(false);

  const handleAjouter = () => {
    onAjouterPanier(produit);
    setAjout(true);
    setTimeout(() => setAjout(false), 1500);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   C.blanc,
        borderRadius: '16px',
        border:       `1px solid ${hov ? C.vert : C.bordure}`,
        overflow:     'hidden',
        transition:   'all 0.25s ease',
        transform:    hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:    hov
          ? '0 16px 40px rgba(30,90,8,0.15)'
          : '0 2px 12px rgba(30,90,8,0.06)',
      }}
    >
      {/* Image */}
      <div style={{
        height:         '200px',
        background:     'linear-gradient(135deg,rgba(90,191,42,0.08),rgba(212,160,23,0.06))',
        position:       'relative',
        overflow:       'hidden',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        {produit.imageUrl ? (
          <img
            src={produit.imageUrl}
            alt={produit.nom}
            style={{
              width:     '100%',
              height:    '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease',
              transform:  hov ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{ fontSize: '52px', opacity: 0.4 }}>🥛</div>
        )}

        {/* Badge catégorie */}
        <div style={{
          position:     'absolute', top: '12px', left: '12px',
          background:   'rgba(255,255,255,0.92)',
          color:        C.vertFonce,
          fontSize:     '11px', fontWeight: '700',
          padding:      '3px 10px', borderRadius: '99px',
          border:       `1px solid ${C.bordure}`,
        }}>
          {produit.categorie}
        </div>

        {/* Rupture de stock */}
        {produit.stock === 0 && (
          <div style={{
            position:       'absolute', inset: 0,
            background:     'rgba(0,0,0,0.45)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <span style={{
              background: C.rouge, color: '#fff',
              fontSize: '13px', fontWeight: '700',
              padding: '6px 16px', borderRadius: '8px',
            }}>
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div style={{ padding: '16px' }}>
        <div style={{
          fontSize:     '15px', fontWeight: '700',
          color:        C.texte, marginBottom: '4px',
          whiteSpace:   'nowrap', overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {produit.nom}
        </div>

        {produit.description && (
          <div style={{
            fontSize:        '12.5px', color: C.texteClair,
            marginBottom:    '12px', lineHeight: 1.5,
            display:         '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow:        'hidden',
          }}>
            {produit.description}
          </div>
        )}

        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginTop:      produit.description ? 0 : '12px',
        }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: C.or }}>
            {produit.prix.toLocaleString()}
            <span style={{ fontSize: '12px', fontWeight: '500', color: C.texteClair, marginLeft: '3px' }}>
              FCFA
            </span>
          </div>

          <button
            onClick={handleAjouter}
            disabled={produit.stock === 0}
            style={{
              display:    'flex', alignItems: 'center', gap: '6px',
              padding:    '8px 14px', borderRadius: '10px', border: 'none',
              background: ajout
                ? `linear-gradient(135deg,${C.vert},${C.vertClair})`
                : produit.stock === 0
                ? 'rgba(0,0,0,0.08)'
                : `linear-gradient(155deg,${C.orClair},${C.or},${C.orFonce})`,
              color:      ajout ? '#fff' : produit.stock === 0 ? '#999' : C.texte,
              fontSize:   '12.5px', fontWeight: '700',
              cursor:     produit.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow:  ajout || produit.stock === 0
                ? 'none' : '0 4px 12px rgba(212,160,23,0.40)',
            }}
          >
            <FiShoppingCart style={{ fontSize: '14px' }} />
            {ajout ? 'Ajouté !' : '+ Panier'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE PRODUITS
// ─────────────────────────────────────────
function Produits() {
  const [searchParams] = useSearchParams();
  const rechercheParam = searchParams.get('q') || '';
  const { ajouterAuPanier } = usePanier();

  const [tousProduits, setTousProduits] = useState([]);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [categorie, setCategorie] = useState('Tous');

  // Charger tous les produits
  useEffect(() => {
    const charger = async () => {
      try {
        const res = await getProduits();
        const tries = [...res.data.produits].sort((a, b) => a.position - b.position);
        setTousProduits(tries);
      } catch (err) {
        console.error('Erreur chargement produits:', err);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  // Filtrer selon la recherche et la catégorie
  useEffect(() => {
    let resultats = tousProduits;

    // Filtre par catégorie
    if (categorie !== 'Tous') {
      resultats = resultats.filter(p => p.categorie === categorie);
    }

    // Filtre par recherche
    if (rechercheParam) {
      const rechercheLower = rechercheParam.toLowerCase();
      resultats = resultats.filter(p =>
        p.nom.toLowerCase().includes(rechercheLower) ||
        p.description?.toLowerCase().includes(rechercheLower)
      );
    }

    setProduits(resultats);
  }, [rechercheParam, categorie, tousProduits]);

  const categories = ['Tous', ...new Set(tousProduits.map(p => p.categorie))];

  return (
    <div style={{ background: C.fond, minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Titre */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px', fontWeight: '800',
            color: C.texte, marginBottom: '8px',
            fontFamily: 'Georgia, serif',
          }}>
            Nos produits
          </h1>
          <p style={{ fontSize: '15px', color: C.texteClair }}>
            {rechercheParam && `Résultats pour "${rechercheParam}" — `}
            {produits.length} produit{produits.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtres catégories */}
        {categories.length > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '8px', marginBottom: '32px', flexWrap: 'wrap',
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategorie(cat)}
                style={{
                  padding: '8px 20px', borderRadius: '99px',
                  border: `1.5px solid ${categorie === cat ? C.vert : C.bordure}`,
                  background: categorie === cat
                    ? `linear-gradient(135deg,${C.vert},${C.vertClair})`
                    : C.blanc,
                  color: categorie === cat ? '#fff' : C.texteClair,
                  fontSize: '13px', fontWeight: categorie === cat ? '700' : '500',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Chargement */}
        {chargement && (
          <div style={{ textAlign: 'center', padding: '60px', color: C.texteClair }}>
            Chargement...
          </div>
        )}

        {/* Grille produits */}
        {!chargement && produits.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}>
            {produits.map(p => (
              <CarteProduit
                key={p.id}
                produit={p}
                onAjouterPanier={ajouterAuPanier}
              />
            ))}
          </div>
        )}

        {/* Aucun résultat */}
        {!chargement && produits.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px',
            background: C.blanc, borderRadius: '16px',
            border: `1px solid ${C.bordure}`,
            color: C.texteClair,
          }}>
            Aucun produit trouvé.
          </div>
        )}
      </div>
    </div>
  );
}

export default Produits;