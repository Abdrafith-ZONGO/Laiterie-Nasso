import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProduits } from '../services/api';
import { usePanier } from '../context/PanierContext';
import { FiShoppingCart, FiArrowRight, FiStar } from 'react-icons/fi';

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

const HERO_IMAGE = '/images/hero-nasoo.png';

// ─────────────────────────────────────────
// Carte produit
// ─────────────────────────────────────────
function CarteProduit({ produit, onAjouterPanier }) {
  const [hov,   setHov]   = useState(false);
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
// PAGE ACCUEIL
// Utilise le contexte Panier (ajouterAuPanier)
// ─────────────────────────────────────────
function Accueil() {
  const { ajouterAuPanier, totalArticles } = usePanier();
  const [produits,   setProduits]   = useState([]);
  const [chargement, setChargement] = useState(true);
  const [categorie,  setCategorie]  = useState('Tous');

  useEffect(() => {
    const charger = async () => {
      try {
        const res   = await getProduits();
        const tries = [...res.data.produits]
          .sort((a, b) => a.position - b.position);
        setProduits(tries);
      } catch (err) {
        console.error('Erreur chargement produits:', err);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const categories      = ['Tous', ...new Set(produits.map(p => p.categorie))];
  const produitsFiltres = categorie === 'Tous'
    ? produits
    : produits.filter(p => p.categorie === categorie);

  return (
    <div style={{ background: C.fond, minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        position: 'relative', height: '580px',
        overflow: 'hidden', display: 'flex', alignItems: 'center',
      }}>
        <img
          src={HERO_IMAGE}
          alt="Laiterie Nasoo"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />
        <div style={{
          position:   'absolute', inset: 0,
          background: 'linear-gradient(100deg,rgba(10,25,5,0.88) 0%,rgba(10,25,5,0.65) 50%,rgba(10,25,5,0.30) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '0 60px', maxWidth: '680px' }}>
          <div style={{
            display:      'inline-flex', alignItems: 'center', gap: '6px',
            background:   'rgba(212,160,23,0.18)',
            border:       '1px solid rgba(212,160,23,0.40)',
            borderRadius: '99px', padding: '5px 14px', marginBottom: '20px',
          }}>
            <FiStar style={{ color: C.orClair, fontSize: '12px' }} />
            <span style={{ color: C.orClair, fontSize: '12px', fontWeight: '600' }}>
              Fraîcheur et Qualité depuis 2010
            </span>
          </div>

          <h1 style={{
            fontSize:     '48px', fontWeight: '900',
            color:        '#fff', lineHeight: 1.1,
            marginBottom: '16px', fontFamily: 'Georgia, serif',
          }}>
            La Laiterie{' '}
            <span style={{ color: C.vert }}>Nasoo</span>
            <br />
            <span style={{
              fontSize:   '32px', fontWeight: '600',
              color:      'rgba(255,255,255,0.75)',
              fontFamily: 'system-ui, sans-serif',
            }}>
              à Ouagadougou
            </span>
          </h1>

          <p style={{
            fontSize:     '16px', color: 'rgba(255,255,255,0.70)',
            lineHeight:   1.7, marginBottom: '32px', maxWidth: '480px',
          }}>
            Produits laitiers frais, burgers savoureux et boissons.
            Le goût du frais livré chez vous ou à emporter.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="#produits" style={{
              display:        'inline-flex', alignItems: 'center', gap: '8px',
              padding:        '13px 28px', borderRadius: '99px',
              background:     `linear-gradient(155deg,${C.orClair},${C.or},${C.orFonce})`,
              color:          C.texte, fontSize: '14px', fontWeight: '700',
              textDecoration: 'none',
              boxShadow:      '0 6px 20px rgba(212,160,23,0.50)',
            }}>
              Voir nos produits <FiArrowRight style={{ fontSize: '15px' }} />
            </a>
            <Link to="/histoire" style={{
              display:        'inline-flex', alignItems: 'center', gap: '8px',
              padding:        '13px 28px', borderRadius: '99px',
              border:         '2px solid rgba(255,255,255,0.45)',
              background:     'transparent',
              color:          '#fff', fontSize: '14px', fontWeight: '500',
              textDecoration: 'none',
            }}>
              Notre histoire
            </Link>
          </div>
        </div>

        {/* Stats hero */}
        <div style={{
          position:       'absolute', bottom: 0, left: 0, right: 0,
          background:     'rgba(10,25,5,0.75)',
          backdropFilter: 'blur(8px)',
          borderTop:      '1px solid rgba(255,255,255,0.08)',
          display:        'flex', justifyContent: 'center',
        }}>
          {[
            { val: `${produits.length}+`, label: 'Produits frais'   },
            { val: '100%',                label: 'Qualité garantie' },
            { val: 'Chaque jour',         label: 'Nouveautés'       },
            { val: 'Ouaga',               label: 'Livraison'        },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, maxWidth: '200px',
              padding: '16px 20px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: C.orClair }}>{s.val}</div>
              <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUITS ─────────────────────────────────── */}
      <section id="produits" style={{ padding: '60px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display:       'inline-block',
            background:    'rgba(90,191,42,0.10)',
            border:        `1px solid ${C.bordure}`,
            borderRadius:  '99px', padding: '4px 16px',
            fontSize:      '12px', fontWeight: '600',
            color:         C.vertFonce, marginBottom: '12px',
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Nos Produits
          </div>
          <h2 style={{
            fontSize:   '32px', fontWeight: '800',
            color:      C.texte, marginBottom: '10px',
            fontFamily: 'Georgia, serif',
          }}>
            Fraîcheur et Saveurs
          </h2>
          <p style={{ fontSize: '15px', color: C.texteClair, maxWidth: '480px', margin: '0 auto' }}>
            Découvrez notre sélection de produits laitiers et fast-food préparés avec soin.
          </p>
        </div>

        {/* Filtres */}
        {categories.length > 1 && (
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '8px', marginBottom: '36px', flexWrap: 'wrap',
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategorie(cat)}
                style={{
                  padding:    '8px 20px', borderRadius: '99px',
                  border:     `1.5px solid ${categorie === cat ? C.vert : C.bordure}`,
                  background: categorie === cat
                    ? `linear-gradient(135deg,${C.vert},${C.vertClair})`
                    : C.blanc,
                  color:      categorie === cat ? '#fff' : C.texteClair,
                  fontSize:   '13px',
                  fontWeight: categorie === cat ? '700' : '500',
                  cursor:     'pointer', transition: 'all 0.2s ease',
                  boxShadow:  categorie === cat ? '0 4px 12px rgba(90,191,42,0.30)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {chargement && (
          <div style={{ textAlign: 'center', padding: '60px', color: C.texteClair }}>
            Chargement des produits...
          </div>
        )}

        {!chargement && produitsFiltres.length > 0 && (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
            gap:                 '20px',
            maxWidth:            '1200px',
            margin:              '0 auto',
          }}>
            {produitsFiltres.map(p => (
              <CarteProduit
                key={p.id}
                produit={p}
                onAjouterPanier={ajouterAuPanier}
              />
            ))}
          </div>
        )}

        {!chargement && produitsFiltres.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: C.texteClair }}>
            Aucun produit dans cette catégorie.
          </div>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg,${C.vertFonce},#2D4A1E)`,
        padding:    '60px 40px', textAlign: 'center',
      }}>
        <h2 style={{
          fontSize:   '28px', fontWeight: '800',
          color:      '#fff', marginBottom: '12px',
          fontFamily: 'Georgia, serif',
        }}>
          Vous avez une question ?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', marginBottom: '28px' }}>
          Contactez-nous ou passez nous voir à Ouagadougou
        </p>
        <Link to="/contact" style={{
          display:        'inline-flex', alignItems: 'center', gap: '8px',
          padding:        '13px 32px', borderRadius: '99px',
          background:     `linear-gradient(155deg,${C.orClair},${C.or})`,
          color:          C.texte, fontSize: '14px', fontWeight: '700',
          textDecoration: 'none',
          boxShadow:      '0 6px 20px rgba(212,160,23,0.40)',
        }}>
          Nous contacter <FiArrowRight />
        </Link>
      </section>

    </div>
  );
}

export default Accueil;