import React, { useState, useMemo } from 'react'
import annonceData from '../public/annonces.json'
import {
  Menu, X, ChevronLeft, ChevronRight, ArrowLeft, ArrowUpRight, ArrowUp,
  MapPin, Phone, Mail, Search, SlidersHorizontal,
  Bed, Bath, Square, Ruler, Layers, Calendar, Flame,
  Home, Key, FileText, Download, Building2, Car, Check,
  Users, Warehouse, Briefcase,
  Linkedin, Instagram, ExternalLink, Send,
} from './icons'

export const DEFAULT_LISTINGS = [
  {
    ref: 'NVM26098', slug: 'appartement-t4-meuble-francaltroff',
    type: 'appartement', transaction: 'location',
    title: 'Appartement T4 meublé · 1ᵉʳ étage', city: 'Francaltroff', postalCode: '57670',
    price: 570, priceUnit: '€ / mois CC', honoraires: 0,
    surface: 102, rooms: 4, bedrooms: 2, bathrooms: 1,
    floor: '1er et dernier étage', floorNum: 1, elevator: false, yearBuilt: 1920,
    heating: 'Chaudière fioul', furnished: true, cave: false, parking: 'Facilité', hasParking: true,
    balcony: false, terrace: false, garden: false,
    dpe: 'F', dpeValue: 380, ges: 'D', gesValue: 28,
    availableFrom: '1er mai 2026',
    description: "Appartement de 104 m² au centre de Francaltroff, au 1ᵉʳ et dernier étage d'un petit immeuble. L'appartement est loué meublé (102 m² habitables) et se compose d'un salon/séjour avec un beau volume, un hall d'entrée, 2 chambres, et une cuisine aménagée donnant sur un grand cellier pour le rangement.\n\nSalle de bain avec WC. Chauffage central fioul individuel, sous compteur d'eau. Facilité de parking. Loyer mensuel 570 € charges comprises. Libre au 1ᵉʳ mai.",
    fichePdf: null,
    photoCount: 8,
    photoLabels: ["Façade de l'immeuble", 'Salon / séjour', 'Cuisine aménagée', 'Chambre principale', 'Chambre 2', 'Salle de bain', 'Cellier', 'Vue extérieure'],
    publishedAt: '2026-04-12', isNew: true,
  },
  {
    ref: 'RCE26012', slug: 'maison-alsacienne-obernai',
    type: 'maison', transaction: 'vente',
    title: 'Maison alsacienne à colombages', city: 'Obernai', postalCode: '67210',
    price: 295000, priceUnit: '€', honoraires: 'Honoraires charge vendeur',
    surface: 142, landSurface: 480, rooms: 5, bedrooms: 3, bathrooms: 1,
    floor: 'R+1 + combles', floorNum: 0, elevator: false, yearBuilt: 1875,
    heating: 'Pompe à chaleur air-eau', furnished: false, cave: true,
    parking: '2 places extérieures', hasParking: true, balcony: false, terrace: false, garden: true,
    dpe: 'D', dpeValue: 195, ges: 'C', gesValue: 18,
    availableFrom: 'Immédiatement',
    description: "Charmante maison alsacienne à colombages au cœur d'Obernai, entièrement rénovée en 2022 avec respect des matériaux d'origine.\n\nLe rez-de-chaussée se compose d'un grand séjour avec cheminée, d'une cuisine ouverte équipée et d'une véranda donnant sur le jardin clos. À l'étage : trois chambres, une salle de bain et un dressing. Combles aménageables. Cave voûtée.\n\nDPE D après rénovation thermique complète (isolation toiture, ITE, menuiseries triple vitrage, PAC air-eau). Honoraires à charge du vendeur.",
    fichePdf: null,
    photoCount: 12,
    photoLabels: ['Façade colombages', 'Séjour avec cheminée', 'Cuisine ouverte', 'Véranda', 'Jardin clos', 'Chambre parentale'],
    publishedAt: '2026-04-02', isNew: false,
  },
  {
    ref: 'RCE26023', slug: 'appartement-t1-strasbourg-centre',
    type: 'appartement', transaction: 'location',
    title: 'T1 meublé · centre historique', city: 'Strasbourg', postalCode: '67000',
    price: 540, priceUnit: '€ / mois CC', honoraires: 432,
    surface: 24, rooms: 1, bedrooms: 0, bathrooms: 1,
    floor: '3ᵉ étage sans ascenseur', floorNum: 3, elevator: false, yearBuilt: 1890,
    heating: 'Électrique individuel', furnished: true, cave: true, parking: 'Non', hasParking: false,
    balcony: false, terrace: false, garden: false,
    dpe: 'E', dpeValue: 268, ges: 'B', gesValue: 8,
    availableFrom: 'Immédiatement',
    description: "Studio (T1) meublé de 24 m² dans un immeuble bourgeois du centre historique de Strasbourg, à 5 minutes à pied de la cathédrale.\n\nPièce à vivre avec coin nuit, kitchenette équipée (plaques, four, lave-linge), salle d'eau avec WC. Cave en sous-sol. Idéal étudiant ou jeune actif.",
    fichePdf: null,
    photoCount: 6,
    photoLabels: ['Façade rue', 'Pièce de vie', 'Kitchenette', "Salle d'eau", 'Vue depuis fenêtre'],
    publishedAt: '2026-04-18', isNew: true,
  },
  {
    ref: 'RCE26031', slug: 'appartement-t3-schiltigheim',
    type: 'appartement', transaction: 'vente',
    title: 'Appartement T3 lumineux avec balcon', city: 'Schiltigheim', postalCode: '67300',
    price: 198000, priceUnit: '€', honoraires: 'Honoraires charge vendeur',
    surface: 68, rooms: 3, bedrooms: 2, bathrooms: 1,
    floor: '2ᵉ étage avec ascenseur', floorNum: 2, elevator: true, yearBuilt: 2008,
    heating: 'Gaz collectif', furnished: false, cave: true,
    parking: '1 place couverte', hasParking: true, balcony: true, terrace: false, garden: false,
    dpe: 'C', dpeValue: 142, ges: 'C', gesValue: 16,
    availableFrom: '3 mois',
    description: "Appartement T3 traversant de 68 m² dans une résidence récente avec ascenseur. Séjour de 28 m² ouvert sur balcon orienté sud-ouest, deux chambres avec placards, cuisine séparée équipée, salle de bain et WC séparés.\n\nCave et place de parking couverte incluses. Copropriété bien gérée, charges raisonnables (~120 €/mois).",
    fichePdf: null,
    photoCount: 9,
    photoLabels: ['Façade résidence', 'Séjour balcon', 'Cuisine équipée', 'Chambre 1', 'Chambre 2', 'Balcon'],
    publishedAt: '2026-03-28', isNew: false,
  },
  {
    ref: 'RCE26045', slug: 'appartement-t2-illkirch',
    type: 'appartement', transaction: 'location',
    title: 'T2 rénové · proche tramway', city: 'Illkirch-Graffenstaden', postalCode: '67400',
    price: 720, priceUnit: '€ / mois CC', honoraires: 560,
    surface: 48, rooms: 2, bedrooms: 1, bathrooms: 1,
    floor: '4ᵉ étage avec ascenseur', floorNum: 4, elevator: true, yearBuilt: 1975,
    heating: 'Chaudière individuelle gaz', furnished: false, cave: true, parking: 'Non', hasParking: false,
    balcony: false, terrace: false, garden: false,
    dpe: 'D', dpeValue: 188, ges: 'D', gesValue: 32,
    availableFrom: '1er juin 2026',
    description: "T2 entièrement rénové en 2025 par nos équipes : peinture neuve, sol stratifié, cuisine équipée, salle de bain refaite. Séjour de 22 m² avec accès loggia, chambre de 13 m².\n\nÀ 3 minutes à pied de la station de tram Baggersee. Idéal couple ou personne seule en mobilité douce.",
    fichePdf: null,
    photoCount: 7,
    photoLabels: ['Façade', 'Séjour rénové', 'Cuisine neuve', 'Chambre', 'Salle de bain', 'Loggia'],
    publishedAt: '2026-04-22', isNew: true,
  },
  {
    ref: 'RCE26052', slug: 'maison-village-molsheim',
    type: 'maison', transaction: 'vente',
    title: 'Maison de village avec cour', city: 'Molsheim', postalCode: '67120',
    price: 245000, priceUnit: '€', honoraires: 'Honoraires charge vendeur',
    surface: 110, landSurface: 220, rooms: 4, bedrooms: 3, bathrooms: 1,
    floor: 'R+1', floorNum: 0, elevator: false, yearBuilt: 1920,
    heating: 'Gaz de ville', furnished: false, cave: true,
    parking: '1 place dans la cour', hasParking: true, balcony: false, terrace: true, garden: false,
    dpe: 'E', dpeValue: 258, ges: 'D', gesValue: 34,
    availableFrom: 'Immédiatement',
    description: "Maison de village de 110 m² avec petite cour intérieure, à 5 minutes à pied du centre de Molsheim.\n\nRez-de-chaussée : entrée, salon, salle à manger, cuisine, WC. Étage : 3 chambres, salle de bain. Combles. Cave. Travaux de rafraîchissement à prévoir, fort potentiel.",
    fichePdf: null,
    photoCount: 8,
    photoLabels: ['Façade rue', 'Cour intérieure', 'Salon', 'Cuisine', 'Chambre principale', 'Salle de bain'],
    publishedAt: '2026-03-15', isNew: false,
  },
  {
    ref: 'RCE26060', slug: 'immeuble-rapport-strasbourg',
    type: 'immeuble', transaction: 'vente',
    title: 'Immeuble de rapport · 4 lots', city: 'Strasbourg', postalCode: '67100',
    price: 685000, priceUnit: '€', honoraires: 'Honoraires charge vendeur',
    surface: 312, landSurface: 180, rooms: 12, bedrooms: 7, bathrooms: 4,
    floor: 'R+3', floorNum: 0, elevator: false, yearBuilt: 1905,
    heating: 'Individuel par lot', furnished: false, cave: true, parking: 'Non', hasParking: false,
    balcony: false, terrace: false, garden: false, yieldGross: 6.8,
    dpe: 'E', dpeValue: 245, ges: 'D', gesValue: 30,
    availableFrom: 'Immédiatement',
    description: "Immeuble de rapport entièrement loué à Strasbourg-Neudorf, composé de 4 lots (1 T2, 2 T3, 1 T4). Rendement brut actuel ~6,8 %.\n\nBon état général, façade ravalée en 2020. Cage d'escalier rénovée. Compteurs individuels. Idéal investisseur cherchant un actif clés en main avec gestion possible par nos équipes.",
    fichePdf: null,
    photoCount: 10,
    photoLabels: ["Façade immeuble", "Cage d'escalier", 'Lot T4 séjour', 'Lot T3 cuisine', 'Cour intérieure', 'Cave commune'],
    publishedAt: '2026-04-05', isNew: false,
  },
  {
    ref: 'RCE26064', slug: 'bureaux-plateau-strasbourg',
    type: 'bureau', transaction: 'location',
    title: 'Plateau de bureaux 220 m²', city: 'Strasbourg', postalCode: '67000',
    price: 2860, priceUnit: '€ HT / mois', honoraires: 'À convenir',
    surface: 220, rooms: 8, bedrooms: 0, bathrooms: 2,
    floor: '5ᵉ étage avec ascenseur', floorNum: 5, elevator: true, yearBuilt: 2015,
    heating: 'Climatisation réversible', furnished: false, cave: false,
    parking: '4 places en sous-sol', hasParking: true, balcony: false, terrace: true, garden: false,
    workstations: 24,
    dpe: 'B', dpeValue: 78, ges: 'A', gesValue: 4,
    availableFrom: '1er juillet 2026',
    description: "Plateau de bureaux moderne de 220 m² au 5ᵉ étage d'un immeuble tertiaire récent (2015), proche gare. Aménagement flexible : open-space, salles de réunion, espace détente, kitchenette équipée.\n\nClimatisation réversible, fibre optique, 4 places de parking en sous-sol incluses. Accès PMR. Charges et taxes : devis sur demande.",
    fichePdf: null,
    photoCount: 9,
    photoLabels: ['Façade immeuble', 'Open-space principal', 'Salle de réunion', 'Espace détente', 'Kitchenette', 'Terrasse 5ᵉ'],
    publishedAt: '2026-04-20', isNew: true,
  },
  {
    ref: 'RCE26068', slug: 'hangar-activite-hoerdt',
    type: 'hangar', transaction: 'vente',
    title: "Hangar / local d'activité 480 m²", city: 'Hœrdt', postalCode: '67720',
    price: 385000, priceUnit: '€', honoraires: 'Honoraires charge vendeur',
    surface: 480, landSurface: 1100, rooms: 3, bedrooms: 0, bathrooms: 1,
    floor: 'Plain-pied', floorNum: 0, elevator: false, yearBuilt: 1998,
    heating: 'Aérotherme gaz', furnished: false, cave: false,
    parking: 'Cour 8 véhicules + accès poids lourds', hasParking: true,
    balcony: false, terrace: false, garden: false, ceilingHeight: 6.2,
    dpe: 'D', dpeValue: 168, ges: 'C', gesValue: 19,
    availableFrom: 'Immédiatement',
    description: "Local d'activité de 480 m² sur terrain clos de 1 100 m², zone artisanale de Hœrdt. Hauteur sous plafond 6,2 m, porte sectionnelle, quai de chargement, bureau attenant 40 m² avec sanitaires.\n\nChauffage aérotherme gaz, électricité tri 80 A. Cour goudronnée pouvant accueillir 8 véhicules + accès poids lourds. Idéal artisan, stockage ou petite production.",
    fichePdf: null,
    photoCount: 8,
    photoLabels: ['Façade entrée', 'Espace de stockage', 'Quai de chargement', 'Bureau attenant', 'Cour goudronnée', 'Vue extérieure'],
    publishedAt: '2026-04-08', isNew: false,
  },
]

// Public site: only show published listings (baked in at build time from annonces.json)
export const LISTINGS = (annonceData && annonceData.length ? annonceData : DEFAULT_LISTINGS)
  .filter(l => l.published !== false)

export const COMPANY_IMMO = {
  name: 'RENOV CONSEIL EST',
  agent: 'Deniz CECEN',
  email: 'contact@renovconseilest.fr',
  phone: '+33 (0)6 61 74 75 91',
  phoneRaw: '+33661747591',
  address: '45 Route du Rhin, Escalier B · 67400 Illkirch-Graffenstaden',
  siret: '94457268400016',
  mainSiteUrl: 'https://renovconseilest.fr',
  gestionUrl: 'https://gestion.renovconseilest.fr',
}

// =============================================================
// LOGO
// =============================================================
export function ImmoLogo({ tone = 'dark', size = 36, compact = false }) {
  const navy = tone === 'light' ? '#ffffff' : '#1f3a5f'
  const orange = '#d87a2e'
  return (
    <div className="flex items-center gap-3 select-none">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
        <polygon points="2,2 38,2 2,38" fill={orange} />
        <polygon points="38,2 38,38 2,38" fill={navy} />
      </svg>
      {!compact && (
        <div className="leading-none">
          <div className="font-bold tracking-tight whitespace-nowrap" style={{ color: navy, fontSize: '15px', letterSpacing: '0.06em', lineHeight: 1 }}>
            RENOV CONSEIL EST
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: tone === 'light' ? 'rgba(255,255,255,0.6)' : '#b46220' }}>
            Annonces immobilières
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================
// FORMAT HELPERS
// =============================================================
function formatPrice(n) { return n.toLocaleString('fr-FR') }
function formatDate(s) { return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }

const DPE_LETTER_COLORS = { A: '#319834', B: '#3aa84a', C: '#a8c63a', D: '#e0c000', E: '#e89c2e', F: '#dd6a23', G: '#cc1f1f' }
const GES_LETTER_COLORS = { A: '#7eb1de', B: '#5694cf', C: '#3a82c4', D: '#2f76ba', E: '#1f5da6', F: '#1a4f99', G: '#0e2f73' }
function dpeLetterColor(letter) { return DPE_LETTER_COLORS[letter] || '#475569' }
function gesLetterColor(letter) { return GES_LETTER_COLORS[letter] || '#475569' }

// =============================================================
// HEADER
// =============================================================
export function ImmoHeader({ view, onSearch, onLogo }) {
  return (
    <header className="bg-white border-b border-ink-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <button onClick={onLogo} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-500/40 rounded-md">
            <ImmoLogo />
          </button>

          <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium">
            <button onClick={() => onSearch('all')} className={`transition ${view === 'list' ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900'}`}>Toutes les annonces</button>
            <button onClick={() => onSearch('location')} className="text-ink-600 hover:text-ink-900 transition">Location</button>
            <button onClick={() => onSearch('vente')} className="text-ink-600 hover:text-ink-900 transition">Vente</button>
            <a href={COMPANY_IMMO.mainSiteUrl} className="text-ink-600 hover:text-ink-900 transition inline-flex items-center gap-1">
              Site principal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href={`tel:${COMPANY_IMMO.phoneRaw}`} className="hidden lg:inline-flex items-center gap-2 text-[14px] font-medium text-ink-800 hover:text-sand-700 transition">
              <Phone className="w-4 h-4" />
              {COMPANY_IMMO.phone}
            </a>
          </div>

          <a href={`tel:${COMPANY_IMMO.phoneRaw}`} aria-label="Appeler" className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-md border border-ink-200 text-ink-700">
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  )
}

// =============================================================
// FOOTER
// =============================================================
export function ImmoFooter() {
  return (
    <footer className="bg-ink-950 text-ink-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <ImmoLogo tone="light" />
            <p className="mt-5 text-[14px] text-ink-300 leading-relaxed max-w-xs">
              Annonces immobilières partout en France. Location, vente, accompagnement personnalisé.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-[0.2em] text-ink-400 uppercase mb-4">Coordonnées</div>
            <div className="space-y-2.5 text-[14px]">
              <div className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-sand-400 shrink-0" /><span>{COMPANY_IMMO.address}</span></div>
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-sand-400 shrink-0" /><a href={`tel:${COMPANY_IMMO.phoneRaw}`} className="hover:text-white transition">{COMPANY_IMMO.phone}</a></div>
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-sand-400 shrink-0" /><a href={`mailto:${COMPANY_IMMO.email}`} className="hover:text-white transition">{COMPANY_IMMO.email}</a></div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-[0.2em] text-ink-400 uppercase mb-4">Liens</div>
            <div className="space-y-2 text-[14px]">
              <a href={COMPANY_IMMO.mainSiteUrl} className="flex items-center gap-1.5 hover:text-sand-300 transition">
                Site principal RENOV CONSEIL EST <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href={COMPANY_IMMO.gestionUrl} className="flex items-center gap-1.5 hover:text-sand-300 transition">
                Espace gestion locative <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="text-[11px] font-mono tracking-[0.2em] text-ink-400 uppercase mt-6 mb-3">Suivez-nous</div>
            <div className="flex items-center gap-2">
              {[{ Icon: Linkedin, label: 'LinkedIn' }, { Icon: Instagram, label: 'Instagram' }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-9 h-9 inline-flex items-center justify-center rounded-md border border-ink-800 hover:border-sand-400 hover:text-sand-300 transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-ink-800 text-[12px] text-ink-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>© 2026 RENOV CONSEIL EST — SIRET : {COMPANY_IMMO.siret}</div>
          <div className="flex items-center gap-5">
            <span>Mentions légales</span>
            <span>RGPD</span>
            <span>Loi Hoguet</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// =============================================================
// FILTER BAR
// =============================================================
const TYPES_OPTIONS = [
  { v: 'all', l: 'Tous types' }, { v: 'appartement', l: 'Appartement' },
  { v: 'maison', l: 'Maison' }, { v: 'immeuble', l: 'Immeuble' },
  { v: 'bureau', l: 'Bureau' }, { v: 'hangar', l: 'Hangar' },
]
const DPE_OPTIONS = [
  { v: 'all', l: 'Indifférent' }, { v: 'A', l: 'A — Très économe' },
  { v: 'B', l: 'B ou mieux' }, { v: 'C', l: 'C ou mieux' },
  { v: 'D', l: 'D ou mieux' }, { v: 'E', l: 'E ou mieux' },
]
const DPE_RANK = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7 }

function FilterBar({ filters, onChange, count }) {
  const [advanced, setAdvanced] = useState(false)
  function update(k, v) { onChange({ ...filters, [k]: v }) }
  function reset() {
    onChange({ transaction: 'all', type: 'all', city: '', rooms: '0', budgetMax: '', surfaceMin: '', bedroomsMin: '0', furnished: 'all', parking: false, dpeMax: 'all' })
  }
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 lg:p-5 shadow-soft">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-3">
          <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Transaction</label>
          <div className="mt-2 flex rounded-md border border-ink-200 overflow-hidden text-[13px] font-medium">
            {[{ v: 'all', l: 'Toutes' }, { v: 'location', l: 'Location' }, { v: 'vente', l: 'Vente' }].map(opt => (
              <button key={opt.v} onClick={() => update('transaction', opt.v)}
                className={`flex-1 px-3 py-2.5 transition ${filters.transaction === opt.v ? 'bg-ink-900 text-white' : 'bg-white text-ink-700 hover:bg-ink-50'}`}>
                {opt.l}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-3">
          <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Type de bien</label>
          <select value={filters.type} onChange={e => update('type', e.target.value)}
            className="mt-2 w-full px-3 py-2.5 rounded-md border border-ink-200 bg-white text-[14px] text-ink-900 focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10">
            {TYPES_OPTIONS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Ville</label>
          <div className="mt-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input type="text" placeholder="Strasbourg, Obernai…" value={filters.city} onChange={e => update('city', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-md border border-ink-200 bg-white text-[14px] text-ink-900 focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10" />
          </div>
        </div>
        <div className="md:col-span-3">
          <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Pièces (min)</label>
          <select value={filters.rooms} onChange={e => update('rooms', e.target.value)}
            className="mt-2 w-full px-3 py-2.5 rounded-md border border-ink-200 bg-white text-[14px] text-ink-900 focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10">
            <option value="0">Indifférent</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
      </div>

      {advanced && (
        <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3">
            <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Budget max</label>
            <div className="mt-2 relative">
              <input type="number" inputMode="numeric" placeholder="ex. 250 000" value={filters.budgetMax} onChange={e => update('budgetMax', e.target.value)}
                className="w-full px-3 py-2.5 pr-8 rounded-md border border-ink-200 bg-white text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-[13px]">€</span>
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Surface min</label>
            <div className="mt-2 relative">
              <input type="number" inputMode="numeric" placeholder="ex. 60" value={filters.surfaceMin} onChange={e => update('surfaceMin', e.target.value)}
                className="w-full px-3 py-2.5 pr-10 rounded-md border border-ink-200 bg-white text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-[13px]">m²</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Chambres (min)</label>
            <select value={filters.bedroomsMin} onChange={e => update('bedroomsMin', e.target.value)}
              className="mt-2 w-full px-3 py-2.5 rounded-md border border-ink-200 bg-white text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10">
              <option value="0">Indifférent</option>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Meublé</label>
            <select value={filters.furnished} onChange={e => update('furnished', e.target.value)}
              className="mt-2 w-full px-3 py-2.5 rounded-md border border-ink-200 bg-white text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10">
              <option value="all">Indifférent</option>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">DPE max</label>
            <select value={filters.dpeMax} onChange={e => update('dpeMax', e.target.value)}
              className="mt-2 w-full px-3 py-2.5 rounded-md border border-ink-200 bg-white text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10">
              {DPE_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          </div>
          <div className="md:col-span-12">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.parking} onChange={e => update('parking', e.target.checked)}
                className="w-4 h-4 rounded border-ink-300 text-sand-500 focus:ring-sand-500/30" />
              <span className="text-[14px] text-ink-700">Avec parking / place de stationnement</span>
            </label>
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between text-[13px]">
        <button onClick={() => setAdvanced(a => !a)} className="inline-flex items-center gap-1.5 text-ink-700 hover:text-ink-900 font-medium transition">
          <SlidersHorizontal className="w-4 h-4" />
          {advanced ? 'Moins de critères' : 'Plus de critères'}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${advanced ? 'rotate-90' : ''}`} />
        </button>
        <div className="flex items-center gap-5">
          <div className="text-ink-600"><span className="font-semibold text-ink-900">{count}</span> annonce{count > 1 ? 's' : ''}</div>
          <button onClick={reset} className="text-ink-500 hover:text-ink-900 transition">Réinitialiser</button>
        </div>
      </div>
    </div>
  )
}

// =============================================================
// LISTING CARD
// =============================================================
const TYPE_LABELS = { appartement: 'Appartement', maison: 'Maison', immeuble: 'Immeuble', bureau: 'Bureau', hangar: 'Hangar' }

function getCardStats(l) {
  if (l.type === 'bureau') {
    return [
      { icon: Ruler, value: `${l.surface} m²` },
      { icon: Layers, value: `${l.rooms} espaces` },
      l.workstations ? { icon: Users, value: `${l.workstations} postes` } : { icon: Bed, value: '—' },
    ]
  }
  if (l.type === 'hangar') {
    return [
      { icon: Ruler, value: `${l.surface} m²` },
      l.ceilingHeight ? { icon: ArrowUp, value: `H. ${l.ceilingHeight} m` } : { icon: Layers, value: `${l.rooms} esp.` },
      l.landSurface ? { icon: Square, value: `terrain ${l.landSurface} m²` } : { icon: Bed, value: '—' },
    ]
  }
  if (l.type === 'immeuble') {
    return [
      { icon: Ruler, value: `${l.surface} m²` },
      { icon: Layers, value: `${l.rooms} pièces` },
      l.landSurface ? { icon: Square, value: `terrain ${l.landSurface} m²` } : { icon: Bed, value: `${l.bedrooms} ch.` },
    ]
  }
  return [
    { icon: Ruler, value: `${l.surface} m²` },
    { icon: Layers, value: `${l.rooms} ${l.rooms > 1 ? 'pièces' : 'pièce'}` },
    { icon: Bed, value: `${l.bedrooms} ch.` },
  ]
}

function ListingCard({ listing, onOpen }) {
  const isLocation = listing.transaction === 'location'
  const badgeCls = isLocation ? 'bg-ink-900 text-white' : 'bg-sand-500 text-white'
  const stats = getCardStats(listing)
  return (
    <article onClick={() => onOpen(listing.ref)}
      className="group cursor-pointer bg-white border border-ink-200 rounded-xl overflow-hidden hover:shadow-card hover:-translate-y-0.5 transition-all">
      <div className="relative aspect-[4/3] placeholder-stripes border-b border-ink-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-500 text-center px-4">{listing.photoLabels[0]}</div>
        </div>
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`${badgeCls} text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full`}>{isLocation ? 'Location' : 'Vente'}</span>
          <span className="bg-white/95 backdrop-blur text-ink-800 border border-ink-200 text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full">{TYPE_LABELS[listing.type] || listing.type}</span>
          {listing.isNew && <span className="bg-emerald-600 text-white text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full">Nouveau</span>}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-md border border-ink-200">
            <div className="font-semibold text-ink-900 text-[16px] leading-none">
              {formatPrice(listing.price)} <span className="text-[12px] font-normal text-ink-600">{listing.priceUnit}</span>
            </div>
          </div>
          {listing.fichePdf && (
            <span className="bg-ink-900/85 text-white text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded inline-flex items-center gap-1">
              <FileText className="w-3 h-3" />PDF
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-[17px] font-semibold tracking-tight text-ink-900 leading-snug">{listing.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-600">
          <MapPin className="w-3.5 h-3.5 text-sand-600" />
          <span>{listing.city} · {listing.postalCode}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[12px] text-ink-700">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 truncate">
              <s.icon className="w-3.5 h-3.5 text-ink-400 shrink-0" />
              <span className="truncate">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between text-[12px]">
          <div className="font-mono tracking-[0.14em] uppercase text-ink-400">Réf. {listing.ref}</div>
          <span className="text-ink-900 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Voir l'annonce <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </article>
  )
}

// =============================================================
// LIST VIEW
// =============================================================
export function ListView({ onOpen, initialTransaction }) {
  const [filters, setFilters] = useState({
    transaction: initialTransaction || 'all', type: 'all', city: '', rooms: '0',
    budgetMax: '', surfaceMin: '', bedroomsMin: '0', furnished: 'all', parking: false, dpeMax: 'all',
  })

  const filtered = useMemo(() => {
    return LISTINGS.filter(l => {
      if (filters.transaction !== 'all' && l.transaction !== filters.transaction) return false
      if (filters.type !== 'all' && l.type !== filters.type) return false
      if (filters.city && !l.city.toLowerCase().includes(filters.city.toLowerCase())) return false
      if (parseInt(filters.rooms) > 0 && l.rooms < parseInt(filters.rooms)) return false
      if (filters.budgetMax && l.price > parseInt(filters.budgetMax)) return false
      if (filters.surfaceMin && l.surface < parseInt(filters.surfaceMin)) return false
      if (parseInt(filters.bedroomsMin) > 0 && l.bedrooms < parseInt(filters.bedroomsMin)) return false
      if (filters.furnished === 'yes' && !l.furnished) return false
      if (filters.furnished === 'no' && l.furnished) return false
      if (filters.parking && !l.hasParking) return false
      if (filters.dpeMax !== 'all' && DPE_RANK[l.dpe] > DPE_RANK[filters.dpeMax]) return false
      return true
    })
  }, [filters])

  return (
    <div className="page-enter">
      <section className="bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 placeholder-stripes opacity-15"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-sand-300">Annonces immobilières · toute la France</div>
            <h1 className="mt-4 text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.1] font-semibold tracking-tight" style={{ textWrap: 'balance' }}>
              Trouvez votre prochain bien en quelques clics.
            </h1>
            <p className="mt-4 text-[15px] text-ink-300 max-w-xl">
              Location, vente, appartements, maisons : nous accompagnons chaque dossier avec la même rigueur que nos chantiers.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="-mt-12 lg:-mt-16 relative z-10">
          <FilterBar filters={filters} onChange={setFilters} count={filtered.length} />
        </div>
        <div className="mt-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-ink-500">Aucune annonce ne correspond à vos critères.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(l => <ListingCard key={l.ref} listing={l} onOpen={onOpen} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// =============================================================
// DETAIL VIEW
// =============================================================
export function DetailView({ listing, onBack, onContact }) {
  const [activePhoto, setActivePhoto] = useState(0)
  const isLocation = listing.transaction === 'location'
  const isPro = listing.type === 'bureau' || listing.type === 'hangar'
  const typeIcon = listing.type === 'bureau' ? Briefcase : listing.type === 'hangar' ? Warehouse : Home

  function changePhoto(delta) {
    setActivePhoto(p => {
      const next = p + delta
      if (next < 0) return listing.photoLabels.length - 1
      if (next >= listing.photoLabels.length) return 0
      return next
    })
  }

  const caracteristiques = [
    { icon: typeIcon, label: 'Type', value: TYPE_LABELS[listing.type] || listing.type },
    { icon: Ruler, label: 'Surface utile', value: `${listing.surface} m²` },
    listing.landSurface && { icon: Square, label: 'Surface terrain', value: `${listing.landSurface} m²` },
    listing.ceilingHeight && { icon: ArrowUp, label: 'Hauteur sous plafond', value: `${listing.ceilingHeight} m` },
    !isPro && { icon: Layers, label: 'Pièces', value: listing.rooms },
    isPro && { icon: Layers, label: 'Espaces', value: listing.rooms },
    !isPro && { icon: Bed, label: 'Chambres', value: listing.bedrooms },
    listing.workstations && { icon: Users, label: 'Postes de travail', value: listing.workstations },
    { icon: Bath, label: "Salles d'eau", value: listing.bathrooms },
    { icon: Building2, label: 'Étage', value: listing.floor },
    { icon: Calendar, label: 'Année', value: listing.yearBuilt },
    { icon: Flame, label: 'Chauffage', value: listing.heating },
    !isPro && { icon: Check, label: 'Meublé', value: listing.furnished ? 'Oui' : 'Non' },
    { icon: Check, label: 'Cave', value: listing.cave ? 'Oui' : 'Non' },
    { icon: Car, label: 'Parking', value: listing.parking },
    listing.yieldGross && { icon: Check, label: 'Rendement brut', value: `${listing.yieldGross} %` },
  ].filter(Boolean)

  return (
    <div className="page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-600 hover:text-ink-900 transition">
          <ArrowLeft className="w-4 h-4" />
          Retour aux annonces
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full ${isLocation ? 'bg-ink-900 text-white' : 'bg-sand-500 text-white'}`}>
                {isLocation ? 'Location' : 'Vente'}
              </span>
              {listing.isNew && <span className="bg-emerald-600 text-white text-[11px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-full">Nouveau</span>}
              <span className="font-mono text-[11px] tracking-[0.14em] text-ink-500">Réf. {listing.ref}</span>
            </div>
            <h1 className="text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.1] font-semibold tracking-tight text-ink-900" style={{ textWrap: 'balance' }}>
              {listing.title}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-[15px] text-ink-600">
              <MapPin className="w-4 h-4 text-sand-600" />
              <span>{listing.city} · {listing.postalCode}</span>
            </div>
          </div>
          <div className="md:text-right shrink-0">
            <div className="text-[12px] font-mono tracking-[0.14em] uppercase text-ink-500">Prix</div>
            <div className="text-[32px] lg:text-[36px] font-semibold tracking-tight text-ink-900 leading-none">
              {formatPrice(listing.price)} <span className="text-[20px] font-normal text-ink-600">{listing.priceUnit}</span>
            </div>
            {typeof listing.honoraires === 'number' && (
              <div className="text-[12px] text-ink-500 mt-1">
                {listing.honoraires === 0 ? 'Aucuns honoraires locataire' : `Honoraires TTC à charge du locataire : ${formatPrice(listing.honoraires)} €`}
              </div>
            )}
            {typeof listing.honoraires === 'string' && (
              <div className="text-[12px] text-ink-500 mt-1">{listing.honoraires}</div>
            )}
            {listing.fichePdf && (
              <a href={listing.fichePdf} target="_blank" rel="noopener noreferrer" download={`fiche-${listing.ref}.pdf`}
                className="mt-4 inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-800 text-white text-[13px] font-medium px-4 py-2.5 rounded-md transition shadow-soft">
                <FileText className="w-4 h-4" />
                Fiche technique (PDF)
                <Download className="w-4 h-4 opacity-80" />
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {(() => {
          const photoUrls = listing.photoUrls || []
          const activeUrl = photoUrls[activePhoto]
          return (
            <>
              <div className={`relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] rounded-xl border border-ink-200 overflow-hidden ${!activeUrl ? 'placeholder-stripes' : 'bg-ink-100'}`}>
                {activeUrl ? (
                  <img src={activeUrl} alt={listing.photoLabels[activePhoto] || `Photo ${activePhoto + 1}`}
                    className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                    <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-500">{listing.photoLabels[activePhoto]}</div>
                  </div>
                )}
                <button onClick={() => changePhoto(-1)} aria-label="Photo précédente"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-ink-200 inline-flex items-center justify-center text-ink-700 hover:text-ink-900 hover:bg-white transition shadow-soft">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => changePhoto(1)} aria-label="Photo suivante"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-ink-200 inline-flex items-center justify-center text-ink-700 hover:text-ink-900 hover:bg-white transition shadow-soft">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 right-3 bg-ink-900/85 text-white text-[12px] px-2.5 py-1 rounded font-mono">
                  {activePhoto + 1} / {listing.photoLabels.length}
                </div>
              </div>
              <div className="mt-3 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
                <div className="flex gap-3 pb-2" style={{ minWidth: 'min-content' }}>
                  {listing.photoLabels.map((label, i) => {
                    const thumbUrl = photoUrls[i]
                    return (
                      <button key={i} onClick={() => setActivePhoto(i)}
                        className={`shrink-0 w-[120px] sm:w-[140px] relative aspect-[4/3] rounded-lg border overflow-hidden transition ${!thumbUrl ? 'placeholder-stripes' : 'bg-ink-100'} ${activePhoto === i ? 'border-sand-500 ring-2 ring-sand-500/30' : 'border-ink-200 hover:border-ink-400'}`}
                        aria-label={`Voir photo ${i + 1} — ${label}`}>
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
                            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-500 line-clamp-2">{label}</div>
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-ink-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">{i + 1}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )
        })()}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight text-ink-900 mb-5">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 lg:p-6 bg-ink-50/50 border border-ink-200 rounded-xl">
                {caracteristiques.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <c.icon className="w-4 h-4 mt-0.5 text-sand-600 shrink-0" strokeWidth={1.7} />
                    <div className="text-[13px] leading-tight">
                      <div className="text-ink-500 text-[11px] font-mono tracking-[0.14em] uppercase">{c.label}</div>
                      <div className="text-ink-900 font-medium mt-1">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight text-ink-900 mb-4">Description</h2>
              <div className="text-[15px] leading-relaxed text-ink-700 space-y-4">
                {listing.description.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight text-ink-900 mb-5">Performance énergétique</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-ink-200 rounded-xl p-5 bg-white">
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-500">Diagnostic énergétique (DPE)</div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-[42px] font-bold leading-none" style={{ color: dpeLetterColor(listing.dpe) }}>{listing.dpe}</span>
                    <span className="text-[16px] text-ink-700 font-medium">{listing.dpeValue} <span className="text-[12px] text-ink-500">kWh/m²/an</span></span>
                  </div>
                  <div className="mt-2 text-[12px] text-ink-500">Échelle A (très économe) → G (très énergivore)</div>
                </div>
                <div className="border border-ink-200 rounded-xl p-5 bg-white">
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-500">Émissions de gaz à effet de serre (GES)</div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-[42px] font-bold leading-none" style={{ color: gesLetterColor(listing.ges) }}>{listing.ges}</span>
                    <span className="text-[16px] text-ink-700 font-medium">{listing.gesValue} <span className="text-[12px] text-ink-500">kg CO₂/m²/an</span></span>
                  </div>
                  <div className="mt-2 text-[12px] text-ink-500">Échelle A (faibles émissions) → G (fortes émissions)</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-[88px] space-y-4">
              <div className="bg-white border border-ink-200 rounded-xl p-5 shadow-soft">
                <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500 mb-3">Votre conseiller</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sand-100 text-sand-700 inline-flex items-center justify-center font-semibold text-[16px]">DC</div>
                  <div>
                    <div className="font-semibold text-ink-900">{COMPANY_IMMO.agent}</div>
                    <div className="text-[12px] text-ink-500">{COMPANY_IMMO.name}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-[13px]">
                  <a href={`tel:${COMPANY_IMMO.phoneRaw}`} className="flex items-center gap-2 text-ink-800 hover:text-sand-700 transition">
                    <Phone className="w-4 h-4 text-sand-600" />{COMPANY_IMMO.phone}
                  </a>
                  <a href={`mailto:${COMPANY_IMMO.email}?subject=Annonce%20${listing.ref}`} className="flex items-center gap-2 text-ink-800 hover:text-sand-700 transition">
                    <Mail className="w-4 h-4 text-sand-600" />{COMPANY_IMMO.email}
                  </a>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-2">
                  <button onClick={() => onContact(listing)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-sand-500 hover:bg-sand-600 text-white font-medium text-[14px] px-4 py-3 rounded-md transition">
                    Demander une visite
                  </button>
                  <a href={`mailto:${COMPANY_IMMO.email}?subject=Information%20-%20Annonce%20${listing.ref}`}
                    className="w-full inline-flex items-center justify-center gap-2 border border-ink-300 hover:border-ink-700 text-ink-800 font-medium text-[14px] px-4 py-3 rounded-md transition">
                    Poser une question
                  </a>
                </div>
              </div>
              <div className="bg-white border border-ink-200 rounded-xl p-5 text-[12px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Disponible</span>
                  <span className="font-medium text-ink-800">{listing.availableFrom}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Publié le</span>
                  <span className="font-medium text-ink-800">{formatDate(listing.publishedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-500">Référence</span>
                  <span className="font-mono text-ink-800">{listing.ref}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

// =============================================================
// CONTACT MODAL
// =============================================================
export function ContactModal({ listing, onClose }) {
  const [form, setForm] = useState({ nom: '', email: '', tel: '', message: '' })
  const [sent, setSent] = useState(false)

  function submit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 lg:p-8 shadow-card relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-md inline-flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-ink-50 transition">
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="mt-4 text-[20px] font-semibold tracking-tight text-ink-900">Demande envoyée</h3>
            <p className="mt-2 text-[14px] text-ink-600 max-w-xs mx-auto">
              Votre conseiller vous recontactera sous 48 heures ouvrées.
            </p>
            <button onClick={onClose} className="mt-6 px-5 py-2.5 rounded-md bg-ink-900 text-white text-[14px] font-medium hover:bg-ink-800 transition">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-ink-500">Demande de visite</div>
            <h3 className="mt-2 text-[20px] font-semibold tracking-tight text-ink-900">{listing.title}</h3>
            <div className="text-[13px] text-ink-500 mt-1">Réf. {listing.ref} · {listing.city}</div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <input required type="text" placeholder="Nom et prénom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-md border border-ink-200 text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10" />
              <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-md border border-ink-200 text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10" />
              <input type="tel" placeholder="Téléphone" value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-md border border-ink-200 text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10" />
              <textarea rows={4} placeholder="Quand souhaitez-vous visiter ? Des questions ?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-md border border-ink-200 text-[14px] focus:outline-none focus:border-ink-700 focus:ring-2 focus:ring-ink-900/10" />
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-sand-500 hover:bg-sand-600 text-white font-medium text-[14px] px-4 py-3 rounded-md transition">
                Envoyer la demande
                <Send className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-ink-500 leading-relaxed text-center">
                Vos données sont utilisées uniquement pour traiter votre demande.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
