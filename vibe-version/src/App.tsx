import React, { useState, useEffect } from 'react';
import { Check, Plus, CheckCircle2, CheckCheck, Clock } from 'lucide-react';
import { Task, TaskFilter } from './types';

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize quarterly growth projection report',
    completed: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-2',
    title: 'Design system review with editorial team',
    completed: false,
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'task-3',
    title: 'Coordinate with photography lead for winter feature',
    completed: false,
    createdAt: Date.now() - 600000,
  },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('personal_task_manager_tasks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_TASKS;
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>('all');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Live date and time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('personal_task_manager_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleCompleteAll = () => {
    setTasks((prev) => prev.map((task) => ({ ...task, completed: true })));
  };

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(currentTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(currentTime);

  return (
    <div
      id="app-container"
      className="min-h-screen bg-[#0a0a0a] text-[#e2e2e2] flex flex-col items-center py-10 px-4 sm:px-8 selection:bg-[#c9a063] selection:text-[#0a0a0a]"
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-5rem)]">
        {/* Header with Live Date & Time */}
        <header
          id="app-header"
          className="mb-8 pb-6 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-baseline gap-4"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif italic font-light tracking-tight text-white">
              Daily Agenda
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40 mt-1.5 font-medium">
              Personal Task Manager
            </p>
          </div>
          <div className="text-left sm:text-right flex flex-col sm:items-end">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a063] animate-pulse"></span>
              <span>Live Clock</span>
            </div>
            <p className="text-sm sm:text-base font-serif italic text-white/90">
              {formattedDate}
            </p>
            <p className="text-lg sm:text-xl font-mono font-medium text-[#c9a063] tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 opacity-70" />
              {formattedTime}
            </p>
          </div>
        </header>

        {/* Filter Navigation & Bulk Complete Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 border-b border-white/10 pb-3.5">
          <nav
            id="task-filter-nav"
            aria-label="Task filters"
            className="flex gap-4 sm:gap-6 text-[11px] uppercase tracking-[0.22em] font-semibold"
          >
            <button
              id="filter-all-button"
              type="button"
              onClick={() => setCurrentFilter('all')}
              className={`cursor-pointer transition-all pb-3.5 -mb-[15px] ${
                currentFilter === 'all'
                  ? 'text-white border-b-2 border-[#c9a063]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              All <span className="text-[10px] opacity-60">({tasks.length})</span>
            </button>
            <button
              id="filter-active-button"
              type="button"
              onClick={() => setCurrentFilter('active')}
              className={`cursor-pointer transition-all pb-3.5 -mb-[15px] ${
                currentFilter === 'active'
                  ? 'text-white border-b-2 border-[#c9a063]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Active <span className="text-[10px] opacity-60">({activeCount})</span>
            </button>
            <button
              id="filter-completed-button"
              type="button"
              onClick={() => setCurrentFilter('completed')}
              className={`cursor-pointer transition-all pb-3.5 -mb-[15px] ${
                currentFilter === 'completed'
                  ? 'text-white border-b-2 border-[#c9a063]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Completed <span className="text-[10px] opacity-60">({completedCount})</span>
            </button>
          </nav>

          {activeCount > 0 && (
            <button
              id="complete-all-button"
              type="button"
              onClick={handleCompleteAll}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#c9a063] hover:text-[#d4b584] hover:bg-[#c9a063]/10 px-3 py-1 rounded-full border border-[#c9a063]/30 transition-all cursor-pointer self-start sm:self-auto"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Complete All</span>
            </button>
          )}
        </div>

        {/* Add Task Input Section */}
        <section id="add-task-section" className="mb-8">
          <form id="add-task-form" onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 h-auto sm:h-14">
            <input
              id="task-title-input"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Capture a new task..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 sm:px-6 py-3 sm:py-0 text-sm text-white placeholder:italic placeholder:text-white/30 focus:outline-none focus:border-[#c9a063] focus:ring-1 focus:ring-[#c9a063]/50 transition-all"
              autoComplete="off"
            />
            <button
              id="add-task-button"
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="bg-[#c9a063] text-[#0a0a0a] font-serif italic px-8 py-3.5 sm:py-0 text-base font-bold hover:bg-[#d4b584] active:bg-[#b88f55] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm shadow-[#c9a063]/10"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </form>
        </section>

        {/* Tasks List */}
        <main id="tasks-list-container" className="flex-1 flex flex-col gap-3 mb-8">
          {filteredTasks.length === 0 ? (
            <div
              id="empty-tasks-state"
              className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl text-white/40"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-3 text-[#c9a063]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-base font-serif italic text-white/70">
                {currentFilter === 'all' && 'No tasks captured yet.'}
                {currentFilter === 'active' && 'No active tasks remaining.'}
                {currentFilter === 'completed' && 'No completed tasks yet.'}
              </p>
              <p className="text-xs uppercase tracking-widest text-white/30 mt-2 max-w-sm">
                {currentFilter === 'all' && 'Enter a task title above to begin building your agenda.'}
                {currentFilter === 'active' && 'All priorities are finished, or capture a new task above.'}
                {currentFilter === 'completed' && 'Complete active agenda items to see them recorded here.'}
              </p>
            </div>
          ) : (
            <ul id="tasks-list" className="flex flex-col gap-3">
              {filteredTasks.map((task) => {
                const isCompleted = task.completed;
                return (
                  <li
                    key={task.id}
                    id={`task-item-${task.id}`}
                    onClick={() => handleToggleTask(task.id)}
                    className={`group flex items-center gap-4 sm:gap-6 py-4 px-5 sm:px-6 rounded-xl border border-white/5 border-l-4 transform transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.012] hover:shadow-xl hover:shadow-black/60 cursor-pointer select-none ${
                      isCompleted
                        ? 'border-l-[#c9a063] bg-white/[0.015] opacity-45 hover:opacity-85 hover:border-white/10'
                        : 'border-l-white/20 bg-white/[0.03] hover:border-l-[#c9a063] hover:bg-white/[0.05] hover:border-white/15'
                    }`}
                  >
                    <button
                      id={`task-toggle-${task.id}`}
                      type="button"
                      aria-label={isCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(task.id);
                      }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0 ${
                        isCompleted
                          ? 'bg-[#c9a063] border border-[#c9a063] text-[#0a0a0a] scale-100'
                          : 'border border-white/30 group-hover:border-[#c9a063] bg-transparent group-hover:scale-105'
                      }`}
                    >
                      {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <span
                        id={`task-title-${task.id}`}
                        className={`text-base font-light tracking-wide break-words transition-all ${
                          isCompleted
                            ? 'line-through text-white/40'
                            : 'text-[#e2e2e2] group-hover:text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <button
                      id={`task-action-${task.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(task.id);
                      }}
                      className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 transition-all cursor-pointer ${
                        isCompleted
                          ? 'border-[#c9a063]/30 text-[#c9a063] bg-[#c9a063]/10 hover:bg-[#c9a063]/20'
                          : 'border-white/10 text-white/40 hover:text-[#c9a063] hover:border-[#c9a063]/40 hover:bg-white/[0.04]'
                      }`}
                    >
                      {isCompleted ? 'Completed ✓' : 'Mark Done'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </main>

        {/* Footer */}
        <footer
          id="app-footer"
          className="mt-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30"
        >
          <p>Personal Productivity Suite</p>
          <p>
            {activeCount} {activeCount === 1 ? 'Remaining Task' : 'Remaining Tasks'}
          </p>
        </footer>
      </div>
    </div>
  );
}
