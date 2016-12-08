/**
 * Created by Marina on 21.11.2016.
 */

window.addEventListener('load', function () {
    show();

    function Task(taskValue, isChecked) {
        this.taskValue = taskValue;
        this.isChecked = isChecked;
    }

    function getTasks() {
        var tasks = new Array;
        var tasksJson = localStorage.getItem('todo');
        console.log(tasksJson);
        if (tasksJson != null) {
            tasks = JSON.parse(tasksJson);
        }
        return tasks;
    }

    function show() {
        var tasks = getTasks();
        var taskList = document.getElementById("todoList");
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        for (var i = 0; i < tasks.length; i++) {
            var li = document.createElement('li');
            li.id = i;
            li.dragged = 'true';
            li.addEventListener('dragstart', handleDragStart);
            li.addEventListener('dragenter', handleDragEnter);
            li.addEventListener('dragover', handleDragOver);
            li.addEventListener('dragleave', handleDragLeave);
            li.addEventListener('drop', handleDrop);
            li.addEventListener('dragend', handleDragEnd);
            console.log(tasks[i].isChecked==true);
            if(!tasks[i].isChecked) {
                li.innerHTML = '<p>' + tasks[i].taskValue + '</p>' +
                                '<button class="button-delete">✕</button><button class="button-edit">edit</button>';
            }
            else {
                li.innerHTML = '<p class="checked">' + tasks[i].taskValue + '</p>' +
                                '<button class="button-delete">✕</button><button class="button-edit">edit</button>';
            }
            li.addEventListener('click', checkTask);
            document.getElementById('todoList').appendChild(li);


        }
        var del = document.getElementsByClassName('button-delete');
        var edit = document.getElementsByClassName('button-edit');
        for (i = 0; i < del.length; i++) {
            del[i].addEventListener('click', deleteTask);
            edit[i].addEventListener('click', openEdit);
        }
        countTasks();
    }


    document.getElementById('addTask').addEventListener('click', toDoList);
    var btnEnter = document.getElementById('addTask');
    btnEnter.addEventListener('click', toDoList);
    var keyEnter = document.getElementById('todoInput');
    keyEnter.addEventListener('keypress', function pressEnter(event) {
        if (event.keyCode == 13) {
            toDoList();
        }
    });

    function toDoList() {
        var todo = getTasks();
        var item = document.getElementById('todoInput').value;
        if (item) {
            var task = new Task(item, false);
            todo.push(task);
        }
        localStorage.setItem('todo', JSON.stringify(todo));
        console.log(localStorage);
        document.getElementById("todoInput").value = "";
        show();
        countTasks();

    }

    function openEdit() {
        var tasks = getTasks();
        var div = document.createElement('div');
        var mainDiv = document.createElement('div');
        var input = document.createElement('input');
        var buttonSave = document.createElement('button');
        var buttonCancel = document.createElement('button');
        var li = event.target.parentElement;
        var id = li.getAttribute('id');
        div.id = 'edit';

        mainDiv.className = 'edit';
        buttonSave.textContent = 'save';
        buttonCancel.textContent = 'cancel';
        mainDiv.appendChild(div);
        div.appendChild(input);
        div.appendChild(buttonSave);
        div.appendChild(buttonCancel);
        document.body.appendChild(mainDiv);
        input.value = li.getElementsByTagName('p')[0].innerHTML;
        buttonCancel.addEventListener('click', function (event) {
            var div = event.target.parentNode;
            div = div.parentNode;
            div.parentNode.removeChild(div);
        });
        buttonSave.addEventListener('click', function (event) {
            var div = event.target.parentNode;
            var input = div.querySelector('input');
            tasks[id].taskValue = input.value;
            localStorage.setItem('todo', JSON.stringify(tasks));
            div = div.parentNode;
            div.parentNode.removeChild(div);
            show();
        });

    }

    function deleteTask() {
        var id = this.parentNode.getAttribute('id');
        var tasks = getTasks();
        tasks.splice(id, 1);
        localStorage.setItem('todo', JSON.stringify(tasks));
        show();
        countTasks();
    }

    function checkTask(ev) {
        var tasks = getTasks();
        var id = ev.target;
        id = id.parentNode.id;
        if (ev.target.tagName == 'P') {
            ev.target.classList.toggle('checked');
            console.log(ev.target.className);
            if(ev.target.className == 'checked'){
                tasks[id].isChecked = 'true';
            }
            else {
                tasks[id].isChecked = false;
            }
            localStorage.setItem('todo', JSON.stringify(tasks));
            countTasks();
        }
    }

    function countTasks() {
        var allTasks = document.getElementsByTagName('li');
        var checkedTasks = document.getElementsByClassName('checked');
        var count = checkedTasks.length;
        document.getElementById("countOfDone").textContent = count;
        document.getElementById("countOfAll").textContent = allTasks.length;
        document.getElementById("countOfNotDone").textContent = allTasks.length - count;
    }

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
    }

    var cols = document.querySelectorAll('ul li');
    var dragSrcEl = null;

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragLeave() {
        this.style.backgroundColor = '#FAFAFA';
    }

    function handleDragEnd() {
        this.style.backgroundColor = '#FAFAFA';
    }

    function handleDragEnter(e) {
        this.style.backgroundColor = '#E1F5FE';

    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl != this) {
            var tasks = getTasks();
            if (dragSrcEl.id < this.id) {
                tasks.splice(+this.id + 1, 0, tasks[dragSrcEl.id]);
                tasks.splice(dragSrcEl.id, 1);
            }
            else {
                tasks.splice(+this.id, 0, tasks[dragSrcEl.id]);
                tasks.splice(+dragSrcEl.id + 1, 1);
            }

            localStorage.setItem('todo', JSON.stringify(tasks));
            show();
        }

        return false;
    }
});


