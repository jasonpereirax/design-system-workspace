import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { db, nowIso, slugify, getUserByToken, ensureDefaultOrgForUser } from './db.js'

const fastify = Fastify({ logger: true })

await fastify.register(cors, { origin: true })

const storageDir = path.resolve('server/storage')
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true })
}

function requireUser(req, reply) {
  const token = req.headers['x-auth-token']
  const user = getUserByToken(token)
  if (!user) {
    reply.code(401).send({ error: 'unauthorized' })
    return null
  }
  return user
}

function hashPassword(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function ensureMember(userId, orgId) {
  const member = db.prepare('SELECT * FROM organization_members WHERE organization_id = ? AND user_id = ?')
    .get(orgId, userId)
  return member || null
}

function getProjectPasswordHash(projectId) {
  const record = db
    .prepare('SELECT value FROM project_access WHERE project_id = ? AND type = ?')
    .get(projectId, 'password')
  return record ? record.value : null
}

function canAccessProject(project, password) {
  if (project.visibility === 'public') return true
  const stored = getProjectPasswordHash(project.id)
  if (!stored) return false
  if (!password) return false
  return hashPassword(password) === stored
}

function resolveArtifactPath(artifactUrl) {
  if (!artifactUrl) return null
  const prefix = 'local://storage/'
  if (!artifactUrl.startsWith(prefix)) return null
  const relative = artifactUrl.replace(prefix, '')
  return path.join(storageDir, relative)
}

function extractBody(html) {
  if (!html) return ''
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (match) return match[1]
  return html
}

function renderComponentPreview(component) {
  const html = extractBody(component.html || '')
  const css = component.css || ''

  if (component.svgData) {
    return `<div class=\"preview\" style=\"display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;\">${component.svgData}</div>`
  }
  if (html || css) {
    return `<style>${css}</style><div class=\"preview\" style=\"display: flex; align-items: center; justify-content: center;\">${html}</div>`
  }
  return `<div class=\"preview placeholder\">${component.name || 'Componente'}</div>`
}

fastify.post('/auth/token', async (req, reply) => {
  const { email, name } = req.body || {}
  if (!email) {
    return reply.code(400).send({ error: 'email_required' })
  }

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email,
      name: name || email.split('@')[0],
      created_at: nowIso()
    }
    db.prepare('INSERT INTO users (id, email, name, created_at) VALUES (?, ?, ?, ?)')
      .run(user.id, user.email, user.name, user.created_at)
  }

  const org = ensureDefaultOrgForUser(user)

  reply.send({ token: user.id, user, default_org: org })
})

fastify.get('/organizations', async (req, reply) => {
  const user = requireUser(req, reply)
  if (!user) return

  const orgs = db.prepare(`
    SELECT o.* FROM organizations o
    JOIN organization_members m ON m.organization_id = o.id
    WHERE m.user_id = ?
    ORDER BY o.created_at DESC
  `).all(user.id)

  reply.send({ organizations: orgs })
})

fastify.get('/projects', async (req, reply) => {
  const user = requireUser(req, reply)
  if (!user) return

  const orgId = req.query.org_id
  if (!orgId) {
    return reply.code(400).send({ error: 'org_id_required' })
  }

  const member = ensureMember(user.id, orgId)
  if (!member) return reply.code(403).send({ error: 'forbidden' })

  const projects = db.prepare(`
    SELECT p.*,
      v.version AS default_version,
      (
        SELECT COUNT(1)
        FROM project_access pa
        WHERE pa.project_id = p.id AND pa.type = 'password'
      ) AS has_password
    FROM projects p
    LEFT JOIN project_versions v ON v.id = p.default_version_id
    WHERE p.organization_id = ?
    ORDER BY p.created_at DESC
  `).all(orgId)

  reply.send({ projects })
})

fastify.post('/projects', async (req, reply) => {
  const user = requireUser(req, reply)
  if (!user) return

  const { organization_id, name, visibility } = req.body || {}
  if (!organization_id || !name) {
    return reply.code(400).send({ error: 'organization_id_and_name_required' })
  }

  const member = ensureMember(user.id, organization_id)
  if (!member) return reply.code(403).send({ error: 'forbidden' })

  const slug = slugify(name)
  const exists = db.prepare('SELECT id FROM projects WHERE organization_id = ? AND slug = ?').get(organization_id, slug)
  if (exists) {
    return reply.code(409).send({ error: 'project_slug_exists' })
  }

  const project = {
    id: crypto.randomUUID(),
    organization_id,
    name,
    slug,
    visibility: visibility || 'private',
    default_version_id: null,
    created_at: nowIso()
  }

  db.prepare('INSERT INTO projects (id, organization_id, name, slug, visibility, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(project.id, project.organization_id, project.name, project.slug, project.visibility, project.created_at)

  reply.send({ project })
})

fastify.get('/projects/:id/versions', async (req, reply) => {
  const user = requireUser(req, reply)
  if (!user) return

  const projectId = req.params.id
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId)
  if (!project) return reply.code(404).send({ error: 'project_not_found' })

  const member = ensureMember(user.id, project.organization_id)
  if (!member) return reply.code(403).send({ error: 'forbidden' })

  const versions = db.prepare(`
    SELECT * FROM project_versions
    WHERE project_id = ?
    ORDER BY created_at DESC
  `).all(projectId)

  reply.send({ versions })
})

fastify.put('/projects/:id/password', async (req, reply) => {
  const user = requireUser(req, reply)
  if (!user) return

  const projectId = req.params.id
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId)
  if (!project) return reply.code(404).send({ error: 'project_not_found' })

  const member = ensureMember(user.id, project.organization_id)
  if (!member) return reply.code(403).send({ error: 'forbidden' })

  const { password } = req.body || {}
  if (!password || password.length < 4) {
    return reply.code(400).send({ error: 'password_min_length' })
  }

  const hash = hashPassword(password)
  const existing = db.prepare('SELECT id FROM project_access WHERE project_id = ? AND type = ?')
    .get(projectId, 'password')

  if (existing) {
    db.prepare('UPDATE project_access SET value = ?, created_at = ? WHERE id = ?')
      .run(hash, nowIso(), existing.id)
  } else {
    db.prepare('INSERT INTO project_access (id, project_id, type, value, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(crypto.randomUUID(), projectId, 'password', hash, nowIso())
  }

  reply.send({ ok: true })
})

fastify.post('/projects/:id/deploy', async (req, reply) => {
  const user = requireUser(req, reply)
  if (!user) return

  const projectId = req.params.id
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId)
  if (!project) return reply.code(404).send({ error: 'project_not_found' })

  const member = ensureMember(user.id, project.organization_id)
  if (!member) return reply.code(403).send({ error: 'forbidden' })

  const { version, payload, set_default } = req.body || {}
  if (!version || !payload) {
    return reply.code(400).send({ error: 'version_and_payload_required' })
  }

  const versionId = crypto.randomUUID()
  const record = {
    id: versionId,
    project_id: projectId,
    version,
    status: 'building',
    artifact_url: null,
    created_at: nowIso()
  }
  db.prepare('INSERT INTO project_versions (id, project_id, version, status, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(record.id, record.project_id, record.version, record.status, record.created_at)

  const artifactPath = path.join(storageDir, projectId)
  if (!fs.existsSync(artifactPath)) {
    fs.mkdirSync(artifactPath, { recursive: true })
  }
  const artifactFile = path.join(artifactPath, `${version}.json`)
  fs.writeFileSync(artifactFile, JSON.stringify(payload, null, 2))

  const artifactUrl = `local://storage/${projectId}/${version}.json`
  db.prepare('UPDATE project_versions SET status = ?, artifact_url = ? WHERE id = ?')
    .run('ready', artifactUrl, versionId)

  if (set_default) {
    db.prepare('UPDATE projects SET default_version_id = ? WHERE id = ?')
      .run(versionId, projectId)
  }

  reply.send({ version_id: versionId, artifact_url: artifactUrl })
})

fastify.patch('/projects/:id', async (req, reply) => {
  const user = requireUser(req, reply)
  if (!user) return

  const projectId = req.params.id
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId)
  if (!project) return reply.code(404).send({ error: 'project_not_found' })

  const member = ensureMember(user.id, project.organization_id)
  if (!member) return reply.code(403).send({ error: 'forbidden' })

  const { visibility, default_version_id } = req.body || {}
  if (!visibility && !default_version_id) {
    return reply.code(400).send({ error: 'no_changes' })
  }

  if (visibility) {
    db.prepare('UPDATE projects SET visibility = ? WHERE id = ?')
      .run(visibility, projectId)
  }

  if (default_version_id) {
    db.prepare('UPDATE projects SET default_version_id = ? WHERE id = ?')
      .run(default_version_id, projectId)
  }

  reply.send({ ok: true })
})

fastify.get('/public/:org/:project', async (req, reply) => {
  const { org, project } = req.params
  const orgRecord = db.prepare('SELECT * FROM organizations WHERE slug = ?').get(org)
  if (!orgRecord) return reply.code(404).send({ error: 'org_not_found' })

  const projectRecord = db.prepare('SELECT * FROM projects WHERE organization_id = ? AND slug = ?')
    .get(orgRecord.id, project)
  if (!projectRecord) return reply.code(404).send({ error: 'project_not_found' })

  const password = req.query.password || req.headers['x-project-password']
  if (!canAccessProject(projectRecord, password)) {
    reply.type('text/html').send(`<!doctype html>
      <html lang=\"en\">
        <head>
          <meta charset=\"utf-8\" />
          <title>${orgRecord.name} - ${projectRecord.name}</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f7f0e6; padding: 40px; }
            .card { max-width: 420px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 16px; }
            input { width: 100%; padding: 10px; margin-top: 8px; margin-bottom: 16px; }
            button { padding: 10px 16px; background: #111; color: #fff; border: none; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class=\"card\">
            <h2>Projeto privado</h2>
            <p>Digite a senha para acessar ${projectRecord.name}.</p>
            <form method=\"GET\">
              <input name=\"password\" type=\"password\" placeholder=\"Senha\" required />
              <button type=\"submit\">Acessar</button>
            </form>
          </div>
        </body>
      </html>`)
    return
  }

  const version = projectRecord.default_version_id
    ? db.prepare('SELECT * FROM project_versions WHERE id = ?').get(projectRecord.default_version_id)
    : null

  const artifactPath = resolveArtifactPath(version?.artifact_url)
  let payload = null
  if (artifactPath && fs.existsSync(artifactPath)) {
    payload = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'))
  }

  const components = payload?.components || []
  const componentsHtml = components.map((component) => {
    return `
      <div class=\"component-card\">
        <div class=\"component-head\">
          <h3>${component.name || 'Component'}</h3>
          <span class=\"meta\">${component.type || 'component'}</span>
        </div>
        ${renderComponentPreview(component)}
      </div>
    `
  }).join('')
  reply.type('text/html').send(`<!doctype html>
    <html lang=\"en\">
      <head>
        <meta charset=\"utf-8\" />
        <title>${orgRecord.name} - ${projectRecord.name}</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f7f0e6; padding: 32px; }
          .header { margin-bottom: 24px; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
          .component-card { background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #eadbc9; display: flex; flex-direction: column; gap: 12px; transition: all 0.2s; }
          .component-card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
          .component-head { display: flex; align-items: center; justify-content: space-between; }
          .component-head h3 { margin: 0; font-size: 16px; font-weight: 600; color: #111827; }
          .preview { display: flex; align-items: center; justify-content: center; padding: 20px; border-radius: 10px; background: #fbf8f2; min-height: 140px; overflow: hidden; }
          .preview svg { max-width: 100%; height: auto; }
          .preview.placeholder { color: #6c5f52; font-size: 14px; font-weight: 500; }
          .meta { color: #6c5f52; font-size: 12px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class=\"header\">
          <h1>${projectRecord.name}</h1>
          <div class=\"meta\">Org: ${orgRecord.name} · Versao: ${version?.version || 'sem versao'}</div>
        </div>
        <div class=\"grid\">${componentsHtml}</div>
      </body>
    </html>`)
})

fastify.get('/public/:org/:project/v/:version', async (req, reply) => {
  const { org, project, version } = req.params
  const orgRecord = db.prepare('SELECT * FROM organizations WHERE slug = ?').get(org)
  if (!orgRecord) return reply.code(404).send({ error: 'org_not_found' })

  const projectRecord = db.prepare('SELECT * FROM projects WHERE organization_id = ? AND slug = ?')
    .get(orgRecord.id, project)
  if (!projectRecord) return reply.code(404).send({ error: 'project_not_found' })

  const versionRecord = db.prepare('SELECT * FROM project_versions WHERE project_id = ? AND version = ?')
    .get(projectRecord.id, version)
  if (!versionRecord) return reply.code(404).send({ error: 'version_not_found' })

  const password = req.query.password || req.headers['x-project-password']
  if (!canAccessProject(projectRecord, password)) {
    return reply.code(403).send({ error: 'private_project' })
  }

  const artifactPath = resolveArtifactPath(versionRecord.artifact_url)
  let payload = null
  if (artifactPath && fs.existsSync(artifactPath)) {
    payload = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'))
  }

  reply.send({ organization: orgRecord, project: projectRecord, version: versionRecord, payload })
})

fastify.listen({ port: 5174, host: '0.0.0.0' })
