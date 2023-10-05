const taskInput = document.getElementById('task');
const taskList = document.getElementById('task-list');
const clearCompletedButton = document.getElementById('clear-completed');
const clearAllButton = document.getElementById('clear-all');

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = document.createElement('li');
    const date = new Date().toLocaleString();
    taskItem.innerHTML = `
        <input type="checkbox">
        <span>${taskText}</span>
        <span class="date">${date}</span>
        <button class="delete">Delete</button>
    `;

    taskList.prepend(taskItem);
    taskInput.value = '';
    updateEventListeners();
}

function updateTaskStatus(event) {
    const taskItem = event.target.parentElement;
    taskItem.classList.toggle('completed');
}

function deleteTask(event) {
    const taskItem = event.target.parentElement;
    taskList.removeChild(taskItem);
}

function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('.completed');
    completedTasks.forEach(task => taskList.removeChild(task));
}

function clearAllTasks() {
    if (taskList.children.length > 0) {
        const confirmClear = confirm("Are you sure you want to remove all tasks?");
        if (confirmClear) {
            taskList.innerHTML = '';
        }
    }
}

function updateEventListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const deleteButtons = document.querySelectorAll('.delete');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTaskStatus);
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteTask);
    });
}

taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('dblclick', function(event) {
    const taskItem = event.target.closest('li');
    if (!taskItem.classList.contains('completed')) {
        const updatedTaskText = prompt('Update task:', taskItem.innerText);
        if (updatedTaskText !== null) {
            const date = new Date().toLocaleString();
            taskItem.innerHTML = `
                <input type="checkbox">
                <span>${updatedTaskText}</span>
                <span class="date">${date}</span>
                <button class="delete">Delete</button>
            `;
            updateEventListeners();
        }
    }
});

clearCompletedButton.addEventListener('click', clearCompletedTasks);
clearAllButton.addEventListener('click', clearAllTasks);
