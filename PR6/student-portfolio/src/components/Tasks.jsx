import { useCallback, useEffect, useState } from 'react'
import taskApi from '../api.js'
import ErrorMessage from './ErrorMessage.jsx'
import Spinner from './Spinner.jsx'

const emptyForm = { title: '', description: '', completed: false, priority: 'medium' }

function TaskForm({ task, saving, onSave, onCancel }) {
  const [form, setForm] = useState(() => task ? {
    title: task.title,
    description: task.description || '',
    completed: task.completed,
    priority: task.priority || 'medium',
  } : emptyForm)

  function updateField(event) {
    const { name, value, checked, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-heading"><div><p className="eyebrow">{task ? 'UPDATE TASK' : 'NEW TASK'}</p><h3>{task ? 'Edit your task' : 'What needs doing?'}</h3></div>{task && <button className="task-icon-button" type="button" onClick={onCancel} aria-label="Cancel editing">×</button>}</div>
      <label className="task-field">Task title<input name="title" value={form.title} onChange={updateField} maxLength={120} placeholder="Give this task a clear name" required /></label>
      <label className="task-field">Description <span>OPTIONAL</span><textarea name="description" value={form.description} onChange={updateField} rows="3" maxLength={1000} placeholder="Add a few useful details" /></label>
      <div className="task-form-row"><label className="task-field">Priority<select name="priority" value={form.priority} onChange={updateField}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="task-checkbox"><input type="checkbox" name="completed" checked={form.completed} onChange={updateField} /><span>Mark as completed</span></label></div>
      <div className="task-form-actions"><button className="button button-primary task-submit" type="submit" disabled={saving}>{saving ? 'Saving…' : task ? 'Save changes' : 'Create task'} <span aria-hidden="true">→</span></button>{task && <button className="task-cancel" type="button" onClick={onCancel} disabled={saving}>Cancel</button>}</div>
    </form>
  )
}

function formatDate(date) {
  if (!date) return 'Just added'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
}

function TaskCard({ task, busy, selected, detail, onView, onRetry, onEdit, onDelete, onToggle }) {
  return (
    <article className={`task-card${task.completed ? ' is-complete' : ''}`}>
      <div className="task-card-top"><span className={`task-priority priority-${task.priority || 'medium'}`}><span />{task.priority || 'medium'} priority</span><span className="task-date">{formatDate(task.createdAt)}</span></div>
      <div className="task-card-title"><span className={`task-check-indicator${task.completed ? ' checked' : ''}`} aria-hidden="true">{task.completed ? '✓' : ''}</span><h3>{task.title}</h3></div>
      <p className="task-description">{task.description || 'No description added.'}</p>
      <div className="task-card-actions"><button className="task-action" type="button" onClick={onView}>{selected ? 'Hide details' : 'View details'}</button><button className="task-action" type="button" onClick={onEdit} disabled={busy}>Edit</button><button className="task-action task-delete" type="button" onClick={onDelete} disabled={busy}>{busy ? 'Working…' : 'Delete'}</button><button className="task-toggle" type="button" onClick={onToggle} disabled={busy}>{task.completed ? 'Mark active' : 'Mark done'} <span aria-hidden="true">{task.completed ? '↺' : '✓'}</span></button></div>
      {selected && <div className="task-detail">
        {detail.loading ? <Spinner label="Loading task details" /> : detail.error ? <ErrorMessage title="Task details unavailable" message={detail.error} onRetry={onRetry} /> : detail.task && <><p className="eyebrow">TASK DETAILS</p><p>{detail.task.description || 'No additional details for this task.'}</p><span>Created {formatDate(detail.task.createdAt)} · {detail.task.completed ? 'Completed' : 'In progress'}</span></>}
      </div>}
    </article>
  )
}

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [formTask, setFormTask] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [busyTaskId, setBusyTaskId] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [taskDetail, setTaskDetail] = useState({ loading: false, error: '', task: null })
  const [toast, setToast] = useState(null)

  const loadTasks = useCallback(async () => {
    try {
      setTasks(await taskApi.getTasks())
      setLoadError('')
    } catch (error) {
      setLoadError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    taskApi.getTasks().then((items) => {
      if (!cancelled) {
        setTasks(items)
        setLoadError("")
      }
    }).catch((error) => {
      if (!cancelled) setLoadError(error.message)
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  async function saveTask(values) {
    setSaving(true)
    try {
      if (formTask) {
        const updatedTask = await taskApi.updateTask(formTask._id, values)
        setTasks((current) => current.map((task) => task._id === updatedTask._id ? updatedTask : task))
        setToast({ type: 'success', message: 'Task updated successfully.' })
      } else {
        const newTask = await taskApi.createTask(values)
        setTasks((current) => [newTask, ...current])
        setToast({ type: 'success', message: 'Task created successfully.' })
      }
      setFormTask(null)
      setFormOpen(false)
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setSaving(false)
    }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return
    setBusyTaskId(task._id)
    try {
      await taskApi.deleteTask(task._id)
      setTasks((current) => current.filter((item) => item._id !== task._id))
      if (selectedTaskId === task._id) setSelectedTaskId('')
      setToast({ type: 'success', message: 'Task deleted successfully.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setBusyTaskId('')
    }
  }

  async function toggleTask(task) {
    setBusyTaskId(task._id)
    try {
      const updatedTask = await taskApi.updateTask(task._id, {
        title: task.title,
        description: task.description || '',
        completed: !task.completed,
        priority: task.priority || 'medium',
      })
      setTasks((current) => current.map((item) => item._id === updatedTask._id ? updatedTask : item))
      setToast({ type: 'success', message: updatedTask.completed ? 'Task marked complete.' : 'Task marked active.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message })
    } finally {
      setBusyTaskId('')
    }
  }

  async function viewTask(taskId, force = false) {
    if (selectedTaskId === taskId && !force) {
      setSelectedTaskId('')
      return
    }
    setSelectedTaskId(taskId)
    setTaskDetail({ loading: true, error: '', task: null })
    try {
      const task = await taskApi.getTask(taskId)
      setTaskDetail({ loading: false, error: '', task })
    } catch (error) {
      setTaskDetail({ loading: false, error: error.message, task: null })
    }
  }

  function editTask(task) {
    setFormTask(task)
    setFormOpen(true)
  }

  function startNewTask() {
    setFormTask(null)
    setFormOpen(true)
  }

  return (
    <main className="route-page">
      <section className="section-shell content-section task-manager-section" id="tasks">
        <div className="section-heading projects-heading task-manager-heading"><div><p className="eyebrow"><span className="heading-index">06</span> PRACTICAL 6 · FULL STACK</p><h2>Make space<br /><span>for what matters.</span></h2></div><div className="task-heading-aside"><p className="section-subtitle">A focused list, synced with MongoDB and ready whenever you are.</p><span className="task-api-status"><span /> CONNECTED TO TASK API</span></div></div>
        <div className="task-workspace">
          <div className="task-list-panel"><div className="task-list-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h3>Tasks <span>{tasks.length.toString().padStart(2, '0')}</span></h3></div><button className="button button-primary task-new-button" type="button" onClick={startNewTask}><span>＋</span> New task</button></div>
            {toast && <div className={`task-toast toast-${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}><span aria-hidden="true">{toast.type === 'success' ? '✓' : '!'}</span>{toast.message}<button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification">×</button></div>}
            {loading ? <Spinner label="Loading tasks" /> : loadError ? <ErrorMessage title="Tasks unavailable" message={loadError} onRetry={() => { setLoading(true); setLoadError(""); loadTasks() }} /> : tasks.length ? <div className="task-list">{tasks.map((task) => <TaskCard key={task._id} task={task} busy={busyTaskId === task._id} selected={selectedTaskId === task._id} detail={taskDetail} onView={() => viewTask(task._id)} onRetry={() => viewTask(task._id, true)} onEdit={() => editTask(task)} onDelete={() => deleteTask(task)} onToggle={() => toggleTask(task)} />)}</div> : <div className="task-empty"><span aria-hidden="true">✳</span><h3>A clear slate.</h3><p>Add your first task and give your next idea somewhere to land.</p><button type="button" className="task-action" onClick={startNewTask}>Create a task <span aria-hidden="true">↗</span></button></div>}
          </div>
          <aside className="task-editor-column">{formOpen ? <TaskForm key={formTask?._id || 'new-task'} task={formTask} saving={saving} onSave={saveTask} onCancel={() => { setFormOpen(false); setFormTask(null) }} /> : <div className="task-editor-prompt"><span className="editor-spark" aria-hidden="true">✳</span><p className="eyebrow">INTENTION, THEN ACTION</p><h3>One small step<br />can change your day.</h3><p>Select a task to view its details, edit what’s next, or start with a fresh one.</p><button type="button" className="task-outline-button" onClick={startNewTask}>Add a task <span aria-hidden="true">↗</span></button></div>}
          </aside>
        </div>
        <div className="task-footer-note"><span className="status-dot" /> Changes save automatically to MongoDB and stay here after refresh.</div>
      </section>
    </main>
  )
}

export default Tasks
