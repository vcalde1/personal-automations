// ===== Film Club Hub - Main App =====

document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  initNav();
  renderAll();
  navigate(location.hash.slice(1) || 'dashboard');
});

// ===== Navigation =====
function initNav() {
  document.querySelectorAll('.nav__item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.section));
  });
  window.addEventListener('hashchange', () => navigate(location.hash.slice(1) || 'dashboard'));
}

function navigate(section) {
  location.hash = section;
  document.querySelectorAll('.nav__item').forEach(n => n.classList.toggle('nav__item--active', n.dataset.section === section));
  document.querySelectorAll('.section').forEach(s => s.classList.toggle('section--active', s.id === `section-${section}`));
  // Re-render the active section
  const renderers = { dashboard: renderDashboard, schedule: renderSchedule, admin: renderAdmin, history: renderHistory, announcements: renderAnnouncements, settings: renderSettings };
  if (renderers[section]) renderers[section]();
}

function renderAll() {
  renderDashboard();
  renderSchedule();
  renderAdmin();
  renderHistory();
  renderAnnouncements();
  renderSettings();
}

// ===== Utility =====
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isCurrentWeek(weekStart) {
  const today = new Date();
  const start = new Date(weekStart + 'T00:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return today >= start && today <= end;
}

function isPast(weekStart) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(weekStart + 'T00:00:00');
  end.setDate(end.getDate() + 6);
  return end < today;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function memberOptions(selectedId = '') {
  const members = Members.getAll();
  return `<option value="">-- Select --</option>` + members.map(m =>
    `<option value="${m.id}" ${m.id === selectedId ? 'selected' : ''}>${escapeHtml(m.name)}</option>`
  ).join('');
}

// ===== Modal =====
function showModal(title, bodyHtml) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  overlay.classList.add('modal-overlay--active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('modal-overlay--active');
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-overlay') closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== Dashboard =====
function renderDashboard() {
  const container = document.getElementById('dashboard-content');
  const current = Schedule.getCurrentWeek();
  const members = Members.getAll();
  const totalFilms = Schedule.getAll().reduce((n, s) => n + (s.film1 ? 1 : 0) + (s.film2 ? 1 : 0), 0);
  const upcoming = Schedule.getUpcoming();
  const roles = Roles.getAll();
  const pendingTasks = roles.reduce((n, r) => n + r.tasks.filter(t => !t.done).length, 0);

  let html = `<div class="dashboard-grid">
    <div class="stat-card">
      <div class="stat-card__value">${members.length}</div>
      <div class="stat-card__label">Members</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__value">${totalFilms}</div>
      <div class="stat-card__label">Films Watched</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__value">${pendingTasks}</div>
      <div class="stat-card__label">Open Tasks</div>
    </div>
  </div>`;

  if (current) {
    html += `<h3 style="margin-bottom: 0.75rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">This Week</h3>
    <div class="current-week">
      <div class="current-week__host">Hosted by ${escapeHtml(Members.getName(current.hostId))}</div>
      <div class="current-week__films">
        <div class="film-pick">
          <div class="film-pick__label">Film 1</div>
          <div class="film-pick__title">${current.film1 ? escapeHtml(current.film1) : '<em style="color:var(--text-muted)">TBA</em>'}</div>
          ${current.film1Year ? `<div class="film-pick__year">${escapeHtml(current.film1Year)}</div>` : ''}
        </div>
        <div class="film-pick">
          <div class="film-pick__label">Film 2</div>
          <div class="film-pick__title">${current.film2 ? escapeHtml(current.film2) : '<em style="color:var(--text-muted)">TBA</em>'}</div>
          ${current.film2Year ? `<div class="film-pick__year">${escapeHtml(current.film2Year)}</div>` : ''}
        </div>
      </div>
      ${current.discussionDate ? `<div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">Discussion: Sunday, ${formatDate(current.discussionDate)}</div>` : ''}
    </div>`;
  }

  // Upcoming hosts preview
  const nextWeeks = upcoming.filter(s => !isCurrentWeek(s.weekStart)).slice(0, 3);
  if (nextWeeks.length) {
    html += `<h3 style="margin-bottom: 0.75rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">Coming Up</h3>`;
    for (const s of nextWeeks) {
      html += `<div class="card" style="display:flex; align-items:center; gap:1rem;">
        <div style="min-width:80px; font-size:0.8rem; color:var(--text-muted)">${formatDateShort(s.weekStart)}</div>
        <div style="flex:1">
          <span class="member-badge">${escapeHtml(Members.getName(s.hostId))}</span>
          ${s.film1 ? `<span style="margin-left:0.75rem; font-size:0.85rem; color:var(--text-secondary)">${escapeHtml(s.film1)}${s.film2 ? ' & ' + escapeHtml(s.film2) : ''}</span>` : '<span style="margin-left:0.75rem; font-size:0.85rem; color:var(--text-muted)">Films TBA</span>'}
        </div>
      </div>`;
    }
  }

  // Roles & Tasks summary
  if (roles.length) {
    html += `<h3 style="margin: 1.5rem 0 0.75rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">Roles &amp; Tasks</h3>`;
    for (const role of roles) {
      const assignee = role.assigneeId ? Members.getName(role.assigneeId) : 'Unassigned';
      const openTasks = role.tasks.filter(t => !t.done);
      const doneCount = role.tasks.length - openTasks.length;
      html += `<div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:${openTasks.length ? '0.5rem' : '0'}">
          <div>
            <div class="card__title">${escapeHtml(role.name)}</div>
            <div class="card__meta">${assignee === 'Unassigned' ? '<em>Unassigned</em>' : escapeHtml(assignee)}${role.tasks.length ? ` &mdash; ${doneCount}/${role.tasks.length} done` : ''}</div>
          </div>
        </div>
        ${openTasks.length ? `<div style="border-top:1px solid var(--border); padding-top:0.5rem;">${openTasks.slice(0, 3).map(t => {
          const overdue = t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10);
          return `<div style="display:flex; align-items:center; gap:0.5rem; padding:0.2rem 0; font-size:0.85rem; color:var(--text-secondary);">
            <span style="color:var(--text-muted);">&#9675;</span>
            <span>${escapeHtml(t.text)}</span>
            ${t.dueDate ? `<span style="margin-left:auto; font-size:0.7rem; color:${overdue ? 'var(--danger)' : 'var(--text-muted)'}">${formatDateShort(t.dueDate)}</span>` : ''}
          </div>`;
        }).join('')}${openTasks.length > 3 ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">+${openTasks.length - 3} more</div>` : ''}</div>` : ''}
      </div>`;
    }
  }

  container.innerHTML = html;
}

// ===== Schedule =====
function renderSchedule() {
  const container = document.getElementById('schedule-content');
  const schedule = Schedule.getAll();

  let html = `<div class="toolbar">
    <div>
      <button class="btn btn--primary" onclick="showAddScheduleModal()">+ Add Week</button>
      <button class="btn btn--secondary" onclick="showGenerateRotationModal()">Generate Rotation</button>
    </div>
  </div>`;

  if (!schedule.length) {
    html += `<div class="empty-state"><div class="empty-state__icon">&#128197;</div><div class="empty-state__text">No schedule yet. Add weeks or generate a rotation.</div></div>`;
    container.innerHTML = html;
    return;
  }

  html += `<ul class="schedule-list">`;
  for (const s of schedule) {
    const current = isCurrentWeek(s.weekStart);
    const past = isPast(s.weekStart);
    html += `<li class="schedule-item${current ? ' schedule-item--current' : ''}${past ? ' schedule-item--past' : ''}">
      <div class="schedule-item__week">${formatDateShort(s.weekStart)}</div>
      <div class="schedule-item__host">${escapeHtml(Members.getName(s.hostId))}</div>
      <div class="schedule-item__films">
        ${s.film1 ? escapeHtml(s.film1) : '<em>TBA</em>'}${s.film2 ? ' &amp; ' + escapeHtml(s.film2) : (s.film1 ? '' : '')}
      </div>
      ${current ? '<span class="schedule-item__badge">This Week</span>' : ''}
      <button class="btn btn--icon btn--small" onclick="showEditScheduleModal('${s.id}')" title="Edit">&#9998;</button>
      <button class="btn btn--icon btn--small" onclick="deleteScheduleEntry('${s.id}')" title="Delete">&#128465;</button>
    </li>`;
  }
  html += `</ul>`;
  container.innerHTML = html;
}

function showAddScheduleModal() {
  const today = new Date().toISOString().slice(0, 10);
  showModal('Add Week', `
    <div class="form-group">
      <label>Week Starting (Monday)</label>
      <input type="date" class="form-input" id="sched-date" value="${today}">
    </div>
    <div class="form-group">
      <label>Host</label>
      <select class="form-input" id="sched-host">${memberOptions()}</select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Film 1</label>
        <input type="text" class="form-input" id="sched-film1" placeholder="Title">
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="text" class="form-input" id="sched-film1-year" placeholder="Year" maxlength="4">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Film 2</label>
        <input type="text" class="form-input" id="sched-film2" placeholder="Title">
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="text" class="form-input" id="sched-film2-year" placeholder="Year" maxlength="4">
      </div>
    </div>
    <div class="form-group">
      <label>Discussion Date</label>
      <input type="date" class="form-input" id="sched-discussion">
    </div>
    <div class="form-actions">
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="addScheduleEntry()">Add</button>
    </div>
  `);
}

function addScheduleEntry() {
  const weekStart = document.getElementById('sched-date').value;
  const hostId = document.getElementById('sched-host').value;
  if (!weekStart || !hostId) return alert('Week start date and host are required.');
  Schedule.add({
    weekStart,
    hostId,
    film1: document.getElementById('sched-film1').value,
    film1Year: document.getElementById('sched-film1-year').value,
    film2: document.getElementById('sched-film2').value,
    film2Year: document.getElementById('sched-film2-year').value,
    discussionDate: document.getElementById('sched-discussion').value
  });
  closeModal();
  renderSchedule();
  renderDashboard();
}

function showEditScheduleModal(id) {
  const s = Schedule.getById(id);
  if (!s) return;
  showModal('Edit Week', `
    <div class="form-group">
      <label>Week Starting</label>
      <input type="date" class="form-input" id="sched-date" value="${s.weekStart}">
    </div>
    <div class="form-group">
      <label>Host</label>
      <select class="form-input" id="sched-host">${memberOptions(s.hostId)}</select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Film 1</label>
        <input type="text" class="form-input" id="sched-film1" value="${escapeHtml(s.film1)}">
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="text" class="form-input" id="sched-film1-year" value="${escapeHtml(s.film1Year)}" maxlength="4">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Film 2</label>
        <input type="text" class="form-input" id="sched-film2" value="${escapeHtml(s.film2)}">
      </div>
      <div class="form-group">
        <label>Year</label>
        <input type="text" class="form-input" id="sched-film2-year" value="${escapeHtml(s.film2Year)}" maxlength="4">
      </div>
    </div>
    <div class="form-group">
      <label>Discussion Date</label>
      <input type="date" class="form-input" id="sched-discussion" value="${s.discussionDate}">
    </div>
    <div class="form-actions">
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="updateScheduleEntry('${id}')">Save</button>
    </div>
  `);
}

function updateScheduleEntry(id) {
  Schedule.update(id, {
    weekStart: document.getElementById('sched-date').value,
    hostId: document.getElementById('sched-host').value,
    film1: document.getElementById('sched-film1').value,
    film1Year: document.getElementById('sched-film1-year').value,
    film2: document.getElementById('sched-film2').value,
    film2Year: document.getElementById('sched-film2-year').value,
    discussionDate: document.getElementById('sched-discussion').value
  });
  closeModal();
  renderSchedule();
  renderDashboard();
}

function deleteScheduleEntry(id) {
  if (!confirm('Remove this week from the schedule?')) return;
  Schedule.remove(id);
  renderSchedule();
  renderDashboard();
  renderHistory();
}

function showGenerateRotationModal() {
  const members = Members.getAll();
  if (!members.length) return alert('Add members first in Settings.');

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + 7); // Next Monday

  let memberChecks = members.map(m =>
    `<label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
      <input type="checkbox" class="rotation-member" value="${m.id}" checked>
      ${escapeHtml(m.name)}
    </label>`
  ).join('');

  showModal('Generate Rotation', `
    <div class="form-group">
      <label>Start Date (Monday)</label>
      <input type="date" class="form-input" id="rot-start" value="${monday.toISOString().slice(0, 10)}">
    </div>
    <div class="form-group">
      <label>Number of Weeks</label>
      <input type="number" class="form-input" id="rot-weeks" value="8" min="1" max="52">
    </div>
    <div class="form-group">
      <label>Members in Rotation (order matters)</label>
      <div style="margin-top:0.4rem">${memberChecks}</div>
    </div>
    <div class="form-actions">
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="generateRotation()">Generate</button>
    </div>
  `);
}

function generateRotation() {
  const start = document.getElementById('rot-start').value;
  const weeks = parseInt(document.getElementById('rot-weeks').value);
  const checked = [...document.querySelectorAll('.rotation-member:checked')].map(c => c.value);
  if (!start || !weeks || !checked.length) return alert('Fill in all fields and select at least one member.');
  Schedule.generateRotation(start, weeks, checked);
  closeModal();
  renderSchedule();
  renderDashboard();
}

// ===== Administration =====
function renderAdmin() {
  const container = document.getElementById('admin-content');
  const roles = Roles.getAll();

  let html = `<div class="toolbar">
    <button class="btn btn--primary" onclick="showAddRoleModal()">+ Add Role</button>
  </div>`;

  if (!roles.length) {
    html += `<div class="empty-state"><div class="empty-state__icon">&#128188;</div><div class="empty-state__text">No roles defined yet.</div></div>`;
    container.innerHTML = html;
    return;
  }

  for (const role of roles) {
    const assignee = role.assigneeId ? Members.getName(role.assigneeId) : 'Unassigned';
    const doneCount = role.tasks.filter(t => t.done).length;
    const totalTasks = role.tasks.length;

    html += `<div class="role-card">
      <div class="role-card__header" onclick="toggleRoleTasks('${role.id}')">
        <div>
          <div class="role-card__name">${escapeHtml(role.name)}</div>
          ${role.description ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem">${escapeHtml(role.description)}</div>` : ''}
        </div>
        <div style="text-align:right">
          <div class="role-card__assignee">${assignee === 'Unassigned' ? '<em style="color:var(--text-muted)">Unassigned</em>' : escapeHtml(assignee)}</div>
          ${totalTasks ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem">${doneCount}/${totalTasks} tasks done</div>` : ''}
        </div>
      </div>
      <div class="role-card__tasks" id="role-tasks-${role.id}" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span style="font-size:0.8rem; color:var(--text-muted)">Tasks</span>
          <div style="display:flex; gap:0.25rem;">
            <button class="btn btn--small btn--secondary" onclick="showEditRoleModal('${role.id}')">Edit Role</button>
            <button class="btn btn--small btn--primary" onclick="showAddTaskModal('${role.id}')">+ Task</button>
          </div>
        </div>`;

    if (role.tasks.length) {
      for (const task of role.tasks) {
        const overdue = task.dueDate && !task.done && task.dueDate < new Date().toISOString().slice(0, 10);
        html += `<div class="task-item">
          <div class="task-item__check${task.done ? ' task-item__check--done' : ''}" onclick="toggleTaskDone('${role.id}','${task.id}')"></div>
          <span class="task-item__text${task.done ? ' task-item__text--done' : ''}">${escapeHtml(task.text)}${task.recurring ? ' <span style="color:var(--text-muted); font-size:0.7rem;">&#8635; recurring</span>' : ''}</span>
          ${task.dueDate ? `<span class="task-item__due${overdue ? ' task-item__due--overdue' : ''}">${formatDateShort(task.dueDate)}</span>` : ''}
          <button class="btn btn--icon btn--small" onclick="deleteTask('${role.id}','${task.id}')" title="Delete">&#215;</button>
        </div>`;
      }
    } else {
      html += `<div style="padding:0.5rem 0; color:var(--text-muted); font-size:0.85rem; text-align:center;">No tasks yet</div>`;
    }

    html += `</div></div>`;
  }

  container.innerHTML = html;
}

function toggleRoleTasks(roleId) {
  const el = document.getElementById(`role-tasks-${roleId}`);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function showAddRoleModal() {
  showModal('Add Role', `
    <div class="form-group">
      <label>Role Name</label>
      <input type="text" class="form-input" id="role-name" placeholder="e.g., Schedule Coordinator">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="form-input" id="role-desc" placeholder="What this role is responsible for"></textarea>
    </div>
    <div class="form-group">
      <label>Assign To</label>
      <select class="form-input" id="role-assignee">${memberOptions()}</select>
    </div>
    <div class="form-actions">
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="addRole()">Add</button>
    </div>
  `);
}

function addRole() {
  const name = document.getElementById('role-name').value.trim();
  if (!name) return alert('Role name is required.');
  Roles.add({
    name,
    description: document.getElementById('role-desc').value.trim(),
    assigneeId: document.getElementById('role-assignee').value
  });
  closeModal();
  renderAdmin();
}

function showEditRoleModal(roleId) {
  const role = Roles.getById(roleId);
  if (!role) return;
  showModal('Edit Role', `
    <div class="form-group">
      <label>Role Name</label>
      <input type="text" class="form-input" id="role-name" value="${escapeHtml(role.name)}">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="form-input" id="role-desc">${escapeHtml(role.description)}</textarea>
    </div>
    <div class="form-group">
      <label>Assign To</label>
      <select class="form-input" id="role-assignee">${memberOptions(role.assigneeId)}</select>
    </div>
    <div class="form-actions">
      <button class="btn btn--danger btn--small" onclick="deleteRole('${roleId}')" style="margin-right:auto">Delete Role</button>
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="updateRole('${roleId}')">Save</button>
    </div>
  `);
}

function updateRole(roleId) {
  Roles.update(roleId, {
    name: document.getElementById('role-name').value.trim(),
    description: document.getElementById('role-desc').value.trim(),
    assigneeId: document.getElementById('role-assignee').value
  });
  closeModal();
  renderAdmin();
}

function deleteRole(roleId) {
  if (!confirm('Delete this role and all its tasks?')) return;
  Roles.remove(roleId);
  closeModal();
  renderAdmin();
}

function showAddTaskModal(roleId) {
  showModal('Add Task', `
    <div class="form-group">
      <label>Task Description</label>
      <input type="text" class="form-input" id="task-text" placeholder="What needs to be done">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Due Date (optional)</label>
        <input type="date" class="form-input" id="task-due">
      </div>
      <div class="form-group">
        <label>Recurring?</label>
        <select class="form-input" id="task-recurring">
          <option value="false">No</option>
          <option value="true">Yes (weekly)</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="addTask('${roleId}')">Add</button>
    </div>
  `);
}

function addTask(roleId) {
  const text = document.getElementById('task-text').value.trim();
  if (!text) return alert('Task description is required.');
  Roles.addTask(roleId, {
    text,
    dueDate: document.getElementById('task-due').value,
    recurring: document.getElementById('task-recurring').value === 'true'
  });
  closeModal();
  renderAdmin();
  renderDashboard();
}

function toggleTaskDone(roleId, taskId) {
  Roles.toggleTask(roleId, taskId);
  renderAdmin();
  renderDashboard();
}

function deleteTask(roleId, taskId) {
  Roles.removeTask(roleId, taskId);
  renderAdmin();
  renderDashboard();
}

// ===== History =====
function renderHistory() {
  const container = document.getElementById('history-content');
  const past = Schedule.getPast();

  let html = '';

  if (!past.length) {
    html = `<div class="empty-state"><div class="empty-state__icon">&#127902;</div><div class="empty-state__text">No past screenings yet. History will appear here as weeks pass.</div></div>`;
    container.innerHTML = html;
    return;
  }

  // Stats
  const hosts = {};
  let filmCount = 0;
  for (const s of past) {
    const name = Members.getName(s.hostId);
    hosts[name] = (hosts[name] || 0) + 1;
    if (s.film1) filmCount++;
    if (s.film2) filmCount++;
  }

  html += `<div class="dashboard-grid" style="margin-bottom:1.5rem">
    <div class="stat-card">
      <div class="stat-card__value">${past.length}</div>
      <div class="stat-card__label">Weeks Completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__value">${filmCount}</div>
      <div class="stat-card__label">Films Screened</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__value">${Object.keys(hosts).length}</div>
      <div class="stat-card__label">Unique Hosts</div>
    </div>
  </div>`;

  // Host leaderboard
  const sorted = Object.entries(hosts).sort((a, b) => b[1] - a[1]);
  html += `<div class="card" style="margin-bottom:1.5rem">
    <div class="card__title" style="margin-bottom:0.75rem">Hosting Leaderboard</div>
    ${sorted.map(([name, count]) => `
      <div style="display:flex; justify-content:space-between; padding:0.3rem 0; font-size:0.9rem;">
        <span>${escapeHtml(name)}</span>
        <span style="color:var(--accent); font-weight:600">${count} week${count !== 1 ? 's' : ''}</span>
      </div>
    `).join('')}
  </div>`;

  // Past screenings
  html += `<h3 style="margin-bottom:0.75rem; color:var(--text-secondary); font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">Past Screenings</h3>`;
  for (const s of past) {
    html += `<div class="history-item">
      <div class="history-item__date">${formatDate(s.weekStart)}${s.discussionDate ? ' &mdash; Discussed ' + formatDate(s.discussionDate) : ''}</div>
      <div class="history-item__host">Hosted by ${escapeHtml(Members.getName(s.hostId))}</div>
      <div class="history-item__films">
        ${s.film1 ? `<div class="history-film">${escapeHtml(s.film1)} ${s.film1Year ? `<span class="history-film__year">(${escapeHtml(s.film1Year)})</span>` : ''}</div>` : ''}
        ${s.film2 ? `<div class="history-film">${escapeHtml(s.film2)} ${s.film2Year ? `<span class="history-film__year">(${escapeHtml(s.film2Year)})</span>` : ''}</div>` : ''}
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

// ===== Announcements =====
function renderAnnouncements() {
  const container = document.getElementById('announcements-content');
  const items = Announcements.getAll();

  let html = `<div class="toolbar">
    <button class="btn btn--primary" onclick="showAddAnnouncementModal()">+ New Announcement</button>
  </div>`;

  if (!items.length) {
    html += `<div class="empty-state"><div class="empty-state__icon">&#128227;</div><div class="empty-state__text">No announcements yet.</div></div>`;
    container.innerHTML = html;
    return;
  }

  for (const a of items) {
    const authorName = a.author && Members.getById(a.author) ? Members.getName(a.author) : (a.author || 'Unknown');
    html += `<div class="announcement${a.pinned ? ' announcement--pinned' : ''}">
      ${a.pinned ? '<div class="announcement__pin">&#128204; Pinned</div>' : ''}
      <div class="announcement__title">${escapeHtml(a.title)}</div>
      <div class="announcement__body">${escapeHtml(a.body)}</div>
      <div class="announcement__footer">
        <span>By ${escapeHtml(authorName)} &mdash; ${formatDate(a.createdAt.slice(0, 10))}</span>
        <div style="display:flex; gap:0.25rem;">
          <button class="btn btn--icon btn--small" onclick="togglePinAnnouncement('${a.id}')" title="${a.pinned ? 'Unpin' : 'Pin'}">&#128204;</button>
          <button class="btn btn--icon btn--small" onclick="showEditAnnouncementModal('${a.id}')" title="Edit">&#9998;</button>
          <button class="btn btn--icon btn--small" onclick="deleteAnnouncement('${a.id}')" title="Delete">&#128465;</button>
        </div>
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

function showAddAnnouncementModal() {
  showModal('New Announcement', `
    <div class="form-group">
      <label>Title</label>
      <input type="text" class="form-input" id="ann-title" placeholder="Announcement title">
    </div>
    <div class="form-group">
      <label>Message</label>
      <textarea class="form-input" id="ann-body" rows="4" placeholder="Write your announcement..."></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Author</label>
        <select class="form-input" id="ann-author">${memberOptions()}</select>
      </div>
      <div class="form-group">
        <label>Pin?</label>
        <select class="form-input" id="ann-pinned">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="addAnnouncement()">Post</button>
    </div>
  `);
}

function addAnnouncement() {
  const title = document.getElementById('ann-title').value.trim();
  const body = document.getElementById('ann-body').value.trim();
  if (!title) return alert('Title is required.');
  Announcements.add({
    title,
    body,
    author: document.getElementById('ann-author').value,
    pinned: document.getElementById('ann-pinned').value === 'true'
  });
  closeModal();
  renderAnnouncements();
  renderDashboard();
}

function showEditAnnouncementModal(id) {
  const a = Announcements.getAll().find(x => x.id === id);
  if (!a) return;
  showModal('Edit Announcement', `
    <div class="form-group">
      <label>Title</label>
      <input type="text" class="form-input" id="ann-title" value="${escapeHtml(a.title)}">
    </div>
    <div class="form-group">
      <label>Message</label>
      <textarea class="form-input" id="ann-body" rows="4">${escapeHtml(a.body)}</textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="updateAnnouncement('${id}')">Save</button>
    </div>
  `);
}

function updateAnnouncement(id) {
  Announcements.update(id, {
    title: document.getElementById('ann-title').value.trim(),
    body: document.getElementById('ann-body').value.trim()
  });
  closeModal();
  renderAnnouncements();
  renderDashboard();
}

function deleteAnnouncement(id) {
  if (!confirm('Delete this announcement?')) return;
  Announcements.remove(id);
  renderAnnouncements();
  renderDashboard();
}

function togglePinAnnouncement(id) {
  Announcements.togglePin(id);
  renderAnnouncements();
}

// ===== Settings =====
function renderSettings() {
  const container = document.getElementById('settings-content');
  const members = Members.getAll();

  let html = `<div class="card">
    <div class="card__title" style="margin-bottom:1rem">Members</div>
    <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
      <input type="text" class="form-input" id="new-member-name" placeholder="Member name" style="flex:1" onkeydown="if(event.key==='Enter')addMember()">
      <button class="btn btn--primary" onclick="addMember()">Add</button>
    </div>`;

  if (members.length) {
    for (const m of members) {
      html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--border);">
        <span>${escapeHtml(m.name)}</span>
        <button class="btn btn--icon btn--small" onclick="removeMember('${m.id}')" title="Remove">&#215;</button>
      </div>`;
    }
  } else {
    html += `<div style="color:var(--text-muted); font-size:0.9rem;">No members yet.</div>`;
  }

  html += `</div>`;

  // Data management
  html += `<div class="card" style="margin-top:1rem">
    <div class="card__title" style="margin-bottom:1rem">Data Management</div>
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <button class="btn btn--secondary" onclick="exportData()">Export Data (JSON)</button>
      <button class="btn btn--secondary" onclick="document.getElementById('import-file').click()">Import Data</button>
      <input type="file" id="import-file" accept=".json" style="display:none" onchange="importData(event)">
      <button class="btn btn--danger" onclick="resetData()">Reset All Data</button>
    </div>
  </div>`;

  container.innerHTML = html;
}

function addMember() {
  const input = document.getElementById('new-member-name');
  const name = input.value.trim();
  if (!name) return;
  Members.add(name);
  input.value = '';
  renderSettings();
  renderAll();
}

function removeMember(id) {
  const name = Members.getName(id);
  if (!confirm(`Remove ${name}? This won't remove their history.`)) return;
  Members.remove(id);
  renderSettings();
  renderAll();
}

function exportData() {
  const data = Store.exportAll();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `film-club-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      Store.importAll(e.target.result);
      renderAll();
      alert('Data imported successfully!');
    } catch {
      alert('Invalid file format.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetData() {
  if (!confirm('This will delete ALL data. Are you sure?')) return;
  if (!confirm('Really? This cannot be undone.')) return;
  localStorage.removeItem('filmClubHub');
  seedDemoData();
  renderAll();
}

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
