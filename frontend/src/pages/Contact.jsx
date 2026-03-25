import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, FiPhone, FiMail, FiClock, 
  FiFacebook, FiInstagram, FiTwitter, FiMessageCircle
} from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa6';

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
// COMPOSANT : Carte d'information
// ─────────────────────────────────────────
function InfoCard({ icon, title, content, link, linkText }) {
  return (
    <div style={{
      background: C.blanc,
      borderRadius: '16px',
      border: `1px solid ${C.bordure}`,
      padding: '24px',
      textAlign: 'center',
      transition: 'all 0.25s ease',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        margin: '0 auto 16px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: '#fff',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '700',
        color: C.texte,
        marginBottom: '8px',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: C.texteClair,
        marginBottom: link ? '12px' : '0',
      }}>
        {content}
      </p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            color: C.or,
            fontSize: '13px',
            fontWeight: '500',
            textDecoration: 'none',
          }}
        >
          {linkText} →
        </a>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE CONTACT
// ─────────────────────────────────────────
function Contact() {
  // Coordonnées
  const tel = '70123456';
  const telFormatted = '70 12 34 56';
  const email = 'contact@laiterienasoo.bf';
  const whatsappMessage = encodeURIComponent('Bonjour Laiterie Nasoo, j\'ai une question concernant vos produits.');
  
  // Google Maps (à remplacer par ta vraie adresse)
  const mapsUrl = 'https://maps.google.com/?q=Ouagadougou+Secteur+15+Burkina+Faso';

  return (
    <div style={{ background: C.fond, minHeight: '100vh' }}>

      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, ${C.vertFonce}, #2D4A1E)`,
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '16px',
          fontFamily: 'Georgia, serif',
        }}>
          Contact
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          N'hésitez pas à nous contacter pour toute question ou commande
        </p>
      </section>

      {/* ── CARTES D'INFORMATIONS ─────────────────────── */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <InfoCard
            icon={<FiPhone />}
            title="Téléphone"
            content={telFormatted}
            link={`tel:${tel}`}
            linkText="Appeler"
          />
          <InfoCard
            icon={<FiMail />}
            title="Email"
            content={email}
            link={`mailto:${email}`}
            linkText="Écrire"
          />
          <InfoCard
            icon={<FiMessageCircle />}
            title="WhatsApp"
            content="Réponse rapide"
            link={`https://wa.me/226${tel}?text=${whatsappMessage}`}
            linkText="Envoyer un message"
          />
          <InfoCard
            icon={<FiClock />}
            title="Horaires"
            content="Mardi - Samedi : 8h-12h30 / 15h30-19h"
          />
        </div>
      </section>

      {/* ── ADRESSE ET CARTE ──────────────────────────── */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {/* Adresse */}
          <div style={{
            background: C.blanc,
            borderRadius: '16px',
            border: `1px solid ${C.bordure}`,
            padding: '28px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <FiMapPin style={{ fontSize: '28px', color: C.vert }} />
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: C.texte,
                margin: 0,
              }}>
                Nous trouver
              </h2>
            </div>
            <p style={{
              fontSize: '14px',
              color: C.texteClair,
              lineHeight: 1.6,
              marginBottom: '24px',
            }}>
              Ouagadougou, Secteur 15<br />
              Rue des Producteurs<br />
              Burkina Faso
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: `linear-gradient(135deg, ${C.vert}, ${C.vertClair})`,
                borderRadius: '99px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Ouvrir dans Google Maps →
            </a>
          </div>

          {/* Carte (iframe Google Maps) */}
          <div style={{
            background: C.blanc,
            borderRadius: '16px',
            border: `1px solid ${C.bordure}`,
            overflow: 'hidden',
            height: '300px',
          }}>
            <iframe
              title="Google Maps - Laiterie Nasoo"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.937316814976!2d-1.5370647!3d12.3714277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2ebc4f5b3b9f7f%3A0x7c8b3f9e5a2b1c4d!2sOuagadougou!5e0!3m2!1sfr!2sbf!4v1700000000000!5m2!1sfr!2sbf"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ── RÉSEAUX SOCIAUX ──────────────────────────── */}
      <section style={{
        background: C.blanc,
        padding: '48px 24px',
        borderTop: `1px solid ${C.bordure}`,
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: C.texte,
            marginBottom: '8px',
            fontFamily: 'Georgia, serif',
          }}>
            Suivez-nous
          </h2>
          <p style={{
            fontSize: '14px',
            color: C.texteClair,
            marginBottom: '32px',
          }}>
            Restez connectés pour découvrir nos nouveautés et promotions
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
          }}>
            <a
              href="https://facebook.com/laiterienasoo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#1877F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                transition: 'transform 0.2s',
              }}
            >
              <FiFacebook />
            </a>
            <a
              href="https://instagram.com/laiterienasoo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#E4405F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                transition: 'transform 0.2s',
              }}
            >
              <FiInstagram />
            </a>
            <a
              href="https://twitter.com/laiterienasoo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#1DA1F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                transition: 'transform 0.2s',
              }}
            >
              <FiTwitter />
            </a>
            <a
              href="https://tiktok.com/@laiterienasoo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                transition: 'transform 0.2s',
              }}
            >
              <FaTiktok />
            </a>
            <a
              href={`https://wa.me/226${tel}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                transition: 'transform 0.2s',
              }}
            >
              <FiMessageCircle />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;