const form = document.querySelector('form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

let tasks = [];

loadEventListeners();

function loadEventListeners() {
  form.addEventListener('submit', addTask);
  clearBtn.addEventListener('click', removeAllTasks);
  taskList.addEventListener('click', handleTaskActions);
  filter.addEventListener('keyup', filterTask);
  document.addEventListener('DOMContentLoaded', getTasks);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getTasks() {
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(task => {
    renderTask(task);
  });
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'collection-item';
  li.dataset.taskId = task.id;

  const taskHeader = document.createElement('div');
  taskHeader.className = 'task-header';

  const taskTitle = document.createElement('div');
  taskTitle.className = 'task-title';

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  if (hasSubtasks) {
    taskTitle.style.cursor = 'pointer';
    const arrow = document.createElement('span');
    arrow.className = 'toggle-arrow collapsed';
    arrow.innerHTML = '▼';
    arrow.style.cursor = 'pointer';
    taskTitle.appendChild(arrow);

    taskTitle.addEventListener('click', () => {
      toggleSubtasks(task.id, arrow, subtaskContainer);
    });
  }

  const titleText = document.createElement('span');
  titleText.textContent = task.title;
  taskTitle.appendChild(titleText);

  const actions = document.createElement('div');
  actions.className = 'btn-actions secondary-content';

  const addSubtaskBtn = document.createElement('button');
  addSubtaskBtn.className = 'btn btn-small red';
  addSubtaskBtn.innerHTML = '<i class="fa fa-plus"></i>';
  addSubtaskBtn.dataset.taskId = task.id;
  addSubtaskBtn.style.marginRight = '5px';
  addSubtaskBtn.title = 'Add Sub-task';

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn btn-small orange';
  removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
  removeBtn.dataset.taskId = task.id;
  removeBtn.style.marginRight = '5px';
  removeBtn.title = 'Remove Task';

  actions.appendChild(addSubtaskBtn);
  actions.appendChild(removeBtn);

  taskHeader.appendChild(taskTitle);
  taskHeader.appendChild(actions);

  li.appendChild(taskHeader);

  const subtaskContainer = document.createElement('div');
  subtaskContainer.className = 'subtask-container';
  subtaskContainer.dataset.taskId = task.id;

  if (task.subtasks && task.subtasks.length > 0) {
    const subtaskList = document.createElement('ul');
    subtaskList.className = 'subtask-list';

    task.subtasks.forEach(subtask => {
      const subtaskItem = document.createElement('li');
      subtaskItem.className = 'subtask-item';
      subtaskItem.dataset.subtaskId = subtask.id;

      const subtaskText = document.createElement('span');
      subtaskText.textContent = subtask.title;

      const subtaskActions = document.createElement('div');
      subtaskActions.className = 'subtask-actions';

      const removeSubtaskBtn = document.createElement('button');
      removeSubtaskBtn.className = 'btn btn-small orange';
      removeSubtaskBtn.innerHTML = '<i class="fa fa-trash"></i>';
      removeSubtaskBtn.setAttribute('data-task-id', task.id);
      removeSubtaskBtn.setAttribute('data-subtask-id', subtask.id);
      removeSubtaskBtn.title = 'Remove Sub-task';

      subtaskActions.appendChild(removeSubtaskBtn);

      subtaskItem.appendChild(subtaskText);
      subtaskItem.appendChild(subtaskActions);
      subtaskList.appendChild(subtaskItem);
    });

    subtaskContainer.appendChild(subtaskList);
  }

  const addSubtaskForm = document.createElement('div');
  addSubtaskForm.className = 'add-subtask-form';
  addSubtaskForm.setAttribute('data-task-id', task.id);

  const subtaskInput = document.createElement('input');
  subtaskInput.type = 'text';
  subtaskInput.placeholder = 'Add sub-task...';
  subtaskInput.className = 'subtask-input';
  subtaskInput.dataset.taskId = task.id;

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-small';
  submitBtn.innerHTML = '<i class="fa fa-plus"></i>';
  submitBtn.dataset.taskId = task.id;
  submitBtn.style.marginTop = '5px';
  submitBtn.title = 'Add Sub-task';

  addSubtaskForm.appendChild(subtaskInput);
  addSubtaskForm.appendChild(submitBtn);

  li.appendChild(subtaskContainer);
  li.appendChild(addSubtaskForm);

  taskList.appendChild(li);

  addSubtaskBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleAddSubtaskForm(task.id);
  });

  removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    removeTask(task.id);
  });

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const input = addSubtaskForm.querySelector('.subtask-input');
    if (input.value.trim()) {
      addSubtask(task.id, input.value);
      input.value = '';
    }
  });

  const removeSubtaskBtns = li.querySelectorAll('button[data-subtask-id]');
  removeSubtaskBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      removeSubtask(btn.getAttribute('data-task-id'), btn.getAttribute('data-subtask-id'));
    });
  });
}

function toggleSubtasks(taskId, arrow, container) {
  container.classList.toggle('show');
  arrow.classList.toggle('collapsed');
}

function toggleAddSubtaskForm(taskId) {
  const form = document.querySelector(`.add-subtask-form[data-task-id="${taskId}"]`);
  if (form) {
    form.classList.toggle('show');
    const input = form.querySelector('.subtask-input');
    if (input) input.focus();
  }
}

function addTask(e) {
  e.preventDefault();
  if (taskInput.value === '') {
    alert('Add a task');
    return;
  }

  const newTask = {
    id: generateId(),
    title: taskInput.value,
    subtasks: []
  };

  tasks.push(newTask);
  storeTasksInLocalStorage();

  renderTask(newTask);

  taskInput.value = '';
}

function addSubtask(taskId, subtaskTitle) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    const newSubtask = {
      id: generateId(),
      title: subtaskTitle
    };
    task.subtasks.push(newSubtask);
    storeTasksInLocalStorage();

    const li = document.querySelector(`[data-task-id="${taskId}"]`);
    if (li) {
      li.remove();
      renderTask(task);
    }
  }
}

function removeSubtask(taskId, subtaskId) {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    storeTasksInLocalStorage();

    const li = document.querySelector(`[data-task-id="${taskId}"]`);
    if (li) {
      li.remove();
      renderTask(task);
    }
  }
}

function storeTasksInLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeAllTasks() {
  if (confirm('Remove all tasks?')) {
    tasks = [];
    taskList.innerHTML = '';
    storeTasksInLocalStorage();
  }
}

function handleTaskActions(e) {
  const deleteIcon = e.target.closest('.delete-item');
  if (deleteIcon) {
    const taskId = deleteIcon.dataset.taskId;
    removeTask(taskId);
  }
}

function removeTask(taskId) {
  if (confirm('Remove this task?')) {
    tasks = tasks.filter(t => t.id !== taskId);
    storeTasksInLocalStorage();

    const li = document.querySelector(`[data-task-id="${taskId}"]`);
    if (li) li.remove();
  }
}

function filterTask(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.collection-item').forEach(task => {
    const titleText = task.querySelector('.task-title span:nth-child(2)');
    if (titleText) {
      const item = titleText.textContent;
      if (item.toLowerCase().indexOf(text) !== -1) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    }
  });
}
