// Check for existing user data in localStorage
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

// Check for existing tasks in localStorage
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

// Authentication section
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const toggleAuth = document.getElementById("toggle-auth");
const taskSection = document.getElementById("task-section");
const authSection = document.getElementById("auth-section");

let currentUser = null;

// Handle user authentication
authForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users"));

  // Check for sign-up or sign-in
  if (authTitle.innerText === "Sign Up") {
    if (users.some((user) => user.username === username)) {
      alert("User already exists. Please sign in.");
      return;
    }
    users.push({ username, password });
    alert("User registered successfully. You can now sign in.");
  } else {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) {
      alert("Invalid credentials. Please try again.");
      return;
    }
    currentUser = username;
    alert(`Welcome, ${currentUser}!`);
  }

  localStorage.setItem("users", JSON.stringify(users));
  authSection.style.display = "none";
  taskSection.style.display = "block";
  loadTasks();
});

// Toggle between sign-up and sign-in
toggleAuth.addEventListener("click", function () {
  if (authTitle.innerText === "Sign Up") {
    authTitle.innerText = "Sign In";
    toggleAuth.innerText = "Switch to Sign Up";
  } else {
    authTitle.innerText = "Sign Up";
    toggleAuth.innerText = "Switch to Sign In";
  }
  authForm.reset();
});

// Task management section
const taskForm = document.getElementById("task-form");
const pendingTasksList = document.getElementById("pending-tasks");
const completedTasksList = document.getElementById("completed-tasks");

// Handle task submission
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskTitle = document.getElementById("task-title").value;
  const taskDueDate = document.getElementById("task-due-date").value;

  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const newTask = { title: taskTitle, dueDate: taskDueDate, completed: false };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();
  loadTasks();
});

// Load tasks from localStorage
function loadTasks() {
  pendingTasksList.innerHTML = "";
  completedTasksList.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            ${task.title} (Due: ${new Date(task.dueDate).toLocaleString()})
            <button onclick="completeTask(${index})">Complete</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
    if (task.completed) {
      li.classList.add("completed");
      completedTasksList.appendChild(li);
    } else {
      pendingTasksList.appendChild(li);
    }
  });
}

// Complete task
function completeTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].completed = true;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// Delete task
function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}
