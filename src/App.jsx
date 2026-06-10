import React, { useState, useEffect } from 'react'
import { ImmoHeader, ImmoFooter, ListView, DetailView, ContactModal, LISTINGS } from './listings'

function parseHash() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '')
  if (!raw) return { view: 'list', ref: null, txn: 'all' }
  const [base, query] = raw.split('?')
  const params = new URLSearchParams(query || '')
  if (base.startsWith('annonce/')) {
    return { view: 'detail', ref: base.split('/')[1], txn: 'all' }
  }
  return { view: 'list', ref: null, txn: params.get('txn') || 'all' }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash())
  const [contact, setContact] = useState(null)

  useEffect(() => {
    const fromHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  function openListing(ref) {
    window.location.hash = `#/annonce/${ref}`
    window.scrollTo({ top: 0, behavior: 'instant' in window.scroll ? 'instant' : 'auto' })
  }

  function goList(txn) {
    const hash = txn && txn !== 'all' ? `#/?txn=${txn}` : '#/'
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute({ view: 'list', ref: null, txn: txn || 'all' })
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window.scroll ? 'instant' : 'auto' })
  }

  let main
  if (route.view === 'detail') {
    const listing = LISTINGS.find(l => l.ref === route.ref)
    if (!listing) {
      main = (
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h2 className="text-2xl font-semibold">Annonce introuvable</h2>
          <button onClick={() => goList('all')} className="mt-6 inline-flex items-center gap-2 text-sand-700 hover:text-sand-800 font-medium">
            ← Retour aux annonces
          </button>
        </div>
      )
    } else {
      main = <DetailView listing={listing} onBack={() => goList('all')} onContact={setContact} />
    }
  } else {
    main = <ListView onOpen={openListing} initialTransaction={route.txn} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ImmoHeader view={route.view} onSearch={goList} onLogo={() => goList('all')} />
      <main className="flex-1">
        {main}
      </main>
      <ImmoFooter />
      {contact && <ContactModal listing={contact} onClose={() => setContact(null)} />}
    </div>
  )
}
