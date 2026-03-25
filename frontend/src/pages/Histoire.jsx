import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiHeart, FiAward } from 'react-icons/fi';

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
// COMPOSANT : Carte de valeur
// ─────────────────────────────────────────
function ValeurCard({ icon, titre, description }) {
  return (
    <div style={{
      background:   C.blanc,
      borderRadius: '16px',
      border:       `1px solid ${C.bordure}`,
      padding:      '28px 20px',
      textAlign:    'center',
      transition:   'all 0.25s ease',
      boxShadow:    '0 2px 12px rgba(30,90,8,0.06)',
    }}>
      <div style={{
        width:          '60px',
        height:         '60px',
        margin:         '0 auto 20px',
        borderRadius:   '50%',
        background:     `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          '#fff',
        fontSize:       '28px',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize:     '18px',
        fontWeight:   '700',
        color:        C.texte,
        marginBottom: '10px',
      }}>
        {titre}
      </h3>
      <p style={{
        fontSize:   '13.5px',
        color:      C.texteClair,
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE HISTOIRE
// ─────────────────────────────────────────
function Histoire() {
  return (
    <div style={{ background: C.fond, minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        height: '450px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src="/images/hero-nasoo.png"
          alt="La ferme Laiterie Nasoo"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10,25,5,0.85) 0%, rgba(10,25,5,0.60) 100%)',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 24px',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#fff',
            marginBottom: '16px',
            fontFamily: 'Georgia, serif',
          }}>
            Notre histoire
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Depuis 1990, une histoire de passion, de tradition et de qualité
          </p>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ─────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: C.texte,
                marginBottom: '20px',
                fontFamily: 'Georgia, serif',
              }}>
                Une tradition familiale
              </h2>
              <p style={{
                fontSize: '15px',
                color: C.texteClair,
                lineHeight: 1.8,
                marginBottom: '20px',
              }}>
                L'aventure de Laiterie Nasoo commence en 1990, quand Mamadou Nasoo,
                éleveur passionné, décide de transformer le lait de ses vaches en
                fromages et yaourts de qualité. Ce qui n'était au départ qu'une
                petite production familiale est devenu, au fil des années, une
                véritable institution à Ouagadougou.
              </p>
              <p style={{
                fontSize: '15px',
                color: C.texteClair,
                lineHeight: 1.8,
                marginBottom: '20px',
              }}>
                Aujourd'hui, c'est la troisième génération qui perpétue ce savoir-faire,
                en alliant traditions ancestrales et techniques modernes. Nos vaches
                continuent de paître dans les pâturages de la région, garantissant
                un lait d'une qualité exceptionnelle.
              </p>
              <p style={{
                fontSize: '15px',
                color: C.texteClair,
                lineHeight: 1.8,
              }}>
                En 2020, nous avons élargi notre offre avec un espace fast-food,
                pour faire découvrir nos produits sous une forme nouvelle et
                savoureuse. Un pari réussi qui nous permet aujourd'hui de partager
                notre passion avec encore plus de clients.
              </p>
            </div>
            <div>
              <img
                src="/images/ferme_nasoo.jpg"
                alt="La ferme Nasoo"
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }}
              />
              <div style={{
                marginTop: '20px',
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '12px',
                  background: C.blanc,
                  borderRadius: '12px',
                  border: `1px solid ${C.bordure}`,
                  flex: 1,
                }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: C.or }}>1990</span>
                  <p style={{ fontSize: '12px', color: C.texteClair, margin: 0 }}>Année de création</p>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '12px',
                  background: C.blanc,
                  borderRadius: '12px',
                  border: `1px solid ${C.bordure}`,
                  flex: 1,
                }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: C.or }}>3</span>
                  <p style={{ fontSize: '12px', color: C.texteClair, margin: 0 }}>Générations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ───────────────────────────────── */}
      <section style={{ padding: '60px 24px', background: C.blanc }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: C.texte,
              marginBottom: '12px',
              fontFamily: 'Georgia, serif',
            }}>
              Nos valeurs
            </h2>
            <p style={{ fontSize: '15px', color: C.texteClair, maxWidth: '600px', margin: '0 auto' }}>
              Ce qui nous guide chaque jour depuis plus de 30 ans
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}>
            <ValeurCard
              icon={<FiHeart />}
              titre="Passion"
              description="La passion du métier se transmet de génération en génération. Chaque produit est fait avec amour."
            />
            <ValeurCard
              icon={<FiAward />}
              titre="Qualité"
              description="Du pré à votre table, nous surveillons chaque étape pour vous offrir le meilleur."
            />
            <ValeurCard
              icon={<FiMapPin />}
              titre="Terroir"
              description="Fiers de nos racines burkinabè, nous valorisons les produits locaux et les savoir-faire traditionnels."
            />
            <ValeurCard
              icon={<FiClock />}
              titre="Authenticité"
              description="Des recettes traditionnelles respectées, pour des saveurs authentiques et inoubliables."
            />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, ${C.vertFonce}, #2D4A1E)`,
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '16px',
            fontFamily: 'Georgia, serif',
          }}>
            Venez nous découvrir
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '28px',
          }}>
            Passez nous voir à la ferme ou dans notre espace de vente pour déguster nos produits
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              to="/produits"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '99px',
                background: `linear-gradient(155deg, ${C.orClair}, ${C.or})`,
                color: C.texte,
                fontSize: '14px',
                fontWeight: '700',
                textDecoration: 'none',
              }}
            >
              Voir nos produits
            </Link>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '99px',
                border: '2px solid rgba(255,255,255,0.45)',
                background: 'transparent',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Histoire;