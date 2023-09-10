document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage when the page loads
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to render tasks from local storage
    function renderTasks() {
        taskList.innerHTML = '';
        savedTasks.forEach(function (taskObject, index) {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <label>
                    <input type="checkbox" id="task${index}" ${taskObject.done ? 'checked' : ''}>
                    ${taskObject.text}
                </label>
                <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
            `;
            taskList.appendChild(taskItem);

            // Attach a click event to the delete button
            taskItem.querySelector('.delete').addEventListener('click', function () {
                savedTasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(savedTasks));
                renderTasks();
            });

            // Attach a change event to the checkbox
            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', function () {
                taskObject.done = checkbox.checked;
                localStorage.setItem('tasks', JSON.stringify(savedTasks));
            });
        });
    }

    // Load and render tasks
    renderTasks();

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            savedTasks.push({ text: taskText, done: false });
            localStorage.setItem('tasks', JSON.stringify(savedTasks));
            renderTasks();
            taskInput.value = '';
        }
    }

    // Add a new task when the "Add" button is clicked
    addTaskButton.addEventListener('click', addTask);

    // Add a new task when the Enter key is pressed in the input field
    taskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
});
