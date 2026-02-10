import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5174'
const DEMO_EMAIL = 'demo@gauge.local'

type Organization = {
  id: string
  name: string
  slug: string
}

type Project = {
  id: string
  name: string
  slug: string
  visibility: 'public' | 'private'
  default_version?: string | null
  has_password?: number
}

type Version = {
  id: string
  version: string
  status: string
  artifact_url?: string | null
  created_at: string
}

async function api<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
      ...(options.headers || {})
    }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'request_failed')
  }
  return res.json()
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function Dashboard({
  orgs,
  projects,
  activeOrgId,
  onSelectOrg,
  onCreateProject
}: {
  orgs: Organization[]
  projects: Project[]
  activeOrgId: string
  onSelectOrg: (orgId: string) => void
  onCreateProject: (name: string) => void
}) {
  const [name, setName] = useState('')

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Workspace</h2>
          <p className="muted">Gerencie os Design Systems por organizacao.</p>
        </div>
        <div className="select-wrap">
          <label>Organizacao</label>
          <select value={activeOrgId} onChange={(event) => onSelectOrg(event.target.value)}>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel-body">
        <div className="create-bar">
          <input
            value={name}
            placeholder="Nome do Design System"
            onChange={(event) => setName(event.target.value)}
          />
          <button
            onClick={() => {
              if (!name.trim()) return
              onCreateProject(name.trim())
              setName('')
            }}
          >
            Criar DS
          </button>
        </div>

        <div className="grid">
          {projects.map((project) => (
            <article key={project.id} className="card">
              <div>
                <h3>{project.name}</h3>
                <p className="muted">/{project.slug}</p>
              </div>
              <div className="card-meta">
                <span className={`badge ${project.visibility}`}>{project.visibility}</span>
                <span className="muted">Default: {project.default_version || 'sem versao'}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function VersionsPanel({
  project,
  versions,
  onDeploy,
  onSetDefault,
  publicBaseUrl
}: {
  project: Project | null
  versions: Version[]
  onDeploy: (version: string) => void
  onSetDefault: (versionId: string) => void
  publicBaseUrl: string
}) {
  const [version, setVersion] = useState('v1.0.0')

  if (!project) {
    return (
      <section className="panel">
        <div className="panel-header">
          <h2>Deploys</h2>
        </div>
        <p className="muted">Selecione um projeto para ver versoes.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Deploys</h2>
          <p className="muted">{project.name}</p>
        </div>
        <div className="create-bar">
          <input value={version} onChange={(event) => setVersion(event.target.value)} />
          <button onClick={() => onDeploy(version)}>Criar versao</button>
        </div>
      </div>

      <div className="panel-body">
        <div className="list">
          {versions.map((item) => (
            <div key={item.id} className="list-row">
              <div>
                <strong>{item.version}</strong>
                <div className="muted">{formatDate(item.created_at)}</div>
              </div>
              <div className="list-meta">
                <span className={`badge ${item.status}`}>{item.status}</span>
                <button onClick={() => onSetDefault(item.id)}>Definir default</button>
                <a className="link" href={`${publicBaseUrl}/v/${item.version}`} target="_blank" rel="noreferrer">
                  Abrir
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AccessPanel({
  project,
  onSetPassword,
  onToggleVisibility
}: {
  project: Project | null
  onSetPassword: (password: string) => void
  onToggleVisibility: (visibility: 'public' | 'private') => void
}) {
  const [password, setPassword] = useState('')

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Acessos</h2>
      </div>
      {project ? (
        <div className="panel-body">
          <p className="muted">Configure convites, senha e whitelist para {project.name}.</p>
          <div className="access-grid">
            <div className="card">
              <h3>Convites</h3>
              <p className="muted">Envie convites por e-mail.</p>
              <button disabled>Adicionar convite</button>
            </div>
            <div className="card">
              <h3>Senha</h3>
              <p className="muted">Habilite senha unica por projeto.</p>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Senha simples"
                type="password"
              />
              <button
                onClick={() => {
                  if (password.trim().length < 4) return
                  onSetPassword(password.trim())
                  setPassword('')
                }}
              >
                Salvar senha
              </button>
              <div className="muted">
                {project.has_password ? 'Senha ativa' : 'Sem senha'}
              </div>
            </div>
            <div className="card">
              <h3>Whitelist</h3>
              <p className="muted">Restrinja por dominio.</p>
              <button disabled>Adicionar dominio</button>
            </div>
            <div className="card">
              <h3>Visibilidade</h3>
              <p className="muted">Defina publico ou privado.</p>
              <button onClick={() => onToggleVisibility(project.visibility === 'public' ? 'private' : 'public')}>
                Tornar {project.visibility === 'public' ? 'privado' : 'publico'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="muted">Selecione um projeto.</p>
      )}
    </section>
  )
}

export default function App() {
  const [token, setToken] = useState('')
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activeOrgId, setActiveOrgId] = useState('')
  const [activeProjectId, setActiveProjectId] = useState('')
  const [versions, setVersions] = useState<Version[]>([])

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) || null,
    [projects, activeProjectId]
  )

  const activeOrg = useMemo(
    () => orgs.find((org) => org.id === activeOrgId) || null,
    [orgs, activeOrgId]
  )

  useEffect(() => {
    async function boot() {
      const data = await api<{ token: string; default_org: Organization }>(
        '/auth/token',
        '',
        {
          method: 'POST',
          body: JSON.stringify({ email: DEMO_EMAIL, name: 'Demo User' })
        }
      )
      setToken(data.token)
      setActiveOrgId(data.default_org.id)
    }
    boot()
  }, [])

  useEffect(() => {
    if (!token) return
    api<{ organizations: Organization[] }>('/organizations', token)
      .then((data) => setOrgs(data.organizations))
      .catch(console.error)
  }, [token])

  useEffect(() => {
    if (!token || !activeOrgId) return
    api<{ projects: Project[] }>(`/projects?org_id=${activeOrgId}`, token)
      .then((data) => {
        setProjects(data.projects)
        if (data.projects.length && !activeProjectId) {
          setActiveProjectId(data.projects[0].id)
        }
      })
      .catch(console.error)
  }, [token, activeOrgId])

  useEffect(() => {
    if (!token || !activeProjectId) return
    api<{ versions: Version[] }>(`/projects/${activeProjectId}/versions`, token)
      .then((data) => setVersions(data.versions))
      .catch(console.error)
  }, [token, activeProjectId])

  async function handleCreateProject(name: string) {
    if (!token || !activeOrgId) return
    await api('/projects', token, {
      method: 'POST',
      body: JSON.stringify({ organization_id: activeOrgId, name, visibility: 'private' })
    })
    const data = await api<{ projects: Project[] }>(`/projects?org_id=${activeOrgId}`, token)
    setProjects(data.projects)
  }

  async function handleDeploy(version: string) {
    if (!token || !activeProjectId) return
    await api(`/projects/${activeProjectId}/deploy`, token, {
      method: 'POST',
      body: JSON.stringify({
        version,
        set_default: true,
        payload: {
          components: [
            {
              name: 'Button Primary',
              type: 'component',
              html: '<button class="btn-primary">Primary</button>',
              css: '.btn-primary { background: #111827; color: #fff; padding: 10px 18px; border-radius: 999px; border: none; font-weight: 600; }'
            },
            {
              name: 'Card',
              type: 'component',
              html: '<div class="card-preview"><h4>Card Title</h4><p>Supporting text</p></div>',
              css: '.card-preview { padding: 16px; border-radius: 12px; border: 1px solid #eadbc9; background: #fff; } .card-preview h4 { margin: 0 0 6px; }'
            }
          ],
          tokens: { primary: '#111827' },
          metadata: { note: 'Demo payload com html/css' }
        }
      })
    })
    const data = await api<{ versions: Version[] }>(`/projects/${activeProjectId}/versions`, token)
    setVersions(data.versions)
  }

  async function handleSetDefault(versionId: string) {
    if (!token || !activeProjectId) return
    await api(`/projects/${activeProjectId}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ default_version_id: versionId })
    })
    const data = await api<{ projects: Project[] }>(`/projects?org_id=${activeOrgId}`, token)
    setProjects(data.projects)
  }

  async function handleSetPassword(password: string) {
    if (!token || !activeProjectId) return
    await api(`/projects/${activeProjectId}/password`, token, {
      method: 'PUT',
      body: JSON.stringify({ password })
    })
    const data = await api<{ projects: Project[] }>(`/projects?org_id=${activeOrgId}`, token)
    setProjects(data.projects)
  }

  async function handleToggleVisibility(visibility: 'public' | 'private') {
    if (!token || !activeProjectId) return
    await api(`/projects/${activeProjectId}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ visibility })
    })
    const data = await api<{ projects: Project[] }>(`/projects?org_id=${activeOrgId}`, token)
    setProjects(data.projects)
  }

  return (
    <div className="workspace">
      <header className="topbar">
        <div>
          <h1>Gauge Workspace</h1>
          <p className="muted">Workspace multi-tenant para Design Systems.</p>
        </div>
        <div className="topbar-actions">
          <span className="badge private">Local Dev</span>
        </div>
      </header>

      <main className="main">
        <Dashboard
          orgs={orgs}
          projects={projects}
          activeOrgId={activeOrgId}
          onSelectOrg={(orgId) => {
            setActiveOrgId(orgId)
            setActiveProjectId('')
          }}
          onCreateProject={handleCreateProject}
        />

        <section className="columns">
          <div>
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>Projetos</h2>
                  {activeOrg && (
                    <p className="muted">URL base: {`${API_URL}/public/${activeOrg.slug}`}</p>
                  )}
                </div>
              </div>
              <div className="panel-body">
                <div className="list">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      className={`list-row selectable ${activeProjectId === project.id ? 'active' : ''}`}
                      onClick={() => setActiveProjectId(project.id)}
                    >
                      <div>
                        <strong>{project.name}</strong>
                        <div className="muted">/{project.slug}</div>
                        <div className="muted">ID: {project.id}</div>
                      </div>
                      <div className="list-meta">
                        <span className={`badge ${project.visibility}`}>{project.visibility}</span>
                        {activeOrg && (
                          <a
                            className="link"
                            href={`${API_URL}/public/${activeOrg.slug}/${project.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Abrir
                          </a>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <VersionsPanel
              project={activeProject}
              versions={versions}
              onDeploy={handleDeploy}
              onSetDefault={handleSetDefault}
              publicBaseUrl={
                activeOrg && activeProject
                  ? `${API_URL}/public/${activeOrg.slug}/${activeProject.slug}`
                  : ''
              }
            />
            <AccessPanel
              project={activeProject}
              onSetPassword={handleSetPassword}
              onToggleVisibility={handleToggleVisibility}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
