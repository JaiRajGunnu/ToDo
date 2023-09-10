document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    // Add a new task
    addTaskButton.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span>${taskText}</span>
                <button class="delete">Delete</button>
            `;
            taskList.appendChild(taskItem);
            taskInput.value = '';

            // Attach a click event to the delete button
            taskItem.querySelector('.delete').addEventListener('click', function () {
                taskItem.remove();
            });
        }
    });
});
