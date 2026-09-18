import React, { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { supabase } from './lib/supabase'
import type { ReactNode } from 'react'

type ContentItem = {
  id: string
  type: 'program' | 'speaker' | 'workshop'
  title: string
  description: string
  image?: string
}

const initialContent: ContentItem[] = [
  { id: 'design-stage', type: 'program', title: 'Design Stage', description: 'Conversaciones sobre el diseño que transforma nuestro futuro.' },
  { id: 'routes', type: 'program', title: 'Rutas de Diseño', description: '35 espacios abiertos en cinco distritos de Quito.' },
  { id: 'market', type: 'program', title: 'Mercado de Diseño', description: 'Ideas, objetos y proyectos para descubrir.' },
  { id: 'speaker-1', type: 'speaker', title: 'El diseño gráfico en Ecuador', description: 'Una conversación sobre identidad y comunidad.', image: '/assets/img/speaker-1.webp' },
  { id: 'workshop-1', type: 'workshop', title: 'Construcción lógica del mensaje visual', description: 'Taller práctico para convertir ideas en imágenes.', image: '/assets/img/taller-1.webp' },
]

function SiteHeader() {
  return <header className="site-header"><a className="brand" href="/">QDW<span>26</span></a><nav><a href="#programa">Programa</a><a href="#sede">Sede</a><a href="#novedades">Novedades</a><Link className="admin-link" to="/admin">Admin</Link></nav></header>
}

function HomePage({ content }: { content: ContentItem[] }) {
  const programs = content.filter((item) => item.type === 'program')
  const speakers = content.filter((item) => item.type === 'speaker')
  const workshops = content.filter((item) => item.type === 'workshop')
  return <>
    <SiteHeader />
    <main>
      <section className="hero"><img src="/assets/hero-qdw26.svg" alt="Quito Design Week 2026 · Diseño Radical" /><div className="hero-copy"><p>Siete días, cinco distritos, 35 espacios abiertos y proyectos que discuten cómo se produce el diseño en Ecuador.</p><a className="button button-dark" href="#programa">Explorar el programa ↘</a></div></section>
      <section className="intro"><p className="eyebrow">Quito Design Week · Segunda edición</p><h1>Una celebración del diseño en todas sus manifestaciones.</h1><p className="lead">Del 19 al 25 de octubre de 2026, Quito se convierte en un laboratorio de ideas. Diseño radical para nuevos imaginarios de futuro.</p></section>
      <section className="split-section" id="sede"><div><p className="eyebrow">La sede</p><h2>Centro Cultural<br />Itchimbía</h2><p>José María Aguirre y Concepción · Quito, Ecuador</p></div><img src="/assets/img/itchimbia-01.webp" alt="Centro Cultural Itchimbía" /></section>
      <section className="program-section" id="programa"><p className="eyebrow">19 — 25 octubre 2026</p><h2>Una semana<br />de diseño</h2><div className="card-grid">{programs.map((item) => <article className="program-card" key={item.id}><span>↗</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
      <section className="dark-section"><p className="eyebrow">Design Stage</p><h2>Ideas para<br />moverlo todo.</h2><div className="feature-grid">{[...speakers, ...workshops].map((item) => <article className="feature-card" key={item.id}>{item.image && <img src={item.image} alt="" />}<div><p className="eyebrow">{item.type === 'speaker' ? 'Conversación' : 'Taller'}</p><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></section>
      <section className="newsletter" id="novedades"><p className="eyebrow">Mantente cerca</p><h2>No te pierdas nada</h2><p>Noticias, fechas y actualizaciones de Quito Design Week.</p><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="tu@correo.com" aria-label="Correo electrónico" required /><button className="button button-dark">Suscribirme ↗</button></form></section>
    </main>
    <footer><strong>Quito Design Week 2026</strong><span>Diseño Radical · Quito, Ecuador</span><a href="mailto:info@quitodesignweek.com">info@quitodesignweek.com</a></footer>
  </>
}

function AdminPage({ content, setContent }: { content: ContentItem[]; setContent: (items: ContentItem[]) => void }) {
  const [session, setSession] = useState<Awaited<ReturnType<NonNullable<typeof supabase>['auth']['getSession']>>['data']['session']>(null)
  const [authLoading, setAuthLoading] = useState(Boolean(supabase))
  const [authError, setAuthError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<ContentItem | null>(null)
  const [filter, setFilter] = useState<ContentItem['type'] | 'all'>('all')
  const visible = useMemo(() => filter === 'all' ? content : content.filter((item) => item.type === filter), [content, filter])
  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])
  const signIn = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setAuthError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setAuthError(error.message); return }
    setSession(data.session)
  }
  const signOut = () => { if (supabase) void supabase.auth.signOut() }
  if (authLoading) return <div className="admin-shell"><p className="admin-loading">Cargando sesión…</p></div>
  if (supabase && !session) return <div className="admin-shell"><form className="login-card" onSubmit={signIn}><p className="eyebrow">QDW26 · Content Studio</p><h1>Acceso admin</h1><label>Correo<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{authError && <p className="auth-error">{authError}</p>}<button className="button button-dark">Entrar</button><Link to="/">Volver al sitio</Link></form></div>
  const save = async (item: ContentItem) => {
    setSaving(true)
    const record = { type: item.type, title: item.title, description: item.description, image_path: item.image ?? null, sort_order: content.find((current) => current.id === item.id)?.id ? content.findIndex((current) => current.id === item.id) + 1 : content.length + 1 }
    if (supabase) {
      const result = item.id ? await supabase.from('content_items').update(record).eq('id', item.id) : await supabase.from('content_items').insert(record)
      if (result.error) { setAuthError(result.error.message); setSaving(false); return }
    }
    const next = content.some((current) => current.id === item.id) ? content.map((current) => current.id === item.id ? item : current) : [...content, { ...item, id: crypto.randomUUID() }]
    setContent(next); setEditing(null); setSaving(false)
  }
  const remove = async (id: string) => {
    if (supabase) { const { error } = await supabase.from('content_items').delete().eq('id', id); if (error) { setAuthError(error.message); return } }
    setContent(content.filter((item) => item.id !== id))
  }
  return <div className="admin-shell"><header className="admin-header"><div><p className="eyebrow">QDW26 · Content Studio</p><h1>Admin panel</h1></div><div className="admin-nav"><Link to="/">Ver sitio ↗</Link>{supabase && <button onClick={signOut}>Cerrar sesión</button>}</div></header><main className="admin-main"><div className="toolbar"><div className="filters">{(['all', 'program', 'speaker', 'workshop'] as const).map((value) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} key={value}>{value === 'all' ? 'Todo' : value}</button>)}</div><button className="button button-dark" onClick={() => setEditing({ id: '', type: 'program', title: '', description: '' })}>+ Nuevo contenido</button></div>{authError && <p className="auth-error">{authError}</p>}<div className="admin-table">{visible.map((item) => <article key={item.id}><div><span className="tag">{item.type}</span><h2>{item.title || 'Sin título'}</h2><p>{item.description}</p></div><div className="row-actions"><button onClick={() => setEditing(item)}>Editar</button><button className="danger" onClick={() => remove(item.id)}>Eliminar</button></div></article>)}</div></main>{editing && <ContentEditor item={editing} saving={saving} onSave={save} onClose={() => setEditing(null)} />}</div>
}

function ContentEditor({ item, saving, onSave, onClose }: { item: ContentItem; saving: boolean; onSave: (item: ContentItem) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(item)
  return <div className="modal-backdrop"><form className="editor" onSubmit={(event) => { event.preventDefault(); onSave(draft) }}><div className="editor-head"><h2>{item.id ? 'Editar contenido' : 'Nuevo contenido'}</h2><button type="button" onClick={onClose}>×</button></div><label>Tipo<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as ContentItem['type'] })}><option value="program">Programa</option><option value="speaker">Speaker</option><option value="workshop">Taller</option></select></label><label>Título<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label><label>Descripción<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} rows={5} required /></label><label>Imagen URL<input value={draft.image ?? ''} onChange={(event) => setDraft({ ...draft, image: event.target.value })} placeholder="/assets/img/..." /></label><button className="button button-dark" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button></form></div>
}

export default function App() {
  const [content, setContent] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('qdw-content')
    if (!saved) return initialContent
    try {
      const parsed: unknown = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed as ContentItem[] : initialContent
    } catch {
      localStorage.removeItem('qdw-content')
      return initialContent
    }
  })
  useEffect(() => {
    if (!supabase) return
    supabase.from('content_items').select('id,type,title,description,image_path').eq('published', true).order('sort_order').then(({ data, error }) => {
      if (error) { console.warn('Supabase content is unavailable; using local content.', error.message); return }
      if (data?.length) setContent(data.map((item) => ({ id: item.id, type: item.type, title: item.title, description: item.description, image: item.image_path ?? undefined })))
    })
  }, [])
  const updateContent = (items: ContentItem[]) => {
    setContent(items)
    localStorage.setItem('qdw-content', JSON.stringify(items))
  }
  return <ErrorBoundary><Routes><Route path="/admin" element={<AdminPage content={content} setContent={updateContent} />} /><Route path="*" element={<HomePage content={content} />} /></Routes></ErrorBoundary>
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) return <main className="error-page"><h1>No se pudo cargar el sitio</h1><p>Actualiza la página. Si el problema continúa, reinicia el servidor con <code>npm run dev</code>.</p><button className="button button-dark" onClick={() => window.location.reload()}>Recargar</button></main>
    return this.props.children
  }
}
