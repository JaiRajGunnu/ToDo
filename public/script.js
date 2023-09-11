document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const popup = document.getElementById('popup');
    const allDiv = document.querySelector('.a'); // All div
    const doneDiv = document.querySelector('.b'); // Done div
    const pendingDiv = document.querySelector('.c'); // Pending div
    const messageDiv = document.createElement('div'); // Create message div

    // Function to get the formatted date and time
    function getFormattedDateTime() {
        const now = new Date();
        const date = now.getDate();
        const month = now.toLocaleString('default', { month: 'short' });
        const time = `${now.getHours()}:${(now.getMinutes() < 10 ? '0' : '') + now.getMinutes()}`;
        return `${date} ${month}, ${time}`;
    }

    // Load tasks from local storage when the page loads
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];


// Function to render tasks based on the filter
function renderTasks(filter) {
    taskList.innerHTML = '';

    const filteredTasks = savedTasks.filter(function (taskObject) {
        if (filter === 'all') {
            return true;
        } else if (filter === 'done') {
            return taskObject.done;
        } else if (filter === 'pending') {
            return !taskObject.done;
        }
    });

    if (filteredTasks.length === 0) {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.textContent = 'No tasks found.';
        noTasksMessage.style.textAlign = 'center'; 
        taskList.appendChild(noTasksMessage);
    } else {
        filteredTasks.forEach(function (taskObject, index) {
            const taskItem = createTaskElement(taskObject, index);
            taskList.appendChild(taskItem);
        });
    }
}



    // Function to create a task element
    function createTaskElement(taskObject, index) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <label>
                <input type="checkbox" id="task${index}" ${taskObject.done ? 'checked' : ''}>
                ${taskObject.text}
            </label>
            <div class="task-date">${taskObject.dateTime}</div> <!-- Display formatted date and time -->
            <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
        `;

        // Attach a click event to the delete button
        taskItem.querySelector('.delete').addEventListener('click', function () {
            // Show a confirmation dialog
            const confirmDelete = confirm('Are you sure you want to delete this task?');

            if (confirmDelete) {
                savedTasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(savedTasks));
                renderTasks('all'); // Re-render all tasks
            }
        });

        // Attach a change event to the checkbox
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function () {
            taskObject.done = checkbox.checked;
            localStorage.setItem('tasks', JSON.stringify(savedTasks));
            renderTasks('all'); // Re-render all tasks
        });

        return taskItem;
    }

    // Load and render all tasks initially
    renderTasks('all');

    // Function to show the popup with the specified message
    function showPopup(message) {
        popup.innerHTML = `<p>${message}</p>`;
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 5000); // Hide the popup after 5 seconds (adjust as needed)
    }

    // Add a new task when the "Add" button is clicked
    addTaskButton.addEventListener('click', function () {
        addTask();
    });

    // Add a new task when the Enter key is pressed in the input field
    taskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Automatically focus on the input field when the page loads
    taskInput.focus();

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const formattedDateTime = getFormattedDateTime(); // Get the formatted date and time
            savedTasks.push({ text: taskText, done: false, dateTime: formattedDateTime });
            localStorage.setItem('tasks', JSON.stringify(savedTasks));
            renderTasks('all'); // Re-render all tasks
            taskInput.value = '';
        } else {
            showPopup('Please enter a task in this To-do list.');
        }
    }

    // Event listener to display all tasks when "All" div is clicked
    allDiv.addEventListener('click', function () {
        renderTasks('all');
        allDiv.classList.add('active');
        doneDiv.classList.remove('active');
        pendingDiv.classList.remove('active');
    });

    // Event listener to display only checked tasks when "Done" div is clicked
    doneDiv.addEventListener('click', function () {
        renderTasks('done');
        allDiv.classList.remove('active');
        doneDiv.classList.add('active');
        pendingDiv.classList.remove('active');
    });

    // Event listener to display only unchecked tasks when "Pending" div is clicked
    pendingDiv.addEventListener('click', function () {
        renderTasks('pending');
        allDiv.classList.remove('active');
        doneDiv.classList.remove('active');
        pendingDiv.classList.add('active');
    });

    // Set "All" tab as active by default
    allDiv.click();

    // Append the message div to the task list
    taskList.appendChild(messageDiv);

    // Connect to the socket.io server
    const io = io();

    // Function to update tasks and emit the update to the server
    function updateTasks(updatedTasks) {
        io.emit('updateTasks', updatedTasks);
    }

    // Event listener to receive updated tasks from the server
    io.on('tasksUpdated', (updatedTasks) => {
        // Handle the updated tasks, e.g., render them on the client-side
        renderTasks(updatedTasks);
    });
});
