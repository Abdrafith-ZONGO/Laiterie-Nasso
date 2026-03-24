import React, { useState, useEffect } from 'react';
import {
  getProduits, creerProduit,
  modifierProduit, supprimerProduit,
} from '../../services/api';
import { supabase } from '../../lib/supabase';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
  FiPackage, FiGrid, FiList,
} from 'react-icons/fi';

// ─────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────
const C = {
  carte:      '#1e2e1e',
  carteHov:   '#243424',
  bordure:    'rgba(90,191,42,0.15)',
  texte:      '#e8f5d0',
  texteClair: 'rgba(232,245,208,0.60)',
  input:      'rgba(255,255,255,0.05)',
  inputBord:  'rgba(90,191,42,0.25)',
  inputFocus: '#5ABF2A',
  vert:       '#5ABF2A',
  vertClair:  '#90D840',
  or:         '#D4A017',
  orClair:    '#F2C040',
  rouge:      '#E53535',
  blanc:      '#FFFFFF',
};

// ─────────────────────────────────────────
// Champ de formulaire réutilisable
// ─────────────────────────────────────────
function Field({ label, type = 'text', placeholder, value, onChange, required = false }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{
        display: 'block', fontSize: '12px', fontWeight: '600',
        color: focus ? C.vert : C.texteClair,
        marginBottom: '5px', transition: 'color 0.2s',
      }}>
        {label} {required && <span style={{ color: C.rouge }}>*</span>}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={()  => setFocus(false)}
        style={{
          width: '100%', background: C.input,
          border: `1.5px solid ${focus ? C.inputFocus : C.inputBord}`,
          borderRadius: '8px', padding: '9px 13px',
          fontSize: '13px', color: C.texte, outline: 'none',
          boxSizing: 'border-box',
          boxShadow: focus ? '0 0 0 3px rgba(90,191,42,0.12)' : 'none',
          transition: 'all 0.2s ease',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────
// Modal — formulaire ajouter/modifier
// ─────────────────────────────────────────
function Modal({ produit, onClose, onSave, totalProduits }) {
  const estModif = !!produit;

  const [form, setForm] = useState({
    nom:         produit?.nom         || '',
    description: produit?.description || '',
    prix:        produit?.prix        || '',
    categorie:   produit?.categorie   || '',
    imageUrl:    produit?.imageUrl    || '',
    stock:       produit?.stock       || 0,
    disponible:  produit?.disponible  ?? true,
    position:    produit?.position    ?? totalProduits + 1,
  });

  const [chargement,    setChargement]    = useState(false);
  const [erreur,        setErreur]        = useState('');
  const [imagePreview,  setImagePreview]  = useState(produit?.imageUrl || '');
  const [uploadEnCours, setUploadEnCours] = useState(false);

  const setField = (key, val) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleImageUpload = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    if (!fichier.type.startsWith('image/')) {
      setErreur('Le fichier doit être une image'); return;
    }
    if (fichier.size > 2 * 1024 * 1024) {
      setErreur('Image trop lourde — max 2MB'); return;
    }

    setUploadEnCours(true);
    setErreur('');

    try {
      const nomFichier = `${Date.now()}_${fichier.name.replace(/\s/g, '_')}`;
      const chemin     = `produits/${nomFichier}`;

      const { error } = await supabase.storage
        .from('produits')
        .upload(chemin, fichier, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data } = supabase.storage
        .from('produits')
        .getPublicUrl(chemin);

      setField('imageUrl', data.publicUrl);
      setImagePreview(data.publicUrl);

    } catch (err) {
      console.error('Erreur upload:', err);
      setErreur("Erreur lors de l'upload de l'image");
    } finally {
      setUploadEnCours(false);
    }
  };

  const handleSave = async () => {
    setErreur('');
    if (!form.nom || !form.prix || !form.categorie) {
      setErreur('Nom, prix et catégorie sont obligatoires'); return;
    }
    setChargement(true);
    try {
      estModif
        ? await modifierProduit(produit.id, form)
        : await creerProduit(form);
      onSave();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur serveur');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(3px)',
      zIndex: 200, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        background: '#1e2e1e', borderRadius: '16px',
        border: `1px solid ${C.bordure}`, width: '100%',
        maxWidth: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.50)',
        overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
      }}>

        {/* En-tête */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.bordure}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: '#1e2e1e', zIndex: 1,
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: C.texte }}>
            {estModif ? 'Modifier le produit' : 'Ajouter un produit'}
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: C.texteClair, cursor: 'pointer', fontSize: '20px',
          }}>
            <FiX />
          </button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Upload image */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '600',
              color: C.texteClair, marginBottom: '8px',
            }}>
              Image du produit
            </label>
            <label style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '16px', borderRadius: '10px',
              border: '1.5px dashed rgba(90,191,42,0.35)',
              background: 'rgba(90,191,42,0.04)',
              cursor: uploadEnCours ? 'not-allowed' : 'pointer',
              minHeight: imagePreview ? 'auto' : '100px',
            }}>
              {imagePreview ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <img src={imagePreview} alt="Aperçu" style={{
                    maxHeight: '140px', maxWidth: '100%',
                    objectFit: 'contain', borderRadius: '8px', marginBottom: '8px',
                  }} />
                  <div style={{ fontSize: '12px', color: C.texteClair }}>
                    Cliquer pour changer l'image
                  </div>
                </div>
              ) : (
                <>
                  <FiPackage style={{ fontSize: '28px', color: 'rgba(90,191,42,0.50)' }} />
                  <div style={{ fontSize: '13px', color: C.texteClair, textAlign: 'center' }}>
                    {uploadEnCours ? 'Upload en cours...' : 'Cliquer pour choisir une image'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(232,245,208,0.35)' }}>
                    JPG, PNG, WEBP — max 2MB
                  </div>
                </>
              )}
              <input type="file" accept="image/*"
                onChange={handleImageUpload} disabled={uploadEnCours}
                style={{ display: 'none' }} />
            </label>
          </div>

          {/* Champs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Nom du produit" placeholder="Yaourt nature 500g"
                value={form.nom} onChange={e => setField('nom', e.target.value)} required />
            </div>
            <Field label="Prix (FCFA)" type="number" placeholder="500"
              value={form.prix} onChange={e => setField('prix', e.target.value)} required />
            <Field label="Catégorie" placeholder="Yaourt, Lait, Burger..."
              value={form.categorie} onChange={e => setField('categorie', e.target.value)} required />
            <Field label="Stock" type="number" placeholder="10"
              value={form.stock} onChange={e => setField('stock', e.target.value)} />

            {/* Position */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '600',
                color: C.texteClair, marginBottom: '5px',
              }}>
                Position d'affichage
                <span style={{ marginLeft: '6px', fontSize: '10.5px', color: 'rgba(232,245,208,0.35)', fontWeight: '400' }}>
                  (1 = en premier)
                </span>
              </label>
              <input
                type="number" min="1"
                placeholder={`${totalProduits + 1} (dernier)`}
                value={form.position}
                onChange={e => setField('position', parseInt(e.target.value) || 1)}
                style={{
                  width: '100%', background: C.input,
                  border: `1.5px solid ${C.inputBord}`,
                  borderRadius: '8px', padding: '9px 13px',
                  fontSize: '13px', color: C.texte,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '600',
              color: C.texteClair, marginBottom: '5px',
            }}>Description</label>
            <textarea
              placeholder="Description du produit..."
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              rows={3}
              style={{
                width: '100%', background: C.input,
                border: `1.5px solid ${C.inputBord}`,
                borderRadius: '8px', padding: '9px 13px',
                fontSize: '13px', color: C.texte,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Toggle disponible */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setField('disponible', !form.disponible)}
              style={{
                width: '42px', height: '24px', borderRadius: '99px', border: 'none',
                background: form.disponible
                  ? 'linear-gradient(135deg, #5ABF2A, #90D840)'
                  : 'rgba(255,255,255,0.15)',
                cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: '3px',
                left: form.disponible ? '21px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </button>
            <span style={{ fontSize: '13px', color: C.texteClair }}>
              {form.disponible ? 'Disponible à la vente' : 'Non disponible'}
            </span>
          </div>

          {/* Erreur */}
          {erreur && (
            <div style={{
              background: 'rgba(229,53,53,0.10)', border: '1px solid rgba(229,53,53,0.30)',
              borderRadius: '8px', padding: '10px 14px',
              marginBottom: '16px', fontSize: '13px', color: C.rouge,
            }}>
              {erreur}
            </div>
          )}

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '10px', borderRadius: '9px',
              border: `1px solid ${C.bordure}`, background: 'transparent',
              color: C.texteClair, fontSize: '13.5px', cursor: 'pointer',
            }}>
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={chargement || uploadEnCours}
              style={{
                flex: 2, padding: '10px', borderRadius: '9px', border: 'none',
                background: chargement || uploadEnCours
                  ? 'rgba(90,191,42,0.4)'
                  : 'linear-gradient(135deg, #5ABF2A, #90D840)',
                color: '#0f1a0f', fontSize: '13.5px', fontWeight: '700',
                cursor: chargement || uploadEnCours ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 14px rgba(90,191,42,0.35)',
              }}
            >
              <FiCheck />
              {chargement      ? 'Sauvegarde...'
               : uploadEnCours ? 'Upload...'
               : estModif      ? 'Modifier'
               : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Carte produit — vue grille
// ─────────────────────────────────────────
function CarteProduit({ p, onModif, onSuppr }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   '#1e2e1e',
        borderRadius: '14px',
        border:       `1px solid ${hov ? 'rgba(90,191,42,0.40)' : 'rgba(90,191,42,0.15)'}`,
        overflow:     'hidden',
        transition:   'all 0.22s ease',
        transform:    hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:    hov
          ? '0 12px 32px rgba(0,0,0,0.40)'
          : '0 2px 10px rgba(0,0,0,0.20)',
      }}
    >
      {/* ── Zone image ──────────────────── */}
      <div style={{
        height:         '180px',
        background:     'rgba(90,191,42,0.06)',
        position:       'relative',
        overflow:       'hidden',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={p.nom}
            style={{
              width:     '100%',
              height:    '100%',
              objectFit: 'cover',
              display:   'block',
              transition: 'transform 0.3s ease',
              transform:  hov ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <FiPackage style={{ fontSize: '48px', color: 'rgba(90,191,42,0.30)' }} />
        )}

        {/* Badge position */}
        <div style={{
          position:     'absolute', top: '10px', left: '10px',
          background:   'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          color:        '#F2C040',
          fontSize:     '11px', fontWeight: '800',
          padding:      '3px 9px', borderRadius: '7px',
          border:       '1px solid rgba(212,160,23,0.30)',
        }}>
          #{p.position}
        </div>

        {/* Badge disponibilité */}
        <div style={{
          position:     'absolute', top: '10px', right: '10px',
          background:   p.disponible
            ? 'rgba(90,191,42,0.20)'
            : 'rgba(229,53,53,0.20)',
          backdropFilter: 'blur(4px)',
          color:        p.disponible ? '#5ABF2A' : '#E53535',
          fontSize:     '10.5px', fontWeight: '700',
          padding:      '3px 9px', borderRadius: '7px',
          border:       `1px solid ${p.disponible
            ? 'rgba(90,191,42,0.35)'
            : 'rgba(229,53,53,0.35)'}`,
        }}>
          {p.disponible ? 'Disponible' : 'Indisponible'}
        </div>

        {/* Overlay actions au hover */}
        <div style={{
          position:       'absolute', inset: 0,
          background:     'rgba(0,0,0,0.45)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '10px',
          opacity:        hov ? 1 : 0,
          transition:     'opacity 0.2s ease',
        }}>
          <button
            onClick={() => onModif(p)}
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              border: '1.5px solid rgba(90,191,42,0.60)',
              background: 'rgba(30,46,30,0.90)',
              color: '#5ABF2A', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => onSuppr(p.id)}
            style={{
              width: '40px', height: '40px', borderRadius: '10px',
              border: '1.5px solid rgba(229,53,53,0.60)',
              background: 'rgba(30,46,30,0.90)',
              color: '#E53535', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {/* ── Infos produit ───────────────── */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{
          fontSize: '14px', fontWeight: '600',
          color: '#e8f5d0', marginBottom: '4px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {p.nom}
        </div>
        <div style={{
          fontSize: '12px', color: C.texteClair, marginBottom: '12px',
        }}>
          {p.categorie} •{' '}
          <span style={{
            color: p.stock === 0 ? '#E53535' : p.stock < 5 ? '#F2C040' : C.texteClair,
          }}>
            {p.stock === 0 ? 'Rupture' : `${p.stock} unités`}
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: '16px', fontWeight: '800', color: '#F2C040',
          }}>
            {p.prix.toLocaleString()} FCFA
          </div>

          {/* Boutons discrets en bas */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onModif(p)}
              style={{
                width: '30px', height: '30px', borderRadius: '8px',
                border: '1px solid rgba(90,191,42,0.25)',
                background: 'rgba(90,191,42,0.08)', color: '#5ABF2A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '13px',
              }}
            >
              <FiEdit2 />
            </button>
            <button
              onClick={() => onSuppr(p.id)}
              style={{
                width: '30px', height: '30px', borderRadius: '8px',
                border: '1px solid rgba(229,53,53,0.25)',
                background: 'rgba(229,53,53,0.08)', color: '#E53535',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '13px',
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE PRODUITS ADMIN
// ─────────────────────────────────────────
function AdminProduits() {
  const [produits,    setProduits]    = useState([]);
  const [chargement,  setChargement]  = useState(true);
  const [modal,       setModal]       = useState(false);
  const [produitEdit, setProduitEdit] = useState(null);
  const [suppConfirm, setSuppConfirm] = useState(null);
  // ── Vue : 'cartes' ou 'tableau' ─────────
  const [vue,         setVue]         = useState('cartes');

  const chargerProduits = async () => {
    setChargement(true);
    try {
      const res   = await getProduits();
      const tries = [...res.data.produits].sort((a, b) => a.position - b.position);
      setProduits(tries);
    } catch (err) {
      console.error('Erreur chargement produits:', err);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { chargerProduits(); }, []);

  const ouvrirAjout = () => { setProduitEdit(null); setModal(true); };
  const ouvrirModif = (p) => { setProduitEdit(p);   setModal(true); };
  const fermerModal = () => { setModal(false); setProduitEdit(null); };
  const apresModal  = () => { fermerModal(); chargerProduits(); };

  const confirmerSuppr = async (id) => {
    try {
      await supprimerProduit(id);
      setSuppConfirm(null);
      chargerProduits();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  return (
    <div>

      {/* ── En-tête page ──────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#e8f5d0' }}>
            Produits
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: C.texteClair }}>
            {produits.length} produit{produits.length > 1 ? 's' : ''} au total
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Switch vue cartes / tableau */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(90,191,42,0.20)',
            borderRadius: '9px', padding: '3px', gap: '3px',
          }}>
            {[
              { id: 'cartes',  icon: <FiGrid />,  label: 'Cartes'  },
              { id: 'tableau', icon: <FiList />,  label: 'Tableau' },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setVue(v.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 12px', borderRadius: '7px', border: 'none',
                  background: vue === v.id
                    ? 'linear-gradient(135deg, #5ABF2A, #90D840)'
                    : 'transparent',
                  color: vue === v.id ? '#0f1a0f' : 'rgba(232,245,208,0.50)',
                  fontSize: '12px', fontWeight: vue === v.id ? '600' : '400',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          {/* Bouton ajouter */}
          <button onClick={ouvrirAjout} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #5ABF2A, #90D840)',
            color: '#0f1a0f', fontSize: '13.5px', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(90,191,42,0.35)',
          }}>
            <FiPlus style={{ fontSize: '16px' }} />
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* Chargement */}
      {chargement && (
        <div style={{ textAlign: 'center', padding: '60px', color: C.texteClair }}>
          Chargement...
        </div>
      )}

      {/* Liste vide */}
      {!chargement && produits.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px',
          background: '#1e2e1e', borderRadius: '14px',
          border: '1px solid rgba(90,191,42,0.15)',
        }}>
          <FiPackage style={{ fontSize: '40px', color: 'rgba(232,245,208,0.30)', marginBottom: '12px' }} />
          <p style={{ color: C.texteClair, margin: 0 }}>
            Aucun produit — cliquez sur "Ajouter un produit"
          </p>
        </div>
      )}

      {/* ════════════════════════════════════
          VUE CARTES
      ════════════════════════════════════ */}
      {!chargement && produits.length > 0 && vue === 'cartes' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {produits.map(p => (
            <CarteProduit
              key={p.id}
              p={p}
              onModif={ouvrirModif}
              onSuppr={setSuppConfirm}
            />
          ))}
        </div>
      )}

      {/* ════════════════════════════════════
          VUE TABLEAU
      ════════════════════════════════════ */}
      {!chargement && produits.length > 0 && vue === 'tableau' && (
        <div style={{
          background: '#1e2e1e', borderRadius: '14px',
          border: '1px solid rgba(90,191,42,0.15)', overflow: 'hidden',
        }}>

          {/* En-tête tableau */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 80px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(90,191,42,0.15)',
            fontSize: '11.5px', fontWeight: '600',
            color: 'rgba(232,245,208,0.50)',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            <span>#</span>
            <span>Produit</span>
            <span>Catégorie</span>
            <span>Prix</span>
            <span>Stock</span>
            <span>Actions</span>
          </div>

          {/* Lignes */}
          {produits.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 80px',
                padding: '12px 20px', alignItems: 'center',
                borderBottom: i < produits.length - 1
                  ? '1px solid rgba(90,191,42,0.08)' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#243424'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{
                fontSize: '12px', fontWeight: '700',
                color: 'rgba(232,245,208,0.40)', textAlign: 'center',
              }}>
                {p.position}
              </span>

              {/* Image + nom */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '10px',
                  background: 'rgba(90,191,42,0.08)',
                  border: '1px solid rgba(90,191,42,0.20)',
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.nom}
                      style={{ width: '52px', height: '52px', objectFit: 'cover' }} />
                  ) : (
                    <FiPackage style={{ color: '#5ABF2A', fontSize: '20px' }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '500', color: '#e8f5d0', marginBottom: '3px' }}>
                    {p.nom}
                  </div>
                  <span style={{
                    fontSize: '10.5px', fontWeight: '600',
                    padding: '2px 8px', borderRadius: '99px',
                    background: p.disponible ? 'rgba(90,191,42,0.12)' : 'rgba(229,53,53,0.12)',
                    color: p.disponible ? '#5ABF2A' : '#E53535',
                  }}>
                    {p.disponible ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>

              <span style={{ fontSize: '13px', color: 'rgba(232,245,208,0.70)' }}>
                {p.categorie}
              </span>

              <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#F2C040' }}>
                {p.prix.toLocaleString()} FCFA
              </span>

              <span style={{
                fontSize: '13px', fontWeight: '500',
                color: p.stock === 0 ? '#E53535' : p.stock < 5 ? '#F2C040' : '#e8f5d0',
              }}>
                {p.stock === 0 ? 'Rupture' : `${p.stock} unités`}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => ouvrirModif(p)} style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  border: '1px solid rgba(90,191,42,0.25)',
                  background: 'rgba(90,191,42,0.08)', color: '#5ABF2A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '14px',
                }}>
                  <FiEdit2 />
                </button>
                <button onClick={() => setSuppConfirm(p.id)} style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  border: '1px solid rgba(229,53,53,0.25)',
                  background: 'rgba(229,53,53,0.08)', color: '#E53535',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '14px',
                }}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          produit={produitEdit}
          onClose={fermerModal}
          onSave={apresModal}
          totalProduits={produits.length}
        />
      )}

      {/* Confirmation suppression */}
      {suppConfirm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(3px)',
          zIndex: 200, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '20px',
        }}>
          <div style={{
            background: '#1e2e1e', borderRadius: '14px',
            border: '1px solid rgba(229,53,53,0.30)',
            padding: '28px', maxWidth: '360px', width: '100%',
            textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.50)',
          }}>
            <FiTrash2 style={{ fontSize: '32px', color: '#E53535', marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: '#e8f5d0' }}>
              Supprimer ce produit ?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: C.texteClair }}>
              Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSuppConfirm(null)} style={{
                flex: 1, padding: '10px', borderRadius: '9px',
                border: '1px solid rgba(90,191,42,0.20)',
                background: 'transparent', color: 'rgba(232,245,208,0.70)',
                fontSize: '13.5px', cursor: 'pointer',
              }}>
                Annuler
              </button>
              <button onClick={() => confirmerSuppr(suppConfirm)} style={{
                flex: 1, padding: '10px', borderRadius: '9px', border: 'none',
                background: 'linear-gradient(135deg, #E53535, #c02020)',
                color: '#fff', fontSize: '13.5px', fontWeight: '700',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(229,53,53,0.35)',
              }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminProduits;