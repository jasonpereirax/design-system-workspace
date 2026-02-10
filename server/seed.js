import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { db, nowIso, slugify } from './db.js'

const email = 'demo@gauge.local'
const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

if (!existing) {
  const user = {
    id: crypto.randomUUID(),
    email,
    name: 'Demo User',
    created_at: nowIso()
  }
  db.prepare('INSERT INTO users (id, email, name, created_at) VALUES (?, ?, ?, ?)')
    .run(user.id, user.email, user.name, user.created_at)

  const org = {
    id: crypto.randomUUID(),
    name: 'Gauge Agency',
    slug: slugify('Gauge Agency'),
    created_at: nowIso()
  }
  db.prepare('INSERT INTO organizations (id, name, slug, created_at) VALUES (?, ?, ?, ?)')
    .run(org.id, org.name, org.slug, org.created_at)

  db.prepare('INSERT INTO organization_members (id, organization_id, user_id, role, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), org.id, user.id, 'owner', nowIso())

  const project = {
    id: crypto.randomUUID(),
    organization_id: org.id,
    name: 'Gauge DS',
    slug: slugify('Gauge DS'),
    visibility: 'public',
    created_at: nowIso()
  }
  db.prepare('INSERT INTO projects (id, organization_id, name, slug, visibility, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(project.id, project.organization_id, project.name, project.slug, project.visibility, project.created_at)

  const version = {
    id: crypto.randomUUID(),
    project_id: project.id,
    version: 'v1.0.0',
    status: 'ready',
    artifact_url: 'local://storage/demo.json',
    created_at: nowIso()
  }
  db.prepare('INSERT INTO project_versions (id, project_id, version, status, artifact_url, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(version.id, version.project_id, version.version, version.status, version.artifact_url, version.created_at)

  db.prepare('UPDATE projects SET default_version_id = ? WHERE id = ?')
    .run(version.id, project.id)

  const storageDir = path.resolve('server/storage')
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
  }

  const demoPayload = {
    components: [
      {
        name: 'Button Primary',
        type: 'COMPONENT',
        html: '<button class="btn-primary">Primary Button</button>',
        css: '.btn-primary { background: #111827; color: #fff; padding: 10px 18px; border-radius: 999px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; } .btn-primary:hover { background: #1f2937; }',
        react: 'import React from "react";\n\nexport const ButtonPrimary = ({ children, ...props }) => {\n  return <button className="btn-primary" {...props}>{children}</button>;\n};',
        tailwind: 'export const ButtonPrimary = ({ children, ...props }) => <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-all" {...props}>{children}</button>;',
        svgData: '<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="40" rx="20" fill="#111827"/><text x="60" y="25" font-family="Arial" font-size="14" font-weight="600" fill="white" text-anchor="middle">Primary</text></svg>',
        figmaUrl: 'https://figma.com/file/example',
        bounds: { width: 120, height: 40 }
      },
      {
        name: 'Card',
        type: 'COMPONENT',
        html: '<div class="card-preview"><h4>Card Title</h4><p>Supporting text for the card component</p></div>',
        css: '.card-preview { padding: 16px; border-radius: 12px; border: 1px solid #eadbc9; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05); } .card-preview h4 { margin: 0 0 8px; font-size: 16px; font-weight: 600; } .card-preview p { margin: 0; font-size: 14px; color: #6b7280; }',
        react: 'import React from "react";\n\nexport const Card = ({ title, description }) => {\n  return (\n    <div className="card-preview">\n      <h4>{title}</h4>\n      <p>{description}</p>\n    </div>\n  );\n};',
        tailwind: 'export const Card = ({ title, description }) => <div className="p-4 rounded-xl border border-amber-200 bg-white shadow-sm"><h4 className="text-base font-semibold mb-2">{title}</h4><p className="text-sm text-gray-500">{description}</p></div>;',
        svgData: '<svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="120" rx="12" fill="white" stroke="#eadbc9"/><text x="16" y="30" font-family="Arial" font-size="16" font-weight="600" fill="#111827">Card Title</text><text x="16" y="55" font-family="Arial" font-size="14" fill="#6b7280">Supporting text</text></svg>',
        figmaUrl: 'https://figma.com/file/example',
        bounds: { width: 200, height: 120 }
      }
    ],
    tokens: {
      primary: '#111827',
      secondary: '#6b7280',
      background: '#fff',
      border: '#eadbc9'
    },
    metadata: {
      note: 'Demo payload criado pelo seed',
      source: 'seed-script',
      createdAt: nowIso()
    }
  }

  fs.writeFileSync(
    path.join(storageDir, 'demo.json'),
    JSON.stringify(demoPayload, null, 2)
  )

  console.log('✅ Seed completo: usuario, org, projeto e versao demo criados')
  console.log('📦 Payload demo criado em: server/storage/demo.json')
}
