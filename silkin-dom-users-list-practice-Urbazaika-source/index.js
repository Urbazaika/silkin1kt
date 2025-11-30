let userId = 1;
const userNameInput = document.getElementById('user-name');
const addUserBtn = document.getElementById('add-user');
const userList = document.getElementById('user-list');
const filterAllBtn = document.getElementById('filter-all');
const filterSelectedBtn = document.getElementById('filter-selected');
let currentFilter = 'all';

addUserBtn.addEventListener('click', () => {
  const name = userNameInput.value.trim();
  if (name) {
    addUser(name);
    userNameInput.value = '';
    userNameInput.focus();
  }
});

userNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addUserBtn.click(); 
  }
});

filterAllBtn.addEventListener('click', () => {
  currentFilter = 'all';
  applyFilter();
});

filterSelectedBtn.addEventListener('click', () => {
  currentFilter = 'selected';
  applyFilter();
});


function addUser(name) {
  const li = document.createElement('li');
  li.className = 'user-item';
  li.dataset.id = userId;

  li.innerHTML = `
    <span class="user-name">${name}</span>
    <div class="user-actions">
      <button class="btn-edit">Редактировать</button>
      <button class="btn-delete">Удалить</button>
    </div>
  `;

  li.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      li.classList.toggle('selected');
      applyFilter(); 
    }
  });

  li.querySelector('.btn-delete').addEventListener('click', () => {
    li.remove();
    updateEmptyHint();
    applyFilter();
  });

  li.querySelector('.btn-edit').addEventListener('click', () => {
    const span = li.querySelector('.user-name');
    const oldText = span.textContent;

    span.contentEditable = true;
    span.focus();

    const range = document.createRange();
    range.selectNodeContents(span);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finishEditing(true);
      } else if (e.key === 'Escape') {
        finishEditing(false);
      }
    };

    const finishEditing = (save) => {
      span.contentEditable = false;
      span.blur();

      if (save) {
        const newText = span.textContent.trim();
        span.textContent = newText || oldText; 
      } else {
        span.textContent = oldText;
      }
      document.removeEventListener('keydown', onKeyDown);
    };

    document.addEventListener('keydown', onKeyDown);
  });

  userList.appendChild(li);
  userId++;
  updateEmptyHint();
  applyFilter(); 
}

function applyFilter() {
  const items = document.querySelectorAll('.user-item');
  items.forEach(item => {
    if (currentFilter === 'selected') {
      item.style.display = item.classList.contains('selected') ? '' : 'none';
    } else {
      item.style.display = '';
    }
  });
  updateEmptyHint();
}

function updateEmptyHint() {
  const visibleCount = Array.from(userList.children).filter(li =>
    li.style.display !== 'none'
  ).length;

  const hint = document.querySelector('.empty-hint');

  if (visibleCount === 0) {
    if (!hint) {
      const p = document.createElement('p');
      p.className = 'empty-hint';
      p.textContent = 'Список пуст. Добавьте первого пользователя.';
      userList.after(p); 
    }
  } else {
    if (hint) hint.remove();
  }
}

updateEmptyHint();