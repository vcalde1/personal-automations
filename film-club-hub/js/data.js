// ===== Film Club Hub - Data Layer =====
// All data persisted in localStorage

const Store = {
  _key: 'filmClubHub',

  _load() {
    try {
      return JSON.parse(localStorage.getItem(this._key)) || {};
    } catch { return {}; }
  },

  _save(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  get(collection) {
    return this._load()[collection] || [];
  },

  set(collection, items) {
    const data = this._load();
    data[collection] = items;
    this._save(data);
  },

  getConfig(key) {
    const data = this._load();
    return (data._config || {})[key];
  },

  setConfig(key, value) {
    const data = this._load();
    if (!data._config) data._config = {};
    data._config[key] = value;
    this._save(data);
  },

  // Export all data as JSON
  exportAll() {
    return JSON.stringify(this._load(), null, 2);
  },

  // Import data from JSON
  importAll(json) {
    const data = JSON.parse(json);
    this._save(data);
  }
};

// ===== Members =====
const Members = {
  getAll() { return Store.get('members'); },

  add(name) {
    const members = this.getAll();
    const member = { id: crypto.randomUUID(), name: name.trim(), joinedAt: new Date().toISOString() };
    members.push(member);
    Store.set('members', members);
    return member;
  },

  remove(id) {
    Store.set('members', this.getAll().filter(m => m.id !== id));
  },

  getById(id) {
    return this.getAll().find(m => m.id === id);
  },

  getName(id) {
    const m = this.getById(id);
    return m ? m.name : 'Unknown';
  }
};

// ===== Schedule (Hosting Rotation) =====
const Schedule = {
  getAll() { return Store.get('schedule'); },

  add(entry) {
    const schedule = this.getAll();
    const item = {
      id: crypto.randomUUID(),
      weekStart: entry.weekStart,
      hostId: entry.hostId,
      film1: entry.film1 || '',
      film1Year: entry.film1Year || '',
      film2: entry.film2 || '',
      film2Year: entry.film2Year || '',
      discussionDate: entry.discussionDate || '',
      notes: entry.notes || '',
      createdAt: new Date().toISOString()
    };
    schedule.push(item);
    schedule.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
    Store.set('schedule', schedule);
    return item;
  },

  update(id, updates) {
    const schedule = this.getAll().map(s => s.id === id ? { ...s, ...updates } : s);
    schedule.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
    Store.set('schedule', schedule);
  },

  remove(id) {
    Store.set('schedule', this.getAll().filter(s => s.id !== id));
  },

  getById(id) {
    return this.getAll().find(s => s.id === id);
  },

  getCurrentWeek() {
    const today = new Date().toISOString().slice(0, 10);
    const schedule = this.getAll();
    // Find the most recent week that has started
    let current = null;
    for (const s of schedule) {
      if (s.weekStart <= today) current = s;
      else break;
    }
    return current;
  },

  getUpcoming() {
    const today = new Date().toISOString().slice(0, 10);
    return this.getAll().filter(s => s.weekStart >= today);
  },

  getPast() {
    const today = new Date().toISOString().slice(0, 10);
    return this.getAll().filter(s => s.weekStart < today).reverse();
  },

  // Auto-generate rotation schedule
  generateRotation(startDate, weeks, memberOrder) {
    const schedule = [];
    const start = new Date(startDate);
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + i * 7);
      const discussionDate = new Date(weekStart);
      // Discussion is on Sunday of that week
      discussionDate.setDate(weekStart.getDate() + (7 - weekStart.getDay()));

      schedule.push(this.add({
        weekStart: weekStart.toISOString().slice(0, 10),
        hostId: memberOrder[i % memberOrder.length],
        discussionDate: discussionDate.toISOString().slice(0, 10)
      }));
    }
    return schedule;
  }
};

// ===== Roles & Tasks =====
const Roles = {
  getAll() { return Store.get('roles'); },

  add(role) {
    const roles = this.getAll();
    const item = {
      id: crypto.randomUUID(),
      name: role.name,
      description: role.description || '',
      assigneeId: role.assigneeId || '',
      tasks: [],
      createdAt: new Date().toISOString()
    };
    roles.push(item);
    Store.set('roles', roles);
    return item;
  },

  update(id, updates) {
    Store.set('roles', this.getAll().map(r => r.id === id ? { ...r, ...updates } : r));
  },

  remove(id) {
    Store.set('roles', this.getAll().filter(r => r.id !== id));
  },

  getById(id) {
    return this.getAll().find(r => r.id === id);
  },

  addTask(roleId, task) {
    const roles = this.getAll();
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    const t = {
      id: crypto.randomUUID(),
      text: task.text,
      done: false,
      dueDate: task.dueDate || '',
      recurring: task.recurring || false,
      createdAt: new Date().toISOString()
    };
    role.tasks.push(t);
    Store.set('roles', roles);
    return t;
  },

  updateTask(roleId, taskId, updates) {
    const roles = this.getAll();
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    role.tasks = role.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    Store.set('roles', roles);
  },

  removeTask(roleId, taskId) {
    const roles = this.getAll();
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    role.tasks = role.tasks.filter(t => t.id !== taskId);
    Store.set('roles', roles);
  },

  toggleTask(roleId, taskId) {
    const roles = this.getAll();
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    const task = role.tasks.find(t => t.id === taskId);
    if (task) task.done = !task.done;
    Store.set('roles', roles);
  }
};

// ===== Announcements =====
const Announcements = {
  getAll() {
    return Store.get('announcements').sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  },

  add(announcement) {
    const items = Store.get('announcements');
    const item = {
      id: crypto.randomUUID(),
      title: announcement.title,
      body: announcement.body,
      author: announcement.author || '',
      pinned: announcement.pinned || false,
      createdAt: new Date().toISOString()
    };
    items.push(item);
    Store.set('announcements', items);
    return item;
  },

  update(id, updates) {
    Store.set('announcements', Store.get('announcements').map(a => a.id === id ? { ...a, ...updates } : a));
  },

  remove(id) {
    Store.set('announcements', Store.get('announcements').filter(a => a.id !== id));
  },

  togglePin(id) {
    const items = Store.get('announcements');
    const item = items.find(a => a.id === id);
    if (item) item.pinned = !item.pinned;
    Store.set('announcements', items);
  }
};

// ===== Seed demo data if empty =====
function seedDemoData() {
  if (Members.getAll().length > 0) return;

  const names = ['Alex', 'Jordan', 'Sam', 'Riley', 'Casey'];
  const members = names.map(n => Members.add(n));

  // Create some roles
  const scheduler = Roles.add({ name: 'Schedule Coordinator', description: 'Manages the hosting rotation and calendar', assigneeId: members[0].id });
  Roles.addTask(scheduler.id, { text: 'Update next month\'s rotation schedule', recurring: true });
  Roles.addTask(scheduler.id, { text: 'Confirm hosts have their picks ready by Monday', recurring: true });

  const techRole = Roles.add({ name: 'Tech Support', description: 'Manages the virtual meeting setup', assigneeId: members[1].id });
  Roles.addTask(techRole.id, { text: 'Send meeting link before Sunday discussion', recurring: true });
  Roles.addTask(techRole.id, { text: 'Test screen sharing setup', done: true });

  const social = Roles.add({ name: 'Social Media', description: 'Shares film picks and recaps', assigneeId: members[2].id });
  Roles.addTask(social.id, { text: 'Post weekly film picks announcement', recurring: true });

  Roles.add({ name: 'Archivist', description: 'Maintains history and records of past screenings', assigneeId: '' });

  // Create past schedule entries
  const pastWeeks = [
    { offset: -28, host: 0, f1: 'The Grand Budapest Hotel', y1: '2014', f2: 'Moonrise Kingdom', y2: '2012' },
    { offset: -21, host: 1, f1: 'Parasite', y1: '2019', f2: 'Memories of Murder', y2: '2003' },
    { offset: -14, host: 2, f1: 'Everything Everywhere All at Once', y1: '2022', f2: 'Swiss Army Man', y2: '2016' },
    { offset: -7, host: 3, f1: 'The Lighthouse', y1: '2019', f2: 'The Witch', y2: '2015' },
  ];

  const today = new Date();
  for (const w of pastWeeks) {
    const d = new Date(today);
    d.setDate(d.getDate() + w.offset);
    // Set to Monday
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const disc = new Date(d);
    disc.setDate(d.getDate() + 6);
    Schedule.add({
      weekStart: d.toISOString().slice(0, 10),
      hostId: members[w.host].id,
      film1: w.f1, film1Year: w.y1,
      film2: w.f2, film2Year: w.y2,
      discussionDate: disc.toISOString().slice(0, 10)
    });
  }

  // Current week
  const mon = new Date(today);
  mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  Schedule.add({
    weekStart: mon.toISOString().slice(0, 10),
    hostId: members[4].id,
    film1: 'Aftersun', film1Year: '2022',
    film2: 'Past Lives', film2Year: '2023',
    discussionDate: sun.toISOString().slice(0, 10)
  });

  // Future weeks
  for (let i = 1; i <= 4; i++) {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i * 7);
    const disc = new Date(d);
    disc.setDate(d.getDate() + 6);
    Schedule.add({
      weekStart: d.toISOString().slice(0, 10),
      hostId: members[i % members.length].id,
      discussionDate: disc.toISOString().slice(0, 10)
    });
  }

  // Announcements
  Announcements.add({
    title: 'Welcome to Film Club Hub!',
    body: 'This is our new hub for managing film club activities. Check the schedule, track tasks, and stay up to date with announcements.',
    author: 'Admin',
    pinned: true
  });

  Announcements.add({
    title: 'Sunday Discussion Reminder',
    body: 'Don\'t forget: discussions happen every Sunday evening. Make sure you\'ve watched both films before joining!',
    author: members[0].id
  });
}
