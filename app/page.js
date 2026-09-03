'use client';

import { useEffect, useMemo, useState } from 'react';
import { addTask as createTask, clearCompleted as dropCompleted, filterTasks, initialTasks, removeTask, stats as taskStats, toggleTask } from '../lib/tasks';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('pulse-tasks');
    setTasks(saved ? JSON.parse(saved) : initialTasks);
    setDark(localStorage.getItem('pulse-theme') !== 'light');
  }, []);

  useEffect(() => { if (tasks.length) localStorage.setItem('pulse-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('pulse-theme', dark ? 'dark' : 'light'); }, [dark]);

  const { completed, progress } = taskStats(tasks);
  const visible = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);

  function addTask(e) {
    e?.preventDefault();
    const title = input.trim();
    if (!title) return;
    setTasks(prev => createTask(prev, { title, priority }));
    setInput('');
    setPriority('medium');
  }
  function toggle(id) { setTasks(prev => toggleTask(prev, id)); }
  function remove(id) { setTasks(prev => removeTask(prev, id)); }
  function clearCompleted() { setTasks(prev => dropCompleted(prev)); }

  return <main className={dark ? 'shell dark' : 'shell light'}>
    <section className="app-card">
      <header className="topbar">
        <div><div className="eyebrow">PULSE WORKSPACE</div><h1>Next-gen <span>Todo</span></h1><p>Turn intent into momentum.</p></div>
        <button className="theme" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? '☼' : '☾'}</button>
      </header>

      <div className="dashboard">
        <div className="ring" style={{ '--progress': `${progress * 3.6}deg` }}><strong>{progress}%</strong><small>complete</small></div>
        <div className="stats"><span><b>{tasks.length}</b> Total</span><span><b>{tasks.length - completed}</b> Open</span><span><b>{completed}</b> Done</span></div>
      </div>

      <form className="composer" onSubmit={addTask}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="What needs to happen next?" aria-label="New task" />
        <select value={priority} onChange={e => setPriority(e.target.value)} aria-label="Priority"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
        <button className="add" type="submit">Add task</button>
      </form>

      <div className="toolbar"><div className="filters">{['all','open','done'].map(f => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</button>)}</div><button className="clear" onClick={clearCompleted}>Clear completed</button></div>

      <div className="list">{visible.length === 0 ? <div className="empty">Nothing here yet. Add a task and make it real.</div> : visible.map(task => <article className={`task ${task.done ? 'done' : ''}`} key={task.id}>
        <button className="check" onClick={() => toggle(task.id)} aria-label={task.done ? 'Mark open' : 'Mark done'}>{task.done ? '✓' : ''}</button>
        <div className="task-copy"><strong>{task.title}</strong><span className={`priority ${task.priority}`}>{task.priority}</span></div>
        <button className="delete" onClick={() => remove(task.id)} aria-label="Delete task">×</button>
      </article>)}</div>

      <footer><span>⌘ K to focus</span><span>Local-first · Fast · Private</span><span>Powered by Brainspack LLP</span></footer>
    </section>
  </main>;
}
