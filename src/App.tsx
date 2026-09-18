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
  return <header className="site-header"><a className="brand" href="#top">QDW<span>26</span></a><nav><a href="#qdw">Qué es QDW</a><a href="#radical">Diseño Radical</a><a href="#sede">Cuándo y dónde</a><a href="#programa">Programación</a><a href="#aliados">Aliados</a><a className="nav-cta" href="#novedades">Suscríbete</a><Link className="admin-link" to="/admin">Admin</Link></nav></header>
}

function HomePage({ content }: { content: ContentItem[] }) {
  const programs = content.filter((item) => item.type === 'program')
  const speakers = content.filter((item) => item.type === 'speaker')
  const workshops = content.filter((item) => item.type === 'workshop')
  return <>
    <SiteHeader />
    <main>
      <section className="hero" id="top"><img src="/assets/hero-qdw26.svg" alt="Quito Design Week 2026 · Diseño Radical" /><div className="hero-copy"><div><p className="eyebrow">19 — 25 octubre 2026 · Centro Cultural Itchimbía</p><p>Siete días, cinco distritos, 35 espacios abiertos y proyectos que discuten cómo se produce el diseño en Ecuador.</p></div><div className="hero-actions"><a className="button button-dark" href="#novedades">Suscríbete ↗</a><a className="button button-outline" href="#qdw">Conoce el festival ↓</a><a className="button button-outline" href="mailto:info@quitodesignweek.com?subject=Quiero auspiciar QDW 2026">Sé parte / Auspicia ↗</a></div></div></section>
      <section className="intro" id="qdw"><p className="eyebrow">Qué es Quito Design Week</p><h1>Una celebración del diseño en todas sus manifestaciones.</h1><div className="intro-columns"><p className="lead">Somos el punto de encuentro para diseñadores y no diseñadores, un espacio para repensar la ciudad, el diseño y el futuro colectiva y conscientemente.</p><p>En 2026 proyectamos futuro: conectamos talento, instituciones, marcas y ciudadanía a través de una semana de encuentros, exhibiciones, talleres y experiencias.</p></div><p className="eyebrow numbers-label">Nuestra primera edición en números</p><div className="numbers"><div><strong>100</strong><span>Espacios activados<br />en la ciudad</span></div><div><strong>+200</strong><span>Postulaciones de diseñadores,<br />estudiantes y espacios culturales</span></div><div><strong>+5000</strong><span>Asistentes<br />presenciales</span></div><div><strong>+37K</strong><span>Impresiones<br />digitales</span></div></div></section>
      <section className="radical-section" id="radical"><div className="radical-copy"><p className="eyebrow">El argumento editorial · 2026</p><h2>Diseño<br />Radical</h2><p>La edición 2026 de Quito Design Week convoca prácticas que entienden el diseño como un campo de experimentación crítica: procesos que investigan, especulan, ensayan y, en algunos casos, fallan.</p><p>Propuestas que desbordan la producción de objetos para operar sobre imaginarios, sistemas y formas de vida. Diseñar es tomar posición, abrir preguntas y construir futuros posibles desde Quito.</p><p className="credits"><strong>Curaduría:</strong> Giada Lusardi<br /><strong>Diseño expositivo:</strong> Andrea Pazmiño</p></div><div className="radical-images"><img src="/assets/img/itchimbia-02.webp" alt="Instalación y arquitectura del Itchimbía" /><img src="/assets/img/taller-3.webp" alt="Experiencia de diseño" /><img src="/assets/img/itchimbia-01.webp" alt="Centro Cultural Itchimbía" /></div></section>
      <section className="split-section" id="sede"><div><p className="eyebrow">Cuándo y dónde</p><h2>Centro Cultural<br />Itchimbía</h2><p>José María Aguirre, 170136<br />Quito, Ecuador</p><p className="venue-note">El epicentro del diseño: 1.400 m² dedicados a la creatividad, innovación y conexiones valiosas. Aquí suceden cuatro de los cinco núcleos del programa.</p><a className="button button-dark" href="https://maps.app.goo.gl/ZdbRkfhjNixvmwmG8" target="_blank" rel="noreferrer">Abrir en Google Maps ↗</a></div><div className="venue-gallery"><img src="/assets/img/itchimbia-01.webp" alt="Centro Cultural Itchimbía" /><img src="/assets/img/itchimbia-02.webp" alt="Arquitectura del Centro Cultural Itchimbía" /></div></section>
      <section className="program-section" id="programa"><p className="eyebrow">Programación · avance</p><h2>Una semana<br />de diseño</h2><p className="section-lead">Exhibiciones, charlas, talleres y rutas para activar la ciudad. Programación completa en septiembre.</p><div className="card-grid">{programs.map((item) => <article className="program-card" key={item.id}><span>↗</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div><div className="lineup"><div><p className="eyebrow">Line up QDW</p><h3>Speakers</h3></div><div className="lineup-list">{speakers.map((item) => <article key={item.id}>{item.image && <img src={item.image} alt="" />}<div><h4>{item.title}</h4><p>{item.description || 'Design Stage · 2026'}</p></div></article>)}</div></div><div className="lineup"><div><p className="eyebrow">Experiencias</p><h3>Talleres</h3></div><div className="lineup-list">{workshops.map((item) => <article key={item.id}>{item.image && <img src={item.image} alt="" />}<div><h4>{item.title}</h4><p>{item.description}</p></div></article>)}</div></div></section>
      <section className="district-section"><div><p className="eyebrow">Ruta de Diseño · 20 — 25 octubre</p><h2>Cinco distritos.<br />Una ciudad abierta.</h2><p className="section-lead">Estudios, tiendas, talleres, museos y galerías abren sus puertas con agenda propia. Recorridos guiados, lanzamientos, exhibiciones y experiencias participativas.</p><a className="button button-dark" href="#novedades">Recibir la agenda completa ↗</a></div><div className="districts">{['Valles', 'Creativo', 'Cultural', 'Financiero', 'Histórico'].map((name, index) => <div key={name}><strong>0{index + 1}</strong><span>Distrito {name}</span><small>{[6, 9, 6, 9, 5][index]} espacios</small></div>)}</div></section>
      <section className="allies-section" id="aliados"><div><p className="eyebrow">Aliados y patrocinadores</p><h2>Las marcas que<br />confían en el diseño</h2><p className="section-lead">Quito Design Week conecta a las marcas con una comunidad que imagina y construye el futuro.</p><a className="button button-dark" href="mailto:info@quitodesignweek.com?subject=Quiero ser aliado de QDW 2026">Sé parte de la segunda edición ↗</a></div><div className="logo-grid"><div><span>IFCI</span><span>PNUD</span><span>Secretaría<br />de Cultura</span></div><div><span>IED</span><span>UDLA</span><span>Itchimbía</span></div><div><span>Carlota</span><span>Caponata</span><span>Hedgehog<br />Brand</span></div><div><img src="/assets/logos/qreativground.svg" alt="Qreativground" /><img src="/assets/logos/produbanco.svg" alt="Produbanco" /><img src="/assets/logos/epb.svg" alt="EPB" /></div></div></section>
      <section className="newsletter" id="novedades"><p className="eyebrow">Mantente al tanto</p><h2>No te pierdas nada</h2><p>Quieres mantenerte al tanto con todas las noticias y actualizaciones de QDW.</p><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="tu@correo.com" aria-label="Correo electrónico" required /><button className="button button-dark">Suscribirme ↗</button></form><p className="form-note">Al suscribirte aceptas que Quito Design Week use tu correo para enviarte noticias. <a href="/privacidad.html">Lee el aviso de privacidad.</a></p><div className="social-links"><a href="https://www.instagram.com/quitodesignweek/" target="_blank" rel="noreferrer">@quitodesignweek ↗</a><a href="https://wa.me/593988741142" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></section>
    </main>
    <footer><div><strong>Quito Design Week 2026</strong><p>En 2024 conectamos talento.<br />En 2026 proyectamos futuro.</p></div><div><span>Prensa / auspicios / general</span><a href="mailto:info@quitodesignweek.com">info@quitodesignweek.com</a><a href="https://wa.me/593988741142">+593 98 874 1142</a></div><div><span>Diseño Radical · Quito, Ecuador</span><a href="/privacidad.html">Aviso de privacidad</a><span>© QDW · Qreativground</span></div></footer>
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
