// To‑Do List com localStorage e filtros
const els = {
  input: document.querySelector('#taskInput'),
  addBtn: document.querySelector('#addTask'),
  list: document.querySelector('#taskList'),
  filters: document.querySelectorAll('.filter'),
  clearCompleted: document.querySelector('#clearCompleted')
};

const STORAGE_KEY = 'todo-list-simple:v1';

let state = {
  items: [],
  filter: 'all' // all | open | done
};

// Util
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const load = () => {
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){ state = JSON.parse(raw); }
  }catch(e){ console.warn('Falha ao carregar storage', e); }
};
const uid = () => Math.random().toString(36).slice(2,9);

// Render
function render(){
  els.list.innerHTML = '';
  const filtered = state.items.filter(it => {
    if(state.filter === 'open') return !it.done;
    if(state.filter === 'done') return it.done;
    return true;
  });

  if(!filtered.length){
    const empty = document.createElement('li');
    empty.className = 'item';
    empty.innerHTML = '<p class="title" style="color:#9aa4af;margin:0">Sem tarefas por aqui… 🎉</p>';
    els.list.appendChild(empty);
    return;
  }

  for(const it of filtered){
    const li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = it.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'checkbox';
    cb.checked = it.done;
    cb.addEventListener('change', () => toggleDone(it.id));

    const p = document.createElement('p');
    p.className = 'title' + (it.done ? ' done' : '');
    p.textContent = it.title;

    const right = document.createElement('div');
    right.className = 'actions-row';

    const del = document.createElement('button');
    del.className = 'btn danger';
    del.textContent = 'Excluir';
    del.addEventListener('click', () => removeItem(it.id));

    right.appendChild(del);

    li.appendChild(cb);
    li.appendChild(p);
    li.appendChild(right);
    els.list.appendChild(li);
  }
}

// Actions
function addItem(title){
  state.items.push({ id: uid(), title: title.trim(), done: false, createdAt: Date.now() });
  save(); render();
}
function toggleDone(id){
  const it = state.items.find(x => x.id === id);
  if(it){ it.done = !it.done; save(); render(); }
}
function removeItem(id){
  state.items = state.items.filter(x => x.id !== id);
  save(); render();
}
function clearCompleted(){
  state.items = state.items.filter(x => !x.done);
  save(); render();
}
function setFilter(value){
  state.filter = value;
  document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b.dataset.filter === value));
  render();
}

// Bindings
els.addBtn.addEventListener('click', () => {
  if(els.input.value.trim() !== ''){
    addItem(els.input.value);
    els.input.value = '';
    els.input.focus();
  }
});
els.input.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && els.input.value.trim() !== ''){
    addItem(els.input.value);
    els.input.value = '';
  }
});
els.filters.forEach(btn => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));
els.clearCompleted.addEventListener('click', clearCompleted);

// Init
load();
render();
