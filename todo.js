// Helper functions
const getCurrentDateTime = () => {
    const now = new Date();
    const padZero = (number) => (number < 10 ? '0' : '') + number;
    const day = padZero(now.getDate());
    const month = padZero(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());
    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
};

// Array to store task IDs
let taskIds = [];

const renderTask = (taskId, taskObj) => {
    const taskList = document.getElementById('task-list');
    const task = document.createElement('li');
    task.classList.add('task');
    task.id = taskId;

    // Heading
    const taskHeading = document.createElement('h1');
    taskHeading.textContent = taskObj.heading;

    // Details
    const taskDetails = document.createElement('p');
    taskDetails.textContent = taskObj.details;
    taskDetails.classList.add("hidden");

    // Task operations
    const taskOperations = document.createElement('div');
    taskOperations.classList.add("task-operations");

    // Task status button
    const statusBtn = document.createElement('button');
    statusBtn.classList.add("task-status");

    if (taskObj.completed) {
        statusBtn.style.backgroundColor = 'green';
        //creating a check icon and appending it to heading
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("height", "20");
        svgElement.setAttribute("width", "20");
        svgElement.setAttribute("viewBox", "0 0 512 512");

        // Create path element
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("fill", "#228000");
        pathElement.setAttribute("d", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z");

        // Append path element to SVG element
        svgElement.appendChild(pathElement);

        taskHeading.appendChild(svgElement);
    }

    statusBtn.innerText = taskObj.completed ? 'Undo' : 'Done';
    statusBtn.addEventListener('click', () => {
        taskObj.completed = !taskObj.completed;
        localStorage.setItem(taskId, JSON.stringify(taskObj));
        renderTasks();
    });

    // Delete button
    const deleteBtn = document.createElement('img');
    deleteBtn.classList.add('delete');
    deleteBtn.src = 'delete-svgrepo-com.svg';
    deleteBtn.alt = 'delete task';
    deleteBtn.addEventListener('click', () => {
        localStorage.removeItem(taskId);
        // Remove taskId from taskIds array
        taskIds = taskIds.filter(id => id !== taskId);
        task.remove();
    });

    // Show details button
    const showDetailsBtn = document.createElement('button');
    showDetailsBtn.innerText = 'show details';
    showDetailsBtn.addEventListener('click', () => {
        showDetailsBtn.innerText = showDetailsBtn.innerText === 'show details' ? 'Hide details' : 'show details';
        taskDetails.classList.toggle('hidden');
    });

    //edit button
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.addEventListener('click', () => {
        const editHeading = document.getElementById('task-heading');
        editHeading.value = taskObj.heading;
        const editDetails = document.getElementById('task-details');
        editDetails.value = taskObj.details;
        const editFormBtn = document.createElement('button');
        editFormBtn.innerText = "Edit";
        const formBtns = document.getElementById('form-buttons');
        formBtns.append(editFormBtn);
        editBtn.disabled = true;
        editFormBtn.addEventListener('click',()=>{
            taskObj.heading = editHeading.value;
            taskObj.details = editDetails.value;
            editHeading.value='';
            editDetails.value='';
            editBtn.disabled=false;
            saveTask(taskId,taskObj);
            renderTasks();
            editFormBtn.remove();
        })
    })

    // Appending to task-operations
    taskOperations.append(statusBtn, deleteBtn, showDetailsBtn,editBtn);

    // Appending to task
    task.append(taskHeading, taskDetails, taskOperations);

    // Appending to task list
    taskList.appendChild(task);
};

const renderTasks = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing tasks

    // Loop through taskIds array to maintain order
    taskIds.forEach(taskId => {
        const taskObj = JSON.parse(localStorage.getItem(taskId));
        renderTask(taskId, taskObj);
    });
};

const saveTask = (taskId, taskObj) => {
    localStorage.setItem(taskId, JSON.stringify(taskObj));
    // Add taskId to taskIds array if it's not already present
    if (!taskIds.includes(taskId)) {
        taskIds.push(taskId);
    }
};

// Document ready function
document.addEventListener('DOMContentLoaded', () => {
    // Initialize taskIds array with keys from localStorage
    taskIds = Object.keys(localStorage);

    const taskHeadingInput = document.getElementById('task-heading');
    const taskDetailsInput = document.getElementById('task-details');
    const createTaskButton = document.getElementById('create');
    const resetBtn = document.getElementById('reset');

    renderTasks(); // Initial render

    // Create task button
    createTaskButton.addEventListener('click', () => {
        const headingInput = taskHeadingInput.value.trim();
        const detailsInput = taskDetailsInput.value.trim();

        if (headingInput && detailsInput) {
            const taskId = getCurrentDateTime();
            const taskObj = {
                heading: headingInput,
                details: detailsInput,
                completed: false
            };

            saveTask(taskId, taskObj); 
            renderTask(taskId, taskObj); 
            taskHeadingInput.value = ''; 
            taskDetailsInput.value = ''; 
        }
    });

    resetBtn.addEventListener('click', () => {
        taskHeadingInput.value = '';
        taskDetailsInput.value = '';
    });
});

