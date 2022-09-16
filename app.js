const form = document.querySelector('form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');


loadEventListeners();

function loadEventListeners() {
  form.addEventListener('submit', addTask);
  clearBtn.addEventListener('click', removeAllTasks);
  taskList.addEventListener('click', removeTask);
  filter.addEventListener('keyup', filterTask);
  document.addEventListener('DOMContentLoaded', getTasks);
}

function getTasks() {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'collection-item';
    const createText = document.createTextNode(task);
    li.appendChild(createText);

    const link = document.createElement('a');
    link.className = 'delete-item secondary-content';
    link.innerHTML = '<i class="fa fa-remove"></i>';
    li.appendChild(link)

    taskList.appendChild(li)
  });

}

function addTask(e) {
  if (taskInput.value === '') {
    alert('Add a task')
  }
  const li = document.createElement('li');
  li.className = 'collection-item';
  const createText = document.createTextNode(taskInput.value);
  li.appendChild(createText);

  const link = document.createElement('a');
  link.className = 'delete-item secondary-content';
  link.innerHTML = '<i class="fa fa-remove"></i>';
  li.appendChild(link)

  taskList.appendChild(li)

  storeTaskInLocalStorage(taskInput.value);

  taskInput.value = '';
  e.preventDefault();
}

function storeTaskInLocalStorage(task) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

}

function removeAllTasks() {
  taskList.remove();
  clearAllTasksFromLocalStorage();
}

function clearAllTasksFromLocalStorage() {
  localStorage.clear();
  location.reload();
}

function removeTask(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    if (confirm("Are you sure?")) {
      e.target.parentElement.parentElement.remove();
    }
  }
  removeTaskFromLocalStorage(e.target.parentElement.parentElement);
}

function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach((task, index) => {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  })

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function filterTask(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll('.collection-item').forEach(
    task => {
      const item = task.firstChild.textContent;
      if (item.toLowerCase().indexOf(text) != -1) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    }
  )
  console.log(text)
}




