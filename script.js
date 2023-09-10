document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const popup = document.getElementById('popup');

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

    // Function to render tasks from local storage
    function renderTasks() {
        taskList.innerHTML = '';

        // Separate completed and incomplete tasks
        const completedTasks = [];
        const incompleteTasks = [];

        savedTasks.forEach(function (taskObject, index) {
            const taskItem = createTaskElement(taskObject, index);

            if (taskObject.done) {
                completedTasks.push(taskItem);
            } else {
                incompleteTasks.push(taskItem);
            }
        });

        // Concatenate incomplete tasks and completed tasks
        const allTasks = incompleteTasks.concat(completedTasks);

        // Append tasks to the task list
        allTasks.forEach(function (taskItem) {
            taskList.appendChild(taskItem);
        });
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
                renderTasks();
            }
        });

        // Attach a change event to the checkbox
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function () {
            taskObject.done = checkbox.checked;
            localStorage.setItem('tasks', JSON.stringify(savedTasks));
            renderTasks();
        });

        return taskItem;
    }

    // Load and render tasks
    renderTasks();

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
            renderTasks();
            taskInput.value = '';
        } else {
            showPopup('Please enter a task in this To-do list.');
        }
    }
});
