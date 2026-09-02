import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  initialTasks,
  addTask,
  toggleTask,
  removeTask,
  clearCompleted,
  filterTasks,
  stats,
} = require('../lib/tasks.js');

test('initial workspace includes one completed task', () => {
  const { total, completed, open, progress } = stats(initialTasks);
  assert.equal(total, 3);
  assert.equal(completed, 1);
  assert.equal(open, 2);
  assert.equal(progress, 33);
});

test('addTask ignores blank titles and prepends valid tasks', () => {
  const unchanged = addTask(initialTasks, { title: '   ' });
  assert.equal(unchanged, initialTasks);

  const next = addTask(initialTasks, { title: ' Wire the CI harness ', priority: 'high', now: 99 });
  assert.equal(next[0].id, 99);
  assert.equal(next[0].title, 'Wire the CI harness');
  assert.equal(next[0].priority, 'high');
  assert.equal(next[0].done, false);
  assert.equal(next.length, 4);
});

test('toggle, filter, remove, and clearCompleted keep list state consistent', () => {
  const afterToggle = toggleTask(initialTasks, 1);
  assert.equal(filterTasks(afterToggle, 'done').length, 2);
  assert.equal(filterTasks(afterToggle, 'open').length, 1);

  const afterRemove = removeTask(afterToggle, 2);
  assert.equal(afterRemove.length, 2);
  assert.equal(afterRemove.some((task) => task.id === 2), false);

  const remaining = clearCompleted(afterRemove);
  assert.equal(remaining.length, 0);
  assert.equal(stats(remaining).progress, 0);
});
