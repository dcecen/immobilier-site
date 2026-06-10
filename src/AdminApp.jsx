import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Plus, Building2, GripVertical, Copy, Trash2, Home, MapPin, FileText, Flame, Calendar,
  Car, Save, Download, Upload, RotateCcw, ExternalLink, CheckCircle, Key, ArrowRight,
  Eye, EyeOff, Globe, X,
} from './icons'
import { DEFAULT_LISTINGS } from './listings'
import {
  TYPE_OPTIONS, TRANSACTION_OPTIONS, DPE_OPTIONS,
  slugify, todayISO, makeBlankListing,
  FieldRow, Field, Section,
  TextInput, NumberInput, SelectInput, TextArea, Toggle,
  PdfField,
} from './admin-fields'

const ACCESS_CODE = 'RCE-immo-2026'
const AUTH_KEY = 'rce_immo_admin_ok'

function clone(x) { return JSON.parse(JSON.stringify(x)) }

function normalize(list) {
  return list.map(l => ({
    ...l,
    slug: l.slug || slugify(l.title),
    photoUrls: l.photoUrls || [],
    photoLabels: l.photoLabels || [],
    photoCount: (l.photoUrls?.length > 0 ? l.photoUrls : l.photoLabels || []).length,
    published: l.published !== false,
  }))
}

const TYPE_LABEL = Object.fromEntries(TYPE_OPTIONS.map(o => [o.value, o.label]))

// =============================================================
// PHOTOS EDITOR
// =============================================================
function PhotosEditor({ listing, onChange }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const urls = listing.photoUrls || []
  const labels = listing.photoLabels || []
  const paddedLabels = urls.map((_, i) => labels[i] || `Photo ${i + 1}`)

  async function handleUpload(files) {
    if (!files.length) return
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append('photos', f))
      const res = await fetch(`/api/photos/${listing.ref}`, { method: 'POST', body: fd })
      const json = await res.json()
      if (json.ok && json.urls.length) {
        const newUrls = [...urls, ...json.urls]
        const newLabels = [...paddedLabels, ...json.urls.map((_, i) => `Photo ${urls.length + i + 1}`)]
        onChange({ ...listing, photoUrls: newUrls, photoLabels: newLabels, photoCount: newUrls.length })
      }
    } catch {
      alert('Erreur lors de l\'upload — vérifiez que le serveur admin est démarré.')
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(i) {
    const filename = encodeURIComponent(urls[i].split('/').pop())
    fetch(`/api/photos/${listing.ref}/${filename}`, { method: 'DELETE' }).catch(() => {})
    const newUrls = urls.filter((_, j) => j !== i)
    const newLabels = paddedLabels.filter((_, j) => j !== i)
    onChange({ ...listing, photoUrls: newUrls, photoLabels: newLabels, photoCount: newUrls.length })
  }

  function updateLabel(i, val) {
    const newLabels = paddedLabels.map((l, j) => j === i ? val : l)
    onChange({ ...listing, photoLabels: newLabels })
  }

  return (
    <div>
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {urls.map((url, i) => (
            <div key={url + i} className="relative group">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-ink-200 bg-ink-100">
                <img src={url} alt={paddedLabels[i]} className="w-full h-full object-cover" />
              </div>
              <button onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm">
                <X className="w-3 h-3" />
              </button>
              <div className="mt-1 flex items-center gap-1">
                <span className="shrink-0 font-mono text-[9px] text-ink-400 w-4 text-center">{i + 1}</span>
                <input type="text" value={paddedLabels[i]} onChange={e => updateLabel(i, e.target.value)}
                  placeholder="Légende…"
                  className="w-full text-[11px] border border-ink-200 rounded px-2 py-1 focus:outline-none focus:border-ink-400 bg-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => { if (e.target.files?.length) handleUpload(e.target.files); e.target.value = '' }} />

      <button onClick={() => fileRef.current?.click()} disabled={uploading}
        className="w-full flex items-center justify-center gap-2 text-[13px] font-medium border-2 border-dashed border-ink-200 hover:border-ink-400 text-ink-500 hover:text-ink-700 px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
        <Upload className="w-4 h-4" />
        {uploading ? 'Envoi en cours…' : 'Ajouter des photos (JPG, PNG, WebP · max 20 Mo chacune)'}
      </button>
      {urls.length === 0 && (
        <p className="mt-2 text-[12px] text-ink-400">
          Les photos sont enregistrées dans <code className="text-ink-600">public/images/annonces/{listing.ref}/</code>
        </p>
      )}
    </div>
  )
}

// =============================================================
// PUBLISH MODAL
// =============================================================
function PublishModal({ onClose }) {
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(true)
  const [success, setSuccess] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    let alive = true

    async function run() {
      try {
        const res = await fetch('/api/publish', { method: 'POST' })
        if (!res.body) throw new Error('Streaming non supporté par ce navigateur')
        const reader = res.body.getReader()
        const dec = new TextDecoder()
        let buf = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done || !alive) break
          buf += dec.decode(value, { stream: true })
          const chunks = buf.split('\n\n')
          buf = chunks.pop()
          for (const chunk of chunks) {
            const line = chunk.split('\n').find(l => l.startsWith('data: '))
            if (!line) continue
            try {
              const msg = JSON.parse(line.slice(6))
              if (!alive) return
              if (msg.type === 'step') setLog(p => [...p, { k: 'step', t: msg.data }])
              else if (msg.type === 'log' && msg.data.trim()) setLog(p => [...p, { k: 'log', t: msg.data }])
              else if (msg.type === 'done') { setSuccess(true); setLog(p => [...p, { k: 'done', t: msg.data }]) }
              else if (msg.type === 'error') setLog(p => [...p, { k: 'error', t: msg.data }])
            } catch { /* ignore parse errors */ }
          }
        }
      } catch (e) {
        if (alive) setLog(p => [...p, { k: 'error', t: e.message }])
      } finally {
        if (alive) setRunning(false)
      }
    }

    run()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-ink-950 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[14px] font-semibold text-white">
            {running && <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse inline-block shrink-0" />}
            {!running && success && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {!running && !success && <X className="w-4 h-4 text-red-400 shrink-0" />}
            Publication du site
          </div>
          {!running && (
            <button onClick={onClose} className="text-white/50 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="h-64 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-relaxed">
          {log.length === 0 && running && (
            <div className="text-white/30 animate-pulse">Démarrage…</div>
          )}
          {log.map((e, i) => (
            <div key={i} className={
              e.k === 'step'  ? 'text-sand-300 font-semibold pt-2 first:pt-0' :
              e.k === 'done'  ? 'text-emerald-400 font-semibold pt-2' :
              e.k === 'error' ? 'text-red-400' :
              'text-white/50 pl-3'
            }>
              {e.k === 'step' ? '▶ ' : e.k === 'done' ? '✓ ' : e.k === 'error' ? '✕ ' : ''}{e.t}
            </div>
          ))}
          {running && log.length > 0 && <div className="text-white/30 animate-pulse pl-3 mt-1">…</div>}
          <div ref={endRef} />
        </div>

        {!running && (
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-[12px] text-white/50">
              {success ? 'Le site a été reconstruit et envoyé sur le dépôt distant.' : 'Une erreur est survenue pendant la publication.'}
            </span>
            <button onClick={onClose}
              className="shrink-0 bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium px-4 py-2 rounded-md transition">
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================
// SIDEBAR
// =============================================================
function Sidebar({ listings, selectedRef, onSelect, onAdd, onReorder, onTogglePublish }) {
  const dragIdxRef = useRef(null)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  function endDrag() { dragIdxRef.current = null; setDragIdx(null); setOverIdx(null) }

  return (
    <aside className="w-[300px] shrink-0 border-r border-ink-200 bg-white flex flex-col h-full">
      <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
        <div className="text-[12px] font-mono tracking-[0.16em] uppercase text-ink-500">
          {listings.length} annonce{listings.length > 1 ? 's' : ''}
        </div>
        <button onClick={onAdd}
          className="inline-flex items-center gap-1.5 bg-ink-900 hover:bg-ink-800 text-white text-[12px] font-medium px-2.5 py-1.5 rounded-md transition">
          <Plus className="w-3.5 h-3.5" /> Nouvelle
        </button>
      </div>
      <div className="px-4 py-1.5 text-[10px] text-ink-400 border-b border-ink-100 flex items-center gap-1.5">
        <GripVertical className="w-3 h-3" /> Glissez pour réordonner · l'ordre s'applique au site
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {listings.map((l, i) => {
          const active = l.ref === selectedRef
          const isLoc = l.transaction === 'location'
          const dragging = dragIdx === i
          const isOver = overIdx === i && dragIdx !== null && dragIdx !== i
          return (
            <div key={l.ref} draggable
              onDragStart={e => { dragIdxRef.current = i; setDragIdx(i); e.dataTransfer.effectAllowed = 'move' }}
              onDragOver={e => { e.preventDefault(); if (overIdx !== i) setOverIdx(i) }}
              onDrop={e => { e.preventDefault(); const from = dragIdxRef.current; if (from !== null && from !== i) onReorder(from, i); endDrag() }}
              onDragEnd={endDrag}
              className={`relative ${isOver ? 'before:absolute before:-top-0.5 before:left-1 before:right-1 before:h-0.5 before:bg-sand-500 before:rounded-full' : ''}`}>
              <div className={`group w-full text-left rounded-lg border flex items-start gap-1.5 transition ${
                active ? 'border-sand-500 bg-sand-50' : 'border-transparent hover:bg-ink-50'
              } ${dragging ? 'opacity-40' : ''}`}>
                <button onClick={() => onSelect(l.ref)} className="flex-1 min-w-0 pl-2 pr-1 py-2.5 text-left">
                  <span className="flex items-center gap-2">
                    <span className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${isLoc ? 'bg-ink-900 text-white' : 'bg-sand-500 text-white'}`}>
                      {isLoc ? 'Loc' : 'Vente'}
                    </span>
                    <span className="font-mono text-[10px] text-ink-400">{l.ref}</span>
                    {!l.published && (
                      <span className="text-[9px] font-medium text-ink-400 bg-ink-100 px-1.5 py-0.5 rounded">Dépublié</span>
                    )}
                  </span>
                  <span className="mt-1 block text-[13px] font-medium text-ink-900 leading-snug line-clamp-1">{l.title || 'Sans titre'}</span>
                  <span className="block text-[12px] text-ink-500">
                    <Building2 className="inline w-3 h-3 text-ink-400 -mt-0.5 mr-1" />
                    {l.city || '—'} · {TYPE_LABEL[l.type] || l.type}
                  </span>
                </button>
                <button onClick={e => { e.stopPropagation(); onTogglePublish(l.ref) }}
                  title={l.published ? 'Dépublier l\'annonce' : 'Publier l\'annonce'}
                  className={`shrink-0 mr-2 mt-2.5 p-1 rounded transition ${l.published ? 'text-emerald-600 hover:text-emerald-800' : 'text-ink-300 hover:text-ink-600'}`}>
                  {l.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <GripVertical className="w-4 h-4 mt-3 mr-1 shrink-0 text-ink-300 group-hover:text-ink-500 cursor-grab active:cursor-grabbing" />
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

// =============================================================
// EDITOR
// =============================================================
function Editor({ listing, onChange, onDuplicate, onDelete }) {
  if (!listing) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-400 text-[14px]">
        Sélectionnez une annonce à gauche, ou créez-en une nouvelle.
      </div>
    )
  }

  const set = (field, value) => {
    const next = { ...listing, [field]: value }
    if (field === 'title' && (!listing.slug || listing.slug === slugify(listing.title))) {
      next.slug = slugify(value)
    }
    onChange(next)
  }

  const isPro = listing.type === 'bureau' || listing.type === 'hangar'
  const hasLand = ['maison', 'immeuble', 'hangar'].includes(listing.type)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[11px] text-ink-400">{listing.ref}</div>
            <h2 className="text-[20px] font-semibold tracking-tight text-ink-900 truncate">{listing.title || 'Sans titre'}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onDuplicate}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-600 hover:text-ink-900 border border-ink-200 hover:border-ink-300 px-3 py-2 rounded-md transition">
              <Copy className="w-3.5 h-3.5" /> Dupliquer
            </button>
            <button onClick={onDelete}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-2 rounded-md transition">
              <Trash2 className="w-3.5 h-3.5" /> Supprimer
            </button>
          </div>
        </div>

        <Section title="Identité du bien" icon={Home}>
          <FieldRow>
            <Field label="Référence" hint="identifiant unique">
              <TextInput value={listing.ref} onChange={v => set('ref', v)} mono />
            </Field>
            <Field label="Transaction">
              <SelectInput value={listing.transaction} onChange={v => set('transaction', v)} options={TRANSACTION_OPTIONS} />
            </Field>
            <Field label="Type de bien">
              <SelectInput value={listing.type} onChange={v => set('type', v)} options={TYPE_OPTIONS} />
            </Field>
            <Field label="Disponibilité">
              <TextInput value={listing.availableFrom} onChange={v => set('availableFrom', v)} placeholder="Immédiatement, 1er juin 2026…" />
            </Field>
            <Field label="Titre de l'annonce" full>
              <TextInput value={listing.title} onChange={v => set('title', v)} placeholder="Appartement T3 lumineux avec balcon" />
            </Field>
          </FieldRow>
          <div className="mt-4 flex flex-wrap gap-4">
            <Toggle checked={!!listing.isNew} onChange={v => set('isNew', v)} label="Afficher le badge « Nouveau »" />
            <Toggle checked={!!listing.published} onChange={v => set('published', v)}
              label={listing.published ? 'Annonce visible sur le site' : 'Annonce masquée (dépubliée)'} />
          </div>
        </Section>

        <Section title="Localisation" icon={MapPin}>
          <FieldRow>
            <Field label="Ville"><TextInput value={listing.city} onChange={v => set('city', v)} placeholder="Strasbourg" /></Field>
            <Field label="Code postal"><TextInput value={listing.postalCode} onChange={v => set('postalCode', v)} placeholder="67000" mono /></Field>
          </FieldRow>
        </Section>

        <Section title="Prix & honoraires" icon={FileText}>
          <FieldRow>
            <Field label="Prix" hint="nombre seul">
              <NumberInput value={listing.price} onChange={v => set('price', v)} />
            </Field>
            <Field label="Unité de prix">
              <TextInput value={listing.priceUnit} onChange={v => set('priceUnit', v)} placeholder="€ / mois CC  ou  €" />
            </Field>
            <Field label="Honoraires" hint="nombre (€) ou texte" full>
              <TextInput
                value={typeof listing.honoraires === 'number' ? String(listing.honoraires) : listing.honoraires}
                onChange={v => set('honoraires', /^\d+$/.test(v.trim()) ? Number(v.trim()) : v)}
                placeholder="0, 432, ou « Honoraires charge vendeur »" />
            </Field>
          </FieldRow>
          {listing.type === 'immeuble' && (
            <div className="mt-4">
              <Field label="Rendement brut (%)" hint="optionnel">
                <NumberInput value={listing.yieldGross} onChange={v => set('yieldGross', v)} allowNull placeholder="6.8" />
              </Field>
            </div>
          )}
        </Section>

        <Section title="Surfaces & pièces" icon={Home}>
          <FieldRow cols={3}>
            <Field label="Surface (m²)"><NumberInput value={listing.surface} onChange={v => set('surface', v)} /></Field>
            {hasLand && <Field label="Terrain (m²)"><NumberInput value={listing.landSurface} onChange={v => set('landSurface', v)} allowNull /></Field>}
            <Field label="Pièces"><NumberInput value={listing.rooms} onChange={v => set('rooms', v)} /></Field>
            {!isPro && <Field label="Chambres"><NumberInput value={listing.bedrooms} onChange={v => set('bedrooms', v)} /></Field>}
            <Field label="Salles d'eau"><NumberInput value={listing.bathrooms} onChange={v => set('bathrooms', v)} /></Field>
            <Field label="Année de construction"><NumberInput value={listing.yearBuilt} onChange={v => set('yearBuilt', v)} /></Field>
            {listing.type === 'bureau' && <Field label="Postes de travail"><NumberInput value={listing.workstations} onChange={v => set('workstations', v)} allowNull /></Field>}
            {listing.type === 'hangar' && <Field label="Hauteur sous plafond (m)"><NumberInput value={listing.ceilingHeight} onChange={v => set('ceilingHeight', v)} allowNull /></Field>}
          </FieldRow>
          <div className="mt-4">
            <Field label="Étage / niveau" full>
              <TextInput value={listing.floor} onChange={v => set('floor', v)} placeholder="3ᵉ étage sans ascenseur" />
            </Field>
          </div>
        </Section>

        <Section title="Équipements" icon={Car}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Toggle checked={!!listing.furnished} onChange={v => set('furnished', v)} label="Meublé" />
            <Toggle checked={!!listing.cave} onChange={v => set('cave', v)} label="Cave" />
            <Toggle checked={!!listing.elevator} onChange={v => set('elevator', v)} label="Ascenseur" />
            <Toggle checked={!!listing.hasParking} onChange={v => set('hasParking', v)} label="Parking / stationnement" />
            <Toggle checked={!!listing.balcony} onChange={v => set('balcony', v)} label="Balcon" />
            <Toggle checked={!!listing.terrace} onChange={v => set('terrace', v)} label="Terrasse" />
            <Toggle checked={!!listing.garden} onChange={v => set('garden', v)} label="Jardin" />
          </div>
          <div className="mt-4">
            <Field label="Détail du stationnement" full>
              <TextInput value={listing.parking} onChange={v => set('parking', v)} placeholder="2 places extérieures, Facilité, Non…" />
            </Field>
          </div>
        </Section>

        <Section title="Énergie (DPE / GES)" icon={Flame}>
          <FieldRow cols={2}>
            <Field label="Classe DPE"><SelectInput value={listing.dpe} onChange={v => set('dpe', v)} options={DPE_OPTIONS} /></Field>
            <Field label="Valeur DPE (kWh/m²/an)"><NumberInput value={listing.dpeValue} onChange={v => set('dpeValue', v)} /></Field>
            <Field label="Classe GES"><SelectInput value={listing.ges} onChange={v => set('ges', v)} options={DPE_OPTIONS} /></Field>
            <Field label="Valeur GES (kg CO₂/m²/an)"><NumberInput value={listing.gesValue} onChange={v => set('gesValue', v)} /></Field>
            <Field label="Chauffage" full>
              <TextInput value={listing.heating} onChange={v => set('heating', v)} placeholder="Pompe à chaleur air-eau, Électrique individuel…" />
            </Field>
          </FieldRow>
        </Section>

        <Section title="Description" icon={FileText}>
          <TextArea value={listing.description} onChange={v => set('description', v)} rows={8} placeholder="Décrivez le bien… (les sauts de ligne sont conservés)" />
        </Section>

        <Section title="Photos" icon={Calendar}>
          <PhotosEditor listing={listing} onChange={onChange} />
        </Section>

        <Section title="Fiche technique PDF" icon={FileText}>
          <PdfField value={listing.fichePdf} onChange={v => set('fichePdf', v)} refCode={listing.ref} />
        </Section>

        <div className="h-4" />
      </div>
    </div>
  )
}

// =============================================================
// TOPBAR
// =============================================================
function TopBar({ count, saved, onExport, onCopy, onImport, onReset, onPublishSite }) {
  return (
    <header className="shrink-0 bg-ink-950 text-white">
      <div className="px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
            <polygon points="2,2 38,2 2,38" fill="#d87a2e" />
            <polygon points="38,2 38,38 2,38" fill="#ffffff" />
          </svg>
          <div className="leading-tight min-w-0">
            <div className="text-[14px] font-semibold tracking-tight">Administration des annonces</div>
            <div className="text-[11px] text-ink-300 font-mono">{count} bien{count > 1 ? 's' : ''} · sauvegarde automatique</div>
          </div>
          <span className={`ml-2 inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full transition ${saved ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-ink-200'}`}>
            {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Enregistré' : 'Modification…'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPublishSite}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-semibold px-3 py-2 rounded-md transition shadow-sm">
            <Globe className="w-3.5 h-3.5" /> Publier le site
          </button>
          <a href="./" target="_blank" rel="noopener"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-100 hover:text-white border border-white/15 hover:border-white/40 px-3 py-2 rounded-md transition">
            <ExternalLink className="w-3.5 h-3.5" /> Voir le site
          </a>
          <button onClick={onImport}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-100 hover:text-white border border-white/15 hover:border-white/40 px-3 py-2 rounded-md transition">
            <Upload className="w-3.5 h-3.5" /> Importer
          </button>
          <button onClick={onCopy}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-100 hover:text-white border border-white/15 hover:border-white/40 px-3 py-2 rounded-md transition">
            <Copy className="w-3.5 h-3.5" /> Copier
          </button>
          <button onClick={onExport}
            className="inline-flex items-center gap-1.5 bg-sand-500 hover:bg-sand-600 text-white text-[12px] font-medium px-3 py-2 rounded-md transition">
            <Download className="w-3.5 h-3.5" /> Exporter JSON
          </button>
          <button onClick={onReset} title="Réinitialiser aux annonces d'origine"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-300 hover:text-white px-2 py-2 rounded-md transition">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}

// =============================================================
// TOAST
// =============================================================
function Toast({ msg }) {
  if (!msg) return null
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-ink-900 text-white text-[13px] px-4 py-2.5 rounded-lg shadow-card">
      {msg}
    </div>
  )
}

// =============================================================
// LOGIN GATE
// =============================================================
function Login({ onSuccess }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (code.trim() === ACCESS_CODE) {
      try { sessionStorage.setItem(AUTH_KEY, '1') } catch { /* ignore */ }
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 px-4">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(135deg, #ffffff 0 1px, transparent 1px 16px)' }}></div>
      <form onSubmit={submit} className="relative w-full max-w-[380px] bg-white rounded-2xl shadow-card p-8">
        <div className="flex items-center gap-3">
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
            <polygon points="2,2 38,2 2,38" fill="#d87a2e" />
            <polygon points="38,2 38,38 2,38" fill="#1f3a5f" />
          </svg>
          <div className="leading-tight">
            <div className="text-[13px] font-bold tracking-tight text-ink-900 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>RENOV CONSEIL EST</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-[0.18em] uppercase text-sand-700">Administration</div>
          </div>
        </div>

        <h1 className="mt-7 text-[19px] font-semibold tracking-tight text-ink-900">Accès réservé</h1>
        <p className="mt-1 text-[13px] text-ink-500">Saisissez le code d'accès pour gérer les annonces.</p>

        <div className="mt-5">
          <div className="relative">
            <Key className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="password" autoFocus value={code}
              onChange={e => { setCode(e.target.value); setError(false) }}
              placeholder="Code d'accès"
              className={`w-full pl-9 pr-3 py-2.5 rounded-md border text-[14px] text-ink-900 focus:outline-none focus:ring-2 transition ${
                error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : 'border-ink-200 focus:border-ink-900 focus:ring-ink-900/10'
              }`} />
          </div>
          {error && <div className="mt-2 text-[12px] text-red-600">Code incorrect. Réessayez.</div>}
        </div>

        <button type="submit"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-800 text-white text-[14px] font-medium px-4 py-2.5 rounded-md transition">
          Entrer <ArrowRight className="w-4 h-4" />
        </button>

        <a href="./"
          className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-ink-400 hover:text-ink-700 transition">
          <Building2 className="w-3.5 h-3.5" /> Retour au site public
        </a>
      </form>
    </div>
  )
}

// =============================================================
// ADMIN APP
// =============================================================
export default function AdminApp() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(AUTH_KEY) === '1' } catch { return false }
  })

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedRef, setSelectedRef] = useState(null)
  const [saved, setSaved] = useState(true)
  const [toast, setToast] = useState('')
  const [showPublish, setShowPublish] = useState(false)
  const saveTimer = useRef(null)

  // Load from API on auth
  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch('/api/annonces')
      .then(r => r.json())
      .then(data => {
        const loaded = normalize(Array.isArray(data) && data.length ? data : clone(DEFAULT_LISTINGS))
        setListings(loaded)
        setSelectedRef(loaded[0]?.ref || null)
      })
      .catch(() => {
        const def = normalize(clone(DEFAULT_LISTINGS))
        setListings(def)
        setSelectedRef(def[0]?.ref || null)
        flash('⚠ Serveur API inaccessible — données par défaut chargées. Démarrez "npm run dev".')
      })
      .finally(() => setLoading(false))
  }, [authed])

  // Debounced save to API
  useEffect(() => {
    if (!listings || !authed) return
    setSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      fetch('/api/annonces', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalize(listings)),
      })
        .then(() => setSaved(true))
        .catch(() => flash('⚠ Sauvegarde impossible — serveur API inaccessible'))
    }, 600)
    return () => clearTimeout(saveTimer.current)
  }, [listings])

  function flash(msg) {
    setToast(msg)
    clearTimeout(window.__toastT)
    window.__toastT = setTimeout(() => setToast(''), 4000)
  }

  const selected = useMemo(
    () => (listings || []).find(l => l.ref === selectedRef) || null,
    [listings, selectedRef]
  )

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />

  if (loading || !listings) {
    return (
      <div className="h-screen flex items-center justify-center bg-ink-950 text-white text-[14px]">
        <span className="animate-pulse">Chargement des annonces…</span>
      </div>
    )
  }

  function updateListing(next) {
    setListings(prev => prev.map(l => (l.ref === selected.ref ? next : l)))
    if (next.ref !== selected.ref) setSelectedRef(next.ref)
  }

  function reorderListings(from, to) {
    setListings(prev => {
      if (from < 0 || from >= prev.length || to < 0 || to >= prev.length) return prev
      const next = prev.slice()
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function addListing() {
    const blank = makeBlankListing()
    setListings(prev => [blank, ...prev])
    setSelectedRef(blank.ref)
    flash('Nouvelle annonce créée')
  }

  function duplicateListing() {
    if (!selected) return
    const copy = clone(selected)
    copy.ref = selected.ref + '-COPIE'
    copy.title = selected.title + ' (copie)'
    copy.slug = slugify(copy.title)
    copy.isNew = true
    copy.published = false
    copy.publishedAt = todayISO()
    copy.photoUrls = []
    setListings(prev => {
      const idx = prev.findIndex(l => l.ref === selected.ref)
      const next = prev.slice()
      next.splice(idx + 1, 0, copy)
      return next
    })
    setSelectedRef(copy.ref)
    flash('Annonce dupliquée (dépubliée par défaut)')
  }

  function deleteListing() {
    if (!selected) return
    if (!window.confirm(`Supprimer définitivement l'annonce « ${selected.title} » ?`)) return
    setListings(prev => {
      const idx = prev.findIndex(l => l.ref === selected.ref)
      const next = prev.filter(l => l.ref !== selected.ref)
      const neighbour = next[idx] || next[idx - 1] || next[0]
      setSelectedRef(neighbour ? neighbour.ref : null)
      return next
    })
    flash('Annonce supprimée')
  }

  function togglePublish(ref) {
    setListings(prev => prev.map(l => l.ref === ref ? { ...l, published: !l.published } : l))
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(normalize(listings), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `annonces-renovconseil-${todayISO()}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    flash('Fichier JSON téléchargé')
  }

  async function copyJSON() {
    const txt = JSON.stringify(normalize(listings), null, 2)
    try {
      await navigator.clipboard.writeText(txt)
      flash('Données copiées dans le presse-papier')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = txt; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy'); flash('Données copiées') }
      catch { flash('Copie impossible — utilisez Exporter JSON') }
      ta.remove()
    }
  }

  function importJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = () => {
      const file = input.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result)
          if (!Array.isArray(parsed) || !parsed.length) throw new Error('format')
          const normed = normalize(parsed)
          setListings(normed)
          setSelectedRef(normed[0].ref)
          flash(`${normed.length} annonces importées`)
        } catch {
          flash('Fichier JSON invalide')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  function resetDefaults() {
    if (!window.confirm("Réinitialiser toutes les annonces à leur version d'origine ? Vos modifications seront perdues.")) return
    const def = normalize(clone(DEFAULT_LISTINGS))
    setListings(def)
    setSelectedRef(def[0] ? def[0].ref : null)
    flash('Annonces réinitialisées')
  }

  const publishedCount = listings.filter(l => l.published).length

  return (
    <div className="h-screen flex flex-col bg-ink-50/40">
      <TopBar
        count={listings.length}
        saved={saved}
        onExport={exportJSON}
        onCopy={copyJSON}
        onImport={importJSON}
        onReset={resetDefaults}
        onPublishSite={() => setShowPublish(true)}
      />
      <div className="flex-1 flex min-h-0">
        <Sidebar
          listings={listings}
          selectedRef={selectedRef}
          onSelect={setSelectedRef}
          onAdd={addListing}
          onReorder={reorderListings}
          onTogglePublish={togglePublish}
        />
        <Editor
          listing={selected}
          onChange={updateListing}
          onDuplicate={duplicateListing}
          onDelete={deleteListing}
        />
      </div>
      <div className="shrink-0 bg-white border-t border-ink-200 px-5 py-2.5 text-[11px] text-ink-500 flex items-center justify-between gap-4">
        <span>
          <strong className="text-emerald-700">{publishedCount}</strong> annonce{publishedCount > 1 ? 's' : ''} publiée{publishedCount > 1 ? 's' : ''} sur {listings.length} · données enregistrées dans <strong className="text-ink-700">annonces.json</strong>
        </span>
        <span>
          Cliquez sur <strong className="text-ink-700">Publier le site</strong> pour mettre en ligne toutes les modifications.
        </span>
      </div>
      <Toast msg={toast} />
      {showPublish && <PublishModal onClose={() => setShowPublish(false)} />}
    </div>
  )
}
