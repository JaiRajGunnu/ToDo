document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const allDiv = document.querySelector('.a');
    const doneDiv = document.querySelector('.b');
    const pendingDiv = document.querySelector('.c');
    const pendingCount = document.getElementById('pendingCount');

    function getFormattedDateTime(date, time) {
        if (date === 'N/A' && time === 'N/A') {
            return 'N/A';
        }
        const dateObj = new Date(`${date}T${time}`);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const hours24 = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const ampm = hours24 >= 12 ? 'PM' : 'AM';
        const hours12 = hours24 % 12;
        const formattedHours = hours12 ? hours12 : 00; // Handle midnight case
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${day} ${month}, ${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const defaultTasks = [
        { text: 'Web Dev', done: false, dateTime: 'N/A', default: true },
    ];

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

        updatePendingCount();
    }

    function createTaskElement(taskObject, index) {
        const taskItem = document.createElement('li');

        const letterMap = {
            'Web Dev': 'S'
        };

        const letter = letterMap[taskObject.text] || '';

        taskItem.innerHTML = `
            <label>
                <input type="checkbox" id="task${index}" ${taskObject.done ? 'checked' : ''}>
                ${taskObject.text}
            </label>
            <div class="task-date">${taskObject.dateTime}</div>
            ${taskObject.default ? `<span class="letter-day">${letter}</span>` : ''}
            ${taskObject.default ? '' : `<button class="delete"><i class="fa-solid fa-trash-can"></i></button>`}
        `;

        if (!taskObject.default) {
            const deleteButton = taskItem.querySelector('.delete');
            deleteButton.addEventListener('click', function () {
                const confirmDelete = confirm('Are you sure you want to delete this task?');
                if (confirmDelete) {
                    savedTasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(savedTasks));
                    renderTasks('all');
                }
            });
        }

        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function () {
            const message = checkbox.checked ? 'completed' : 'incomplete';
            const confirmStatusChange = confirm(`Are you sure you want to mark this task as ${message}?`);
            if (confirmStatusChange) {
                taskObject.done = checkbox.checked;
                localStorage.setItem('tasks', JSON.stringify(savedTasks));
                renderTasks('all');
            } else {
                checkbox.checked = !checkbox.checked;
            }
        });

        return taskItem;
    }

    defaultTasks.forEach((defaultTask) => {
        const taskExists = savedTasks.some((task) => task.text === defaultTask.text);
        if (!taskExists) {
            savedTasks.push(defaultTask);
        }
    });

    renderTasks('all');

    function showPopup(message) {
        popup.innerHTML = `<p>${message}</p>`;
        popup.style.display = 'flex';
        popup.style.flexDirection = 'row';
        overlay.style.display = 'block';

        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 5000);
    }

    addTaskButton.addEventListener('click', function () {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Please add at least one task.');
        } else {
            showTaskFormPopup();
        }
    });

    taskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            addTaskButton.click(); // Simulate a click on the addTaskButton
        }
    });

    function showTaskFormPopup() {
        popup.innerHTML = `
            <div class="task-container">
                <h2 class="title">Add Extras</h2>
                <div class="daytime">
                    <label for="popupDateInput" class="label">Date :</label>
                    <input type="date" id="popupDateInput" class="input-field" />
                    <label for="popupTimeInput" class="label">Time :</label>
                    <input type="time" id="popupTimeInput" class="input-field" />
                </div>
                <div class="button-group">
                    <button id="saveTaskButton" class="btn btn-save">Save</button>
                    <button id="cancelButton" class="btn btn-cancel">Cancel</button>
                </div>
            </div>
        `;
    
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        overlay.style.display = 'block';

        document.getElementById('saveTaskButton').addEventListener('click', function () {
            addTaskFromPopup();
        });
    
        document.getElementById('cancelButton').addEventListener('click', function () {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        });
    }
    
    function addTaskFromPopup() {
        const taskDate = document.getElementById('popupDateInput').value || 'N/A';
        const taskTime = document.getElementById('popupTimeInput').value || 'N/A';
    
        const taskText = taskInput.value.trim(); // Use the main input field for task description
    
        if (taskText === '') {
            alert('Please add at least one task.');
        } else {
            const formattedDateTime = getFormattedDateTime(taskDate, taskTime);
            savedTasks.push({ text: taskText, done: false, dateTime: formattedDateTime, deletable: true });
            localStorage.setItem('tasks', JSON.stringify(savedTasks));
            renderTasks('all');
            popup.style.display = 'none';
            overlay.style.display = 'none';
            taskInput.value = '';
        }
    }
    
    function updatePendingCount() {
        const pendingTasks = savedTasks.filter(task => !task.done);
        pendingCount.textContent = pendingTasks.length;
    }

    allDiv.addEventListener('click', function () {
        setActiveFilter('all');
        renderTasks('all');
    });

    doneDiv.addEventListener('click', function () {
        setActiveFilter('done');
        renderTasks('done');
    });

    pendingDiv.addEventListener('click', function () {
        setActiveFilter('pending');
        renderTasks('pending');
    });

    function setActiveFilter(filter) {
        allDiv.classList.remove('active');
        doneDiv.classList.remove('active');
        pendingDiv.classList.remove('active');
    
        if (filter === 'all') {
            allDiv.classList.add('active');
        } else if (filter === 'done') {
            doneDiv.classList.add('active');
        } else if (filter === 'pending') {
            pendingDiv.classList.add('active');
        }
    }

    // Set the initial active filter to 'all'
    setActiveFilter('all');
});
