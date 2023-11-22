/** @typedef {{ id: number; completed: boolean; text: string; }} Task */

/** @type Task[] */
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const input = document.querySelector('.todo-input > input');
const createdCount = document.querySelector('.created-tasks > .count');
const completedCount = document.querySelector('.completed-tasks > .count');

input.addEventListener('keypress', (event) => {
  // Create a todo if the key is Enter
  if (event.key === 'Enter') {
    event.preventDefault();
    createNewTodo();
  }
});

/**
 * Updates the state of the UI to reflect the current state of the tasks
 * @param {boolean} [cleanInput = true] - Whether or not to clean the input
 */
function updateStates(cleanInput = true) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  if (cleanInput) input.value = '';

  createdCount.textContent = tasks.length;
  completedCount.textContent = `${tasks.filter((task) => task.completed).length} of ${tasks.length}`;
}

/** Creates a new todo. If there are no text to add nothing happens */
function createNewTodo() {
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({
    id: tasks[0]?.id + 1 || 1,
    completed: false,
    text: text,
  });

  updateStates();
  renderTasks();
}

/** Renders the tasks to be displayed on the page */
function renderTasks() {
  let activeMarkup = '';
  let completedMarkup = '';

  for (const task of tasks) {
    // Generate the markup for the task.
    if (!task.completed) {
      activeMarkup += `
        <div class="task">
          <div>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="completeTask(this, ${task.id})">
            <p class="task-description">${task.text}</p>
          </div>
          <button class="delete-button" onclick="removeTask(${task.id})"></button>
        </div>
      `;
    } else {
      completedMarkup += `
        <div class="task">
          <div>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="completeTask(this, ${task.id})">
            <p class="task-description">${task.text}</p>
          </div>
          <button class="delete-button" onclick="removeTask(${task.id})"></button>
        </div>
      `;
    }
  }

  document.querySelector('.tasks-container').innerHTML =
    activeMarkup ||
    `<div class="no-tasks">
      <img src="images/clipboard.png" alt="">
      <p>
        <b>You don't have any tasks registered yet</b>
        <br>
        Create tasks and organise your to-do items
      </p>
    </div>`;

  const completedContainer = document.querySelector('.completed-tasks-container');

  // If completedMarkup is not empty then the completed container is visible
  if (completedContainer.style.visibility != 'visible' && completedMarkup !== '') {
    completedContainer.style.visibility = 'visible';
  } else if (completedMarkup === '') {
    completedContainer.style.visibility = 'hidden';
  }

  completedContainer.querySelector('.tasks-container').innerHTML = completedMarkup;
}

/**
 * Removes a task from the list of tasks
 * @param {number} taskID - Unique identifier of the task in the tasks array
 */
function removeTask(taskID) {
  tasks = tasks.filter((task) => task.id != taskID);

  updateStates(false);
  renderTasks();
}

/**
 * Mark a task as completed. This is called when the user toggles the complete checkbox on or off
 *
 * @param {HTMLInputElement} checkbox - The checkbox that was toggled
 * @param {number} taskID - Unique identifier of the task in the tasks array
 */
function completeTask(checkbox, taskID) {
  const task = tasks.find((task) => task.id == taskID);
  task.completed = checkbox.checked;

  renderTasks();
  updateStates(false);
}

document.getElementById('create-task-button').addEventListener('click', createNewTodo);

document.addEventListener('DOMContentLoaded', () => {
  updateStates();
  renderTasks();
});
