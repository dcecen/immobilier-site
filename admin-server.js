import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { spawn } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3001
const ANNONCES_FILE = path.join(__dirname, 'public', 'annonces.json')
const PHOTOS_DIR = path.join(__dirname, 'public', 'images', 'annonces')
const DIST_DIR = path.join(__dirname, 'docs')

const app = express()
app.use(express.json({ limit: '50mb' }))

// Serve built static files if dist/ exists (production local mode)
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
}

// Restrict /admin* to localhost only
app.use((req, res, next) => {
  if (req.path.startsWith('/admin')) {
    const ip = req.ip || req.socket.remoteAddress || ''
    const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1']
    if (!local.includes(ip)) {
      return res.status(403).send('Accès réservé — admin disponible uniquement en local')
    }
  }
  next()
})

// ── GET /api/annonces ──────────────────────────────────────────
app.get('/api/annonces', (req, res) => {
  try {
    const raw = fs.readFileSync(ANNONCES_FILE, 'utf-8')
    res.json(JSON.parse(raw))
  } catch {
    res.json([])
  }
})

// ── PUT /api/annonces ──────────────────────────────────────────
app.put('/api/annonces', (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Array expected' })
    fs.writeFileSync(ANNONCES_FILE, JSON.stringify(req.body, null, 2), 'utf-8')
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Photo upload ───────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(PHOTOS_DIR, req.params.ref)
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, safe)
  },
})
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } })

app.post('/api/photos/:ref', upload.array('photos', 30), (req, res) => {
  const urls = (req.files || []).map(
    f => `/images/annonces/${req.params.ref}/${f.filename}`
  )
  res.json({ ok: true, urls })
})

app.get('/api/photos/:ref', (req, res) => {
  const dir = path.join(PHOTOS_DIR, req.params.ref)
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
      .sort()
      .map(f => `/images/annonces/${req.params.ref}/${f}`)
    res.json(files)
  } catch {
    res.json([])
  }
})

app.delete('/api/photos/:ref/:filename', (req, res) => {
  const fp = path.join(PHOTOS_DIR, req.params.ref, path.basename(req.params.filename))
  try {
    fs.unlinkSync(fp)
    res.json({ ok: true })
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
})

// ── POST /api/publish — SSE stream ────────────────────────────
app.post('/api/publish', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, data })}\n\n`)
  }

  const steps = [
    ['npm', ['run', 'build'], 'Construction du site (npm run build)…'],
    ['git', ['add', '.'], 'Indexation des fichiers (git add .)…'],
    ['git', ['commit', '-m', 'mise à jour annonces'], 'Enregistrement (git commit)…'],
    ['git', ['push'], 'Publication en ligne (git push)…'],
  ]

  ;(async () => {
    for (const [cmd, args, label] of steps) {
      send('step', label)
      await new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, { cwd: __dirname, shell: true })
        proc.stdout.on('data', d => {
          const lines = d.toString().split('\n').filter(l => l.trim())
          lines.forEach(l => send('log', l))
        })
        proc.stderr.on('data', d => {
          const lines = d.toString().split('\n').filter(l => l.trim())
          lines.forEach(l => send('log', l))
        })
        proc.on('close', code => {
          // git commit exits 1 when nothing to commit — acceptable
          if (code === 0 || (cmd === 'git' && args[0] === 'commit' && code === 1)) {
            resolve()
          } else {
            reject(new Error(`Erreur : ${cmd} ${args.join(' ')} (code ${code})`))
          }
        })
      }).catch(e => {
        send('error', e.message)
        throw e
      })
    }
    send('done', '✓ Site publié avec succès !')
  })()
    .catch(() => {})
    .finally(() => res.end())
})

// ── SPA fallback for dist/ ─────────────────────────────────────
if (fs.existsSync(DIST_DIR)) {
  app.get('/admin.html', (req, res) => res.sendFile(path.join(DIST_DIR, 'admin.html')))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/images')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'))
    }
  })
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✓ Serveur admin API → http://127.0.0.1:${PORT}`)
  if (fs.existsSync(DIST_DIR)) {
    console.log(`  Site public → http://localhost:${PORT}/`)
    console.log(`  Administration → http://localhost:${PORT}/admin.html`)
  } else {
    console.log(`  (Lancez "npm run build" pour servir le site complet)`)
  }
})
