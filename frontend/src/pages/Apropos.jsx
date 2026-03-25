import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiAward, FiUsers, FiCoffee, FiMapPin, FiClock } from 'react-icons/fi';

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
      background: C.blanc,
      borderRadius: '16px',
      border: `1px solid ${C.bordure}`,
      padding: '28px 20px',
      textAlign: 'center',
      transition: 'all 0.25s ease',
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        margin: '0 auto 20px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '28px',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: C.texte,
        marginBottom: '10px',
      }}>
        {titre}
      </h3>
      <p style={{
        fontSize: '13.5px',
        color: C.texteClair,
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE À PROPOS
// ─────────────────────────────────────────
function Apropos() {
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
          alt="Laiterie Nasoo"
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
            À propos de nous
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Découvrez qui nous sommes et ce qui nous anime
          </p>
        </div>
      </section>

      {/* ── QUI SOMMES-NOUS ? ─────────────────────────── */}
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
                Qui sommes-nous ?
              </h2>
              <p style={{
                fontSize: '15px',
                color: C.texteClair,
                lineHeight: 1.8,
                marginBottom: '20px',
              }}>
                Laiterie Nasoo est une entreprise familiale basée à Ouagadougou,
                spécialisée dans la production de produits laitiers frais et de
                fast-food de qualité. Depuis notre création, nous mettons un point
                d'honneur à offrir des produits sains, savoureux et accessibles à tous.
              </p>
              <p style={{
                fontSize: '15px',
                color: C.texteClair,
                lineHeight: 1.8,
                marginBottom: '20px',
              }}>
                Notre nom "Nasoo" est un hommage à nos racines et à notre engagement
                envers la communauté locale. Nous travaillons avec des producteurs
                locaux pour garantir la fraîcheur et la qualité de nos produits.
              </p>
              <p style={{
                fontSize: '15px',
                color: C.texteClair,
                lineHeight: 1.8,
              }}>
                Aujourd'hui, nous sommes fiers de servir notre clientèle avec passion
                et dévouement, en proposant une gamme variée de produits qui allient
                tradition et modernité.
              </p>
            </div>
            <div>
              <img
                src="/images/ferme_nasoo.jpg"
                alt="L'équipe de Laiterie Nasoo"
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
                  <span style={{ fontSize: '28px', fontWeight: '800', color: C.or }}>+30</span>
                  <p style={{ fontSize: '12px', color: C.texteClair, margin: 0 }}>Ans d'expérience</p>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '12px',
                  background: C.blanc,
                  borderRadius: '12px',
                  border: `1px solid ${C.bordure}`,
                  flex: 1,
                }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: C.or }}>100%</span>
                  <p style={{ fontSize: '12px', color: C.texteClair, margin: 0 }}>Local</p>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '12px',
                  background: C.blanc,
                  borderRadius: '12px',
                  border: `1px solid ${C.bordure}`,
                  flex: 1,
                }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: C.or }}>24/7</span>
                  <p style={{ fontSize: '12px', color: C.texteClair, margin: 0 }}>Service client</p>
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
              Ce qui nous guide chaque jour
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
              description="La passion du métier nous anime. Chaque produit est fait avec amour et dévouement."
            />
            <ValeurCard
              icon={<FiAward />}
              titre="Qualité"
              description="Des ingrédients frais, sélectionnés avec soin. Du pré à votre table, la qualité est notre priorité."
            />
            <ValeurCard
              icon={<FiUsers />}
              titre="Proximité"
              description="À l'écoute de nos clients, nous nous engageons à offrir un service chaleureux et personnalisé."
            />
            <ValeurCard
              icon={<FiCoffee />}
              titre="Authenticité"
              description="Des recettes traditionnelles respectées, pour des saveurs authentiques qui rappellent le bon goût d'antan."
            />
          </div>
        </div>
      </section>

      {/* ── NOTRE ENGAGEMENT ──────────────────────────── */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: C.texte,
            marginBottom: '24px',
            fontFamily: 'Georgia, serif',
          }}>
            Notre engagement
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '32px',
          }}>
            <div style={{
              background: C.blanc,
              borderRadius: '16px',
              border: `1px solid ${C.bordure}`,
              padding: '24px',
            }}>
              <FiMapPin style={{ fontSize: '32px', color: C.vert, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: C.texte, marginBottom: '8px' }}>
                Produits locaux
              </h3>
              <p style={{ fontSize: '13px', color: C.texteClair }}>
                Nous travaillons avec des producteurs locaux pour soutenir l'économie de notre région.
              </p>
            </div>
            <div style={{
              background: C.blanc,
              borderRadius: '16px',
              border: `1px solid ${C.bordure}`,
              padding: '24px',
            }}>
              <FiClock style={{ fontSize: '32px', color: C.vert, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: C.texte, marginBottom: '8px' }}>
                Fraîcheur garantie
              </h3>
              <p style={{ fontSize: '13px', color: C.texteClair }}>
                Nos produits sont préparés quotidiennement pour vous offrir le meilleur de la fraîcheur.
              </p>
            </div>
            <div style={{
              background: C.blanc,
              borderRadius: '16px',
              border: `1px solid ${C.bordure}`,
              padding: '24px',
            }}>
              <FiHeart style={{ fontSize: '32px', color: C.vert, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: C.texte, marginBottom: '8px' }}>
                Service client
              </h3>
              <p style={{ fontSize: '13px', color: C.texteClair }}>
                Une équipe à votre écoute pour répondre à toutes vos questions et suggestions.
              </p>
            </div>
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

export default Apropos;