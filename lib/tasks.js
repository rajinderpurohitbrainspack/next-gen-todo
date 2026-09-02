const initialTasks = [
  { id: 1, title: 'Ship the first Next.js version', priority: 'high', done: false },
  { id: 2, title: 'Connect GitHub CI', priority: 'medium', done: false },
  { id: 3, title: 'Define the automated SDLC', priority: 'low', done: true },
];

function addTask(tasks, { title, priority = 'medium', now = Date.now() }) {
  const trimmed = String(title ?? '').trim();
  if (!trimmed) return tasks;
  return [{ id: now, title: trimmed, priority, done: false }, ...tasks];
}

function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

function clearCompleted(tasks) {
  return tasks.filter((task) => !task.done);
}

function filterTasks(tasks, filter) {
  if (filter === 'open') return tasks.filter((task) => !task.done);
  if (filter === 'done') return tasks.filter((task) => task.done);
  return tasks;
}

function stats(tasks) {
  const completed = tasks.filter((task) => task.done).length;
  const total = tasks.length;
  return {
    total,
    completed,
    open: total - completed,
    progress: total ? Math.round((completed / total) * 100) : 0,
  };
}

module.exports = {
  initialTasks,
  addTask,
  toggleTask,
  removeTask,
  clearCompleted,
  filterTasks,
  stats,
};
