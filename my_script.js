let taskList = document.getElementById('task-list');
let totalItems = document.getElementById('total-items');
let tasks = [];

// functia de add task, daca nu avem text, nu introducem nimic
function generateTask(text, isCompleted) {
    if (text === '')
        return;
    let task = document.createElement('li');
    let taskText = document.createElement('span');
    let taskImage = document.createElement('img');

    taskText.innerText = text;

    if (isCompleted) {
        taskImage.src = 'checked.png';
        task.classList.add('checked');
    }
    else
        taskImage.src = 'unchecked.png';

    taskImage.width = 15, taskImage.height = 15;

    task.appendChild(taskImage);
    task.appendChild(taskText);
    task.classList.add('task-item');

    createButtons(task);

    taskList.appendChild(task);
    tasks.push(task);
    updateTotalItems();
}

function updateTotalItems() {
    totalItems.innerText = "Total tasks: " + tasks.length;
    localStorage.setItem('totalItems', tasks.length);
};

function createButtons(task) {
    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', () => {
        taskList.removeChild(task);
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i] === task) {
                tasks.splice(i, 1);
                updateTotalItems();
                break;
            }
        }
    });


    task.appendChild(deleteButton);

    let editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
        let taskText = task.children[1];
        let taskInput = document.createElement('input');
        taskInput.value = taskText.innerText;
        taskText.innerText = ''; // sa dispara textul task ului atunci cand il introduc pe cel nou
        taskText.appendChild(taskInput);

        taskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                taskText.innerText = taskInput.value;
            }
        });
    });

    task.appendChild(editButton);
};


let form = document.getElementById('tasks');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let taskInput = document.getElementById('input-task');
    let taskText = taskInput.value;
    taskInput.value = '';
    generateTask(taskText, false);
});

taskList.addEventListener('click', (event) => {
    if (event.target.classList.contains('task-item')) {
        event.target.classList.toggle('checked');
        if (event.target.classList.contains('checked'))
            event.target.firstElementChild.src = 'checked.png';
        else
            event.target.firstElementChild.src = 'unchecked.png';
    }
});


// buttons
let all = document.getElementById('all');
all.addEventListener('click', () => {
    for (let task of tasks) {
        task.style.display = 'flex';
    }
});


let active = document.getElementById('active');
active.addEventListener('click', () => {
    for (let task of tasks) {
        if (task.classList.contains('checked'))
            task.style.display = 'none';
        else
            task.style.display = 'flex';
    }
});

let completed = document.getElementById('completed');
completed.addEventListener('click', function (event) {
    for (let task of tasks) {
        if (task.classList.contains('checked'))
            task.style.display = 'flex';
        else
            task.style.display = 'none';
    }
});

let clearcompleted = document.getElementById('clear-completed');
clearcompleted.addEventListener('click', () => {
    let newTasks = [];
    for (let task of tasks) {
        if (!task.classList.contains('checked'))
            newTasks.push(task);
    }
    tasks = newTasks;
    taskList.innerHTML = '';
    updateTotalItems();
});

let check_all = document.getElementById('check-all');
check_all.addEventListener('click', () => {
    for (let task of tasks) {
        task.classList.add('checked');
    }
});


function saveTasks() {
    const tasksToSave = [];
    // save the tasks but ignore the delete button
    for (let task of tasks) {
        tasksToSave.push({
            text: task.children[1].innerText,
            isCompleted: task.classList.contains('checked')
        });
    }
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
};


function loadTasks() {
    const tasksToLoad = JSON.parse(localStorage.getItem('tasks'));
    if (tasksToLoad === null)
        return;
    for (let task of tasksToLoad) {
        generateTask(task.text, task.isCompleted);
    }
    updateTotalItems();
};

window.addEventListener('unload', saveTasks);
window.addEventListener('load', loadTasks);


taskList.addEventListener('click', (event) => {
    if (event.target.tagName === "IMG") {
        console.log("intru aici");
        event.target.parentNode.classList.toggle('checked');
        if (event.target.classList.contains('checked'))
            event.target.src = 'checked.png';
        else
            event.target.src = 'unchecked.png';
    }
});