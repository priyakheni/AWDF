import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownWideNarrow, CalendarDays, Check, CheckCheck, CircleCheck, Clock3, Command, LayoutDashboard, ListTodo, Menu, MoreHorizontal, Plus, Search, SlidersHorizontal, Trash2, X } from './components-icons.jsx'
import { taskService } from './services/taskService'
import './App.css'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard }, { label: 'My Tasks', icon: ListTodo },
  { label: 'Today', icon: CalendarDays }, { label: 'Upcoming', icon: Clock3 }, { label: 'Completed', icon: CheckCheck },
]
const statuses = ['Todo', 'In Progress', 'Completed']
const priorities = ['High', 'Medium', 'Low']
const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

function Sidebar({ page, onNavigate, onAdd, projects, mobileOpen, closeMobile }) {
  return <>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={closeMobile} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Check size={18} strokeWidth={3} /></div><span>taskflow</span><button className="mobile-close icon-button" onClick={closeMobile} aria-label="Close menu"><X size={19}/></button></div>
      <button className="add-task" onClick={onAdd}><Plus size={17}/><span>New task</span><kbd>⌘ K</kbd></button>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="primary-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => { onNavigate(label); closeMobile() }}><Icon size={18}/><span>{label}</span>{label === 'Today' && <span className="nav-count">{projects.todayCount}</span>}</button>)}</nav>
      <div className="project-heading"><span className="nav-caption">PROJECTS</span><button className="icon-button small" onClick={onAdd} aria-label="Add project task"><Plus size={16}/></button></div>
      <div className="project-list">{projects.names.map((name, i) => <button key={name} className="nav-item project-item" onClick={() => { onNavigate(name); closeMobile() }}><span className={`project-dot dot-${i % 4}`}/><span>{name}</span></button>)}</div>
      <div className="sidebar-bottom"><button className="profile-button"><div className="avatar">JD</div><span className="profile-copy"><strong>Priya</strong><small>Personal workspace</small></span><MoreHorizontal size={18}/></button></div>
    </aside>
  </>
}
function Header({ page, query, setQuery, onMenu }) {
  return <header className="topbar"><div className="topbar-left"><button className="icon-button menu-toggle" onClick={onMenu} aria-label="Open navigation"><Menu size={20}/></button><span className="crumb-muted">Workspace</span><span className="crumb-slash">/</span><strong>{page}</strong></div><div className="topbar-actions"><label className="search-box"><Search size={16}/><input aria-label="Search tasks" placeholder="Search anything..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></label></div></header>
}
function StatCard({ label, value, note, icon: Icon, tone }) { return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={18}/></div><span className="stat-note">{note}</span><div className="stat-value">{value}</div><div className="stat-label">{label}</div></article> }
function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(task || { title: '', description: '', priority: 'Medium', dueDate: '', status: 'Todo', project: 'Product launch' })
  const [error, setError] = useState('')
  useEffect(() => { const handler = e => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [onClose])
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const submit = e => { e.preventDefault(); if (!form.title.trim()) return setError('Please add a task title.'); if (form.dueDate && Number.isNaN(new Date(`${form.dueDate}T00:00:00`).getTime())) return setError('Enter a valid due date.'); onSave(form) }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><div className="modal-eyebrow">TASK DETAILS</div><h2 id="modal-title">{task ? 'Edit task' : 'Create a task'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19}/></button></div><form onSubmit={submit}><label className="field-label">Task name <span>*</span><input autoFocus value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Prepare launch brief" maxLength={120}/></label><label className="field-label">Description <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Add a few details..." rows="3"/></label><div className="form-grid"><label className="field-label">Priority<select value={form.priority} onChange={e => update('priority', e.target.value)}>{priorities.map(p => <option key={p}>{p}</option>)}</select></label><label className="field-label">Status<select value={form.status} onChange={e => update('status', e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label></div><div className="form-grid"><label className="field-label">Due date<input type="date" value={form.dueDate} onChange={e => update('dueDate', e.target.value)}/></label><label className="field-label">Project<input value={form.project} onChange={e => update('project', e.target.value)} placeholder="Project name"/></label></div>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-footer"><span><kbd>Esc</kbd> to close</span><div><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button-primary">{task ? 'Save changes' : 'Create task'}</button></div></div></form></section></div>
}
function TaskRow({ task, onToggle, onEdit, onDelete }) {
  return <article className={`task-row ${task.status === 'Completed' ? 'is-complete' : ''}`}><button className={`task-check ${task.status === 'Completed' ? 'checked' : ''}`} aria-label={task.status === 'Completed' ? `Mark ${task.title} incomplete` : `Complete ${task.title}`} onClick={onToggle}>{task.status === 'Completed' && <Check size={13}/>}</button><div className="task-main"><div className="task-title">{task.title}</div>{task.description && <div className="task-description">{task.description}</div>}<div className="task-mobile-meta"><span className={`priority priority-${task.priority.toLowerCase()}`}><i/>{task.priority}</span><span>{task.project}</span></div></div><span className={`priority priority-${task.priority.toLowerCase()} desktop-meta`}><i/>{task.priority}</span><span className="due-date desktop-meta"><CalendarDays size={14}/>{task.dueDate ? formatDate(task.dueDate) : 'No date'}</span><span className={`status-pill status-${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span><span className="project-name desktop-meta">{task.project}</span><div className="row-actions"><button className="icon-button small" onClick={onEdit} aria-label={`Edit ${task.title}`}><MoreHorizontal size={18}/></button><button className="icon-button small delete-action" onClick={onDelete} aria-label={`Delete ${task.title}`}><Trash2 size={16}/></button></div></article>
}
function App() {
  const [displayDate] = useState(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
  const [nextWeek] = useState(() => { const date = new Date(); date.setDate(date.getDate() + 7); return date.toISOString().slice(0, 10) })
  const [tasks, setTasks] = useState([]), [page, setPage] = useState('Dashboard'), [tab, setTab] = useState('All tasks')
  const [query, setQuery] = useState(''), [statusFilter, setStatusFilter] = useState('All statuses'), [priorityFilter, setPriorityFilter] = useState('All priorities'), [dateFilter, setDateFilter] = useState('Any date'), [sort, setSort] = useState('Creation date'), [modal, setModal] = useState(null), [toast, setToast] = useState(''), [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => { taskService.list().then(setTasks) }, [])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2800); return () => clearTimeout(timer) }, [toast])
  const persist = next => { setTasks(next); taskService.save(next) }
  const [today] = useState(() => new Date().toISOString().slice(0, 10))
  const stats = useMemo(() => ({ total: tasks.length, completed: tasks.filter(t => t.status === 'Completed').length, pending: tasks.filter(t => t.status !== 'Completed').length, overdue: tasks.filter(t => t.status !== 'Completed' && t.dueDate && t.dueDate < today).length }), [tasks, today])
  const projectNames = [...new Set(tasks.map(t => t.project).filter(Boolean))]
  const filtered = useMemo(() => {
    let list = tasks.filter(t => `${t.title} ${t.description || ''} ${t.project || ''}`.toLowerCase().includes(query.toLowerCase()))
    if (page === 'Today' || tab === 'Today') list = list.filter(t => t.dueDate === today && t.status !== 'Completed')
    else if (page === 'Upcoming' || tab === 'Upcoming') list = list.filter(t => t.dueDate > today && t.status !== 'Completed')
    else if (page === 'Completed' || tab === 'Completed') list = list.filter(t => t.status === 'Completed')
    if (page !== 'Dashboard' && page !== 'My Tasks' && !navItems.some(n => n.label === page)) list = list.filter(t => t.project === page)
    if (statusFilter !== 'All statuses') list = list.filter(t => t.status === statusFilter)
    if (priorityFilter !== 'All priorities') list = list.filter(t => t.priority === priorityFilter)
    if (dateFilter === 'Overdue') list = list.filter(t => t.dueDate && t.dueDate < today && t.status !== 'Completed')
    if (dateFilter === 'Today') list = list.filter(t => t.dueDate === today)
    if (dateFilter === 'Next 7 days') list = list.filter(t => t.dueDate >= today && t.dueDate <= nextWeek)
    const rank = { High: 0, Medium: 1, Low: 2 }
    list = [...list].sort((a, b) => sort === 'Due date' ? (a.dueDate || '9999').localeCompare(b.dueDate || '9999') : sort === 'Priority' ? rank[a.priority] - rank[b.priority] : b.createdAt.localeCompare(a.createdAt))
    return list
  }, [tasks, query, page, tab, today, nextWeek, statusFilter, priorityFilter, dateFilter, sort])
  const saveTask = data => { const edit = modal?.id; const next = edit ? tasks.map(t => t.id === edit ? { ...t, ...data } : t) : [{ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...tasks]; persist(next); setModal(null); setToast(edit ? 'Task updated successfully' : 'Task created successfully') }
  const toggle = task => { persist(tasks.map(t => t.id === task.id ? { ...t, status: t.status === 'Completed' ? 'Todo' : 'Completed' } : t)); setToast(task.status === 'Completed' ? 'Task reopened' : 'Task completed') }
  const remove = task => { if (window.confirm(`Delete “${task.title}”? This action cannot be undone.`)) { persist(tasks.filter(t => t.id !== task.id)); setToast('Task deleted') } }
  const openEdit = task => setModal(task)
  const addTask = () => setModal({})
  const tabs = ['All tasks', 'Today', 'Upcoming', 'Completed']
  const title = page === 'Dashboard' ? 'Dashboard' : page
  return <div className="app-shell"><Sidebar page={page} onNavigate={p => { setPage(p); setTab('All tasks') }} onAdd={addTask} projects={{ names: projectNames, todayCount: tasks.filter(t => t.dueDate === today && t.status !== 'Completed').length }} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)}/><main className="main-area"><Header page={title} query={query} setQuery={setQuery} onMenu={() => setMobileOpen(true)}/><div className="content"><section className="welcome-row"><div><div className="date-kicker"><span className="live-dot"/> {displayDate}</div><h1>{page === 'Dashboard' ? <>Good morning, Priya</> : title}</h1><p>{page === 'Dashboard' ? 'Here’s what’s happening with your work today.' : 'Keep your focus on what matters most.'}</p></div><button className="button-primary welcome-add" onClick={addTask}><Plus size={17}/> Add task</button></section>
      {page === 'Dashboard' && <><section className="stats-grid"><StatCard label="Total tasks" value={stats.total} note="All your work" icon={ListTodo} tone="purple"/><StatCard label="Completed" value={stats.completed} note={`${stats.total ? Math.round(stats.completed / stats.total * 100) : 0}% of total`} icon={CircleCheck} tone="green"/><StatCard label="Pending" value={stats.pending} note="In your queue" icon={Activity} tone="blue"/><StatCard label="Overdue" value={stats.overdue} note={stats.overdue ? 'Needs attention' : 'You’re all caught up'} icon={Clock3} tone="orange"/></section><div className="section-heading"><div><h2>Your tasks</h2><p>A little progress each day adds up.</p></div><button className="text-button" onClick={() => setPage('My Tasks')}>View all tasks <span>→</span></button></div></>}
      <section className="task-panel"><div className="panel-top"><div className="task-tabs" role="tablist" aria-label="Task views">{tabs.map(t => <button role="tab" aria-selected={tab === t} key={t} onClick={() => { setPage('My Tasks'); setTab(t) }} className={tab === t ? 'selected' : ''}>{t}{t === 'All tasks' && <span className="tab-count">{tasks.length}</span>}</button>)}</div><div className="panel-tools"><label className="inline-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tasks" aria-label="Search tasks list"/></label><button className="sort-button"><ArrowDownWideNarrow size={15}/><select aria-label="Sort tasks" value={sort} onChange={e => setSort(e.target.value)}><option>Creation date</option><option>Due date</option><option>Priority</option></select></button></div></div>
        <div className="filters"><SlidersHorizontal size={15}/><span className="filter-label">Filter by</span><select aria-label="Filter by status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All statuses</option>{statuses.map(s => <option key={s}>{s}</option>)}</select><select aria-label="Filter by priority" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}><option>All priorities</option>{priorities.map(s => <option key={s}>{s}</option>)}</select><select aria-label="Filter by due date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}><option>Any date</option><option>Overdue</option><option>Today</option><option>Next 7 days</option></select><button className="reset-filters" onClick={() => { setStatusFilter('All statuses'); setPriorityFilter('All priorities'); setDateFilter('Any date') }}>Reset</button><span className="result-count">{filtered.length} tasks</span></div>
        <div className="task-table-head"><span>TASK</span><span>PRIORITY</span><span>DUE DATE</span><span>STATUS</span><span>PROJECT</span><span/></div><div className="task-list">{filtered.length ? filtered.map(task => <TaskRow key={task.id} task={task} onToggle={() => toggle(task)} onEdit={() => openEdit(task)} onDelete={() => remove(task)}/>) : <div className="empty-state"><div className="empty-icon"><Command size={22}/></div><h3>{tasks.length ? 'No tasks found' : 'Your workspace is clear'}</h3><p>{tasks.length ? 'Try adjusting your search or filters.' : 'Add a task and start turning plans into progress.'}</p><button className="button-primary" onClick={addTask}><Plus size={16}/> Create your first task</button></div>}</div><div className="panel-footer"><span>Showing <strong>{filtered.length}</strong> of <strong>{tasks.length}</strong> tasks</span><span>Changes save automatically <span className="saved-check"><Check size={12}/></span></span></div></section>
      </div></main>{modal && <TaskModal task={modal.id ? modal : null} onClose={() => setModal(null)} onSave={saveTask}/ >}{toast && <div className="toast" role="status"><span><Check size={14}/></span>{toast}</div>}</div>
}
export default App
