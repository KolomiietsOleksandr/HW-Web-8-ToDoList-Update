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
const sortAscendingButton = document.getElementById('sort-ascending');
const sortDescendingButton = document.getElementById('sort-descending');
const clearStorageButton = document.getElementById('clear-storage');

iconFileContainer.style.display = 'none';

premiumTaskCheckbox.addEventListener('change', function () {
    if (premiumTaskCheckbox.checked) {
        iconFileContainer.style.display = 'block';
    } else {
        iconFileContainer.style.display = 'none';
        iconFileInput.value = '';
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const date = new Date().toLocaleString();
    let todoItem;

    if (premiumTaskCheckbox.checked && iconFileInput.files.length > 0) {
        const iconFile = iconFileInput.files[0];
        const iconUrl = URL.createObjectURL(iconFile);
        todoItem = new TodoItemPremium(taskText, date, iconUrl);
    } else {
        todoItem = new TodoItem(taskText, date);
    }

    const taskItem = document.createElement('li');
    taskItem.innerHTML = todoItem.display();

    taskList.prepend(taskItem);
    taskInput.value = '';
    iconFileInput.value = ''
    premiumTaskCheckbox.checked = false;
    updateEventListeners();

    saveTaskToLocalStorage(todoItem);
}

function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskData => {
        let todoItem;
        if (taskData.iconUrl) {
            todoItem = new TodoItemPremium(taskData.text, taskData.date, taskData.iconUrl);
        } else {
            todoItem = new TodoItem(taskData.text, taskData.date);
        }
        const taskItem = document.createElement('li');
        taskItem.innerHTML = todoItem.display();
        taskList.appendChild(taskItem);
    });
}

window.addEventListener('load', () => {
    loadTasksFromLocalStorage();
});

function updateTaskStatus(event) {
    const taskItem = event.target.parentElement;
    taskItem.classList.toggle('completed');
}

function deleteTask(event) {
    const taskItem = event.target.parentElement;
    taskList.removeChild(taskItem);

    removeFromLocalStorage(taskItem);
}

function removeFromLocalStorage(taskItem) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const textToDelete = taskItem.querySelector('span').textContent;
    const updatedTasks = tasks.filter(task => task.text !== textToDelete);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('.completed');
    completedTasks.forEach(task => {
        taskList.removeChild(task);
        removeFromLocalStorage(task);
    });
}

function clearAllTasks() {
    if (taskList.children.length > 0) {
        const confirmClear = confirm("Are you sure you want to remove all tasks?");
        if (confirmClear) {
            taskList.innerHTML = '';
            localStorage.removeItem('tasks');
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

taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

taskList.addEventListener('dblclick', function (event) {
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
            updateTaskInLocalStorage(taskItem, updatedTaskText);
        }
    }
});

function updateTaskInLocalStorage(taskItem, updatedText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const textToUpdate = taskItem.querySelector('span').textContent;
    const updatedTasks = tasks.map(task => {
        if (task.text === textToUpdate) {
            task.text = updatedText;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

sortAscendingButton.addEventListener('click', () => {
    sortTasks('asc');
});

sortDescendingButton.addEventListener('click', () => {
    sortTasks('desc');
});

function sortTasks(order) {
    const taskItems = Array.from(taskList.children);
    taskItems.sort((a, b) => {
        const dateA = new Date(a.querySelector('.date').textContent);
        const dateB = new Date(b.querySelector('.date').textContent);

        if (order === 'asc') {
            return dateA - dateB;
        } else if (order === 'desc') {
            return dateB - dateA;
        }
    });

    taskList.innerHTML = '';
    taskItems.forEach(item => {
        taskList.appendChild(item);
    });
}

clearCompletedButton.addEventListener('click', clearCompletedTasks);
clearAllButton.addEventListener('click', clearAllTasks);

clearStorageButton.addEventListener('click', () => {
    const confirmClear = confirm("Are you sure you want to clear all saved tasks?");
    if (confirmClear) {
        localStorage.removeItem('tasks');
        taskList.innerHTML = '';
    }
});
