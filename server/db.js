import Database from 'better-sqlite3'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const dataDir = path.resolve('server/data')
const dbPath = path.join(dataDir, 'dev.db')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS organization_members (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(organization_id, user_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'private',
  default_version_id TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(organization_id, slug),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS project_versions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL,
  artifact_url TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS project_access (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
`) 

export function nowIso() {
  return new Date().toISOString()
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function getUserByToken(token) {
  if (!token) return null
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
  return stmt.get(token) || null
}

export function ensureDefaultOrgForUser(user) {
  const slug = slugify(user.name || user.email.split('@')[0]) || `user-${user.id.slice(0, 6)}`
  const existing = db.prepare('SELECT * FROM organizations WHERE slug = ?').get(slug)
  if (existing) {
    const member = db
      .prepare('SELECT * FROM organization_members WHERE organization_id = ? AND user_id = ?')
      .get(existing.id, user.id)
    if (!member) {
      db.prepare('INSERT INTO organization_members (id, organization_id, user_id, role, created_at) VALUES (?, ?, ?, ?, ?)')
        .run(crypto.randomUUID(), existing.id, user.id, 'owner', nowIso())
    }
    return existing
  }

  const org = {
    id: crypto.randomUUID(),
    name: user.name || user.email,
    slug,
    created_at: nowIso()
  }

  db.prepare('INSERT INTO organizations (id, name, slug, created_at) VALUES (?, ?, ?, ?)')
    .run(org.id, org.name, org.slug, org.created_at)

  db.prepare('INSERT INTO organization_members (id, organization_id, user_id, role, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), org.id, user.id, 'owner', nowIso())

  return org
}
