import React, { useRef } from 'react'
import { Plus, Trash2, FileText, Upload, Check } from './icons'

export const TYPE_OPTIONS = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'immeuble', label: 'Immeuble' },
  { value: 'bureau', label: 'Bureau' },
  { value: 'hangar', label: 'Hangar / local' },
]

export const TRANSACTION_OPTIONS = [
  { value: 'location', label: 'Location' },
  { value: 'vente', label: 'Vente' },
]

export const DPE_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(v => ({ value: v, label: v }))

export function slugify(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function genRef() {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `RCE${String(new Date().getFullYear()).slice(2)}${n}`
}

export function makeBlankListing() {
  return {
    ref: genRef(),
    slug: '',
    type: 'appartement',
    transaction: 'location',
    title: 'Nouvelle annonce',
    city: '',
    postalCode: '',
    price: 0,
    priceUnit: '€ / mois CC',
    honoraires: 0,
    surface: 0,
    landSurface: null,
    rooms: 1,
    bedrooms: 0,
    bathrooms: 1,
    floor: '',
    floorNum: 0,
    elevator: false,
    yearBuilt: new Date().getFullYear(),
    heating: '',
    furnished: false,
    cave: false,
    parking: 'Non',
    hasParking: false,
    balcony: false,
    terrace: false,
    garden: false,
    dpe: 'D',
    dpeValue: 0,
    ges: 'C',
    gesValue: 0,
    availableFrom: 'Immédiatement',
    description: '',
    fichePdf: null,
    photoCount: 0,
    photoLabels: [],
    workstations: null,
    ceilingHeight: null,
    yieldGross: null,
    publishedAt: todayISO(),
    isNew: true,
    published: true,
    photoUrls: [],
  }
}

// =============================================================
// LAYOUT
// =============================================================
export function FieldRow({ children, cols = 2 }) {
  const grid = cols === 3 ? 'sm:grid-cols-3' : cols === 1 ? '' : 'sm:grid-cols-2'
  return <div className={`grid grid-cols-1 ${grid} gap-x-5 gap-y-4`}>{children}</div>
}

export function Field({ label, hint, children, full }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] font-medium text-ink-700">{label}</span>
        {hint && <span className="text-[11px] text-ink-400">{hint}</span>}
      </div>
      {children}
    </label>
  )
}

export function Section({ title, icon: Icon, children }) {
  return (
    <section className="bg-white rounded-xl border border-ink-200 shadow-soft overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-100 bg-ink-50/60">
        {Icon && <Icon className="w-4 h-4 text-sand-600" />}
        <h3 className="text-[13px] font-semibold tracking-tight text-ink-900">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

// =============================================================
// INPUTS
// =============================================================
const inputCls =
  'w-full px-3 py-2 rounded-md border border-ink-200 bg-white text-[14px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 transition'

export function TextInput({ value, onChange, placeholder, mono }) {
  return (
    <input type="text" value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`${inputCls} ${mono ? 'font-mono tracking-wide' : ''}`} />
  )
}

export function NumberInput({ value, onChange, placeholder, allowNull }) {
  return (
    <input type="number" value={value === null || value === undefined ? '' : value}
      onChange={e => {
        const v = e.target.value
        if (v === '') { onChange(allowNull ? null : 0); return }
        onChange(Number(v))
      }}
      placeholder={placeholder} className={inputCls} />
  )
}

export function SelectInput({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function TextArea({ value, onChange, rows = 5, placeholder }) {
  return (
    <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={rows}
      placeholder={placeholder} className={`${inputCls} leading-relaxed resize-y`} />
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md border text-[13px] font-medium transition text-left ${
        checked ? 'border-sand-500 bg-sand-50 text-ink-900' : 'border-ink-200 bg-white text-ink-500 hover:border-ink-300'
      }`}>
      <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition ${checked ? 'bg-sand-500' : 'bg-ink-200'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

export function PhotoLabelsEditor({ items, onChange }) {
  const list = items || []
  function update(i, val) { const next = list.slice(); next[i] = val; onChange(next) }
  function remove(i) { onChange(list.filter((_, idx) => idx !== i)) }
  function add() { onChange([...list, '']) }
  return (
    <div className="space-y-2">
      {list.length === 0 && (
        <div className="text-[12px] text-ink-400 italic">Aucune photo. Ajoutez les légendes des photos du bien.</div>
      )}
      {list.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink-400 w-6 shrink-0 text-right">{i + 1}.</span>
          <input type="text" value={label} onChange={e => update(i, e.target.value)} placeholder={`Légende photo ${i + 1}`}
            className={`${inputCls} py-1.5`} />
          <button type="button" onClick={() => remove(i)} aria-label="Supprimer"
            className="shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-md text-ink-400 hover:text-red-600 hover:bg-red-50 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-sand-700 hover:text-sand-800 transition">
        <Plus className="w-4 h-4" />
        Ajouter une photo
      </button>
    </div>
  )
}

export function PdfField({ value, onChange, refCode }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = React.useState(false)
  const [warn, setWarn] = React.useState('')

  const isData = typeof value === 'string' && value.startsWith('data:')
  const isPath = typeof value === 'string' && value && !value.startsWith('data:')

  function handleFile(file) {
    setWarn('')
    if (!file) return
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setWarn('Le fichier doit être un PDF.')
      return
    }
    if (file.size > 1.6 * 1024 * 1024) {
      setWarn('PDF lourd (> 1,6 Mo) : il peut dépasser la capacité du navigateur. Privilégiez un PDF allégé, ou envoyez-le pour hébergement définitif.')
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
        className={`rounded-lg border-2 border-dashed px-4 py-5 text-center transition ${drag ? 'border-sand-500 bg-sand-50' : 'border-ink-200 bg-ink-50/40'}`}>
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-800">
              <FileText className="w-4 h-4 text-sand-600" />
              {isData ? `fiche-${refCode}.pdf` : value.split('/').pop()}
              <Check className="w-4 h-4 text-emerald-600" />
            </span>
            <button type="button" onClick={() => { onChange(null); setWarn('') }}
              className="inline-flex items-center gap-1 text-[12px] text-ink-500 hover:text-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" /> Retirer
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current && inputRef.current.click()}
            className="inline-flex flex-col items-center gap-1.5 text-ink-500 hover:text-ink-700 transition">
            <Upload className="w-5 h-5" />
            <span className="text-[13px] font-medium">Glisser un PDF ici, ou cliquer pour choisir</span>
            <span className="text-[11px] text-ink-400">Fiche technique du bien</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden"
          onChange={e => handleFile(e.target.files[0])} />
      </div>
      {isPath && <div className="mt-1.5 text-[11px] text-ink-400 font-mono">Fichier hébergé : {value}</div>}
      {warn && <div className="mt-1.5 text-[11px] text-amber-700">{warn}</div>}
    </div>
  )
}
