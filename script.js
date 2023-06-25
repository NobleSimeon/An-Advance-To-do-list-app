console.log("It is working");

const form = document.getElementById("form");
const input = document.getElementById("input");
const msg = document.getElementById("msg");
const ulLists = document.querySelector(".lists");

const filters = document.querySelectorAll(".filters button");

let editId;
let isEditedTask = false;

// Retrieve tasks from local storage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display stored tasks on page load
renderAllTasks();
renderPendingTasks();
constComplete();

filters.forEach(btn => {
  btn.addEventListener("click", (e) => {
    // Remove active class from all buttons
    filters.forEach(btn => {
      btn.classList.remove("active");
    });

    // Add active class to the clicked button
    e.target.classList.add("active");

    if (btn.id === "all") {
      renderAllTasks();
    } else if (btn.id === "pending") {
      renderPendingTasks();
    } else if (btn.id === "completed") {
      renderCompletedTasks();
    }
  });
});

function renderTasks(filter) {
  let li = "";

  if (tasks) {
    tasks.forEach(function (task, index) {
      let isCompleted = task.status === "Completed" ? "checked" : "";

      if (filter === task.status.toLowerCase() || filter === "all") {
        li += `
          <li class="list ${task.status === "Completed" ? "completed" : ""}">
            <label for="${index}">
              <input onclick="updateStatus(this)" type="checkbox" id="${index}" ${isCompleted}/>
              <p>${task.name}</p>
            </label>
            <div class="settings">
              <button onclick="showMenu(this)">
                <i class="uil uil-ellipsis-h"></i
                ><span class="sr-only">Settings menu</span>
              </button>
              <ul class="task-menu">
                <li>
                  <button onclick="editTask('${task.name}', ${index})"><i class="uil uil-pen"></i>Edit</button>
                </li>
                <li>
                  <button onclick="deleteTask(${index})"><i class="uil uil-trash"></i>Delete</button>
                </li>
              </ul>
            </div>
          </li>
        `;
      }
    });
  }

  ulLists.innerHTML = li || `<span>You don't have any task here</span>`;
}

function renderAllTasks() {
    let li = "";
  
    if (tasks) {
      tasks.forEach(function (task, index) {
        let isCompleted = task.status === "Completed" ? "checked" : "";
  
        li += `
          <li class="list ${task.status === "Completed" ? "completed" : ""}">
            <label for="${index}">
              <input onclick="updateStatus(this)" type="checkbox" id="${index}" ${isCompleted}/>
              <p>${task.name}</p>
            </label>
            <div class="settings">
              <button onclick="showMenu(this)">
                <i class="uil uil-ellipsis-h"></i
                ><span class="sr-only">Settings menu</span>
              </button>
              <ul class="task-menu">
                <li>
                  <button onclick="editTask('${task.name}', ${index})"><i class="uil uil-pen"></i>Edit</button>
                </li>
                <li>
                  <button onclick="deleteTask(${index})"><i class="uil uil-trash"></i>Delete</button>
                </li>
              </ul>
            </div>
          </li>
        `;
      });
    }
  
    ulLists.innerHTML = li || `<span>You don't have any task here</span>`;
  }
  

function renderPendingTasks() {
  renderTasks("pending");
}

function renderCompletedTasks() {
  renderTasks("completed");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let userTask = input.value.trim();

  formValidation();
  input.value = "";

  if (!isEditedTask) {
    let taskInfo = { name: userTask, status: "Pending" };
    tasks.push(taskInfo);
  } else {
    isEditedTask = false;
    tasks[editId].name = userTask;
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderAllTasks();
  renderPendingTasks();
  renderCompletedTasks();
  constComplete();
});

input.addEventListener("keydown", (e) => {
  let userTask = input.value.trim();


  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevents the default behavior of the Enter key

    if (input.value === "") {
      msg.innerHTML = "Post cannot be blank";
      console.log("failure");
    } else {
      console.log("successs");
      msg.innerHTML = "";
    }

    // Perform the submission or any other action you want here
    console.log("Submitting textarea value:", input.value);
    input.value = "";

    if (!isEditedTask) {
      let taskInfo = { name: userTask, status: "Pending" };
      tasks.push(taskInfo);
    } else {
      isEditedTask = false;
      tasks[editId].name = userTask;
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAllTasks();
  renderPendingTasks();
    constComplete();
  }
});

let formValidation = () => {
  if (input.value === "") {
    msg.innerHTML = "Post cannot be blank";
    console.log("failure");
  } else {
    console.log("successs");
    msg.innerHTML = "";
  }
};

function constComplete() {
    const allCheckBoxes = document.querySelectorAll(".list input");
    allCheckBoxes.forEach((selectedTask) => {
      let parentElement = selectedTask.parentElement.parentElement;
      if (selectedTask.checked) {
        parentElement.classList.add("completed");
        tasks[selectedTask.id].status = "Completed";
      } else if (parentElement.classList.contains("completed")) {
        parentElement.classList.remove("completed");
        tasks[selectedTask.id].status = "Pending";
      }
    });
  }

function updateStatus(selectedTask) {
  let parentElement = selectedTask.parentElement.parentElement;
  if (selectedTask.checked) {
    parentElement.classList.add("completed");
    tasks[selectedTask.id].status = "Completed";
  } else {
    parentElement.classList.remove("completed");
    tasks[selectedTask.id].status = "Pending";
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement;
  taskMenu.classList.add("show");
  // setTimeout(() => {
  //     taskMenu.classList.remove("show");
  //   }, 2500);
  document.addEventListener("click", (e) => {
    if (!taskMenu.contains(e.target)) {
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskname, index) {
  editId = index;
  isEditedTask = true;
  input.value = taskname;
  renderAllTasks();
  renderPendingTasks();
  constComplete()
}

function deleteTask(deleteIndex) {
  tasks.splice(deleteIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderAllTasks();
  renderPendingTasks();
  constComplete();
}

constComplete();