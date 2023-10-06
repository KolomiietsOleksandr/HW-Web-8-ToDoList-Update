// Parent class TodoItem
class TodoItem {
    constructor(text, date) {
        this.text = text;
        this.date = date;
    }

    display() {
        return `
            <input type="checkbox">
            <span>${this.text}</span>
            <span class="date">${this.date}</span>
            <button class="delete">Delete</button>
        `;
    }
}

// Child class TodoItemPremium that extends TodoItem
class TodoItemPremium extends TodoItem {
    constructor(text, date, iconUrl) {
        super(text, date);
        this.iconUrl = iconUrl;
    }

    display() {
        return `
            <input type="checkbox">
            <span>${this.text}</span>
            <span class="date">${this.date}</span>
            <img src="${this.iconUrl}" alt="Icon" class="icon">
            <button class="delete">Delete</button>
        `;
    }
}

const taskInput = document.getElementById('task');
const premiumTaskCheckbox = document.getElementById('premiumTask');
const iconFileContainer = document.getElementById('iconFileContainer');
const iconFileInput = document.getElementById('iconFile');
const taskList = document.getElementById('task-list');
const clearCompletedButton = document.getElementById('clear-completed');
const clearAllButton = document.getElementById('clear-all');

// Initially hide the icon upload field
iconFileContainer.style.display = 'none';

// Add an event listener to check the premium task checkbox
premiumTaskCheckbox.addEventListener('change', function () {
    if (premiumTaskCheckbox.checked) {
        // Show the icon upload field when the checkbox is checked
        iconFileContainer.style.display = 'block';
    } else {
        // Hide the icon upload field when the checkbox is unchecked
        iconFileContainer.style.display = 'none';
        // Clear the value of the icon upload input
        iconFileInput.value = '';
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const date = new Date().toLocaleString();
    let todoItem;

    if (premiumTaskCheckbox.checked && iconFileInput.files.length > 0) {
        // Premium task with a checked checkbox and uploaded icon
        const iconFile = iconFileInput.files[0];
        const iconUrl = URL.createObjectURL(iconFile);
        todoItem = new TodoItemPremium(taskText, date, iconUrl);
    } else {
        // Regular task or premium task without a checked checkbox or uploaded icon
        todoItem = new TodoItem(taskText, date);
    }

    const taskItem = document.createElement('li');
    taskItem.innerHTML = todoItem.display();

    taskList.prepend(taskItem);
    taskInput.value = '';
    iconFileInput.value = ''; // Clear the icon upload input
    premiumTaskCheckbox.checked = false; // Uncheck the premium task checkbox
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
