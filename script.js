// Project Requirement: Note do to list to list our daily task and filter out unwanted task
// Project Description
// Technical Requirements: HTML, JS, CSS library - Bootstrap

// GET ALL THE HTML ELEMENTS TO BE MANIPULATED
const taskListElement = document.getElementById("taskListElement");
const unwantedTaskListElement = document.getElementById(
  "unwantedTaskListElement"
);
const weekHoursElement = document.getElementById("weekHoursElement");
const totalTimeSpentElement = document.getElementById("totalTimeSpentElement");
const totalTimeWastedElement = document.getElementById(
  "totalTimeWastedElement"
);

// Total Hours in a week
const totalHoursInWeek = 24 * 7;

// Display total hours in a week in DOM
weekHoursElement.innerHTML = `<b>${totalHoursInWeek} hrs</b>`;

// Define GLobal Variable to store task list
// task list values should intite from locally saved taskList
const storedTaskList = JSON.parse(localStorage.getItem("taskList"));
let taskList = storedTaskList || [];

// Main function to add task to the list
const handleFormSubmit = (form) => {
  // STEP 1: Get the form Data
  const formData = new FormData(form);

  const taskName = formData.get("taskName");
  const taskTime = +formData.get("taskTime");

  // STEP 2: Build task object
  // If key and value are same, we can use floolowing format
  const taskObject = {
    taskName,
    taskTime,
    type: "entry",
    id: randomIdGenerator(),
  };

  // STEP 3: If total time spent is greater than total hours in week, don't add task
  const totalTimeSpent = getTotalTimeSpent();

  if (totalTimeSpent + taskTime > totalHoursInWeek) {
    return alert("Sorry, You do not have enough time left!!");
  }

  // STEP 4: Add task to the taskList Array
  taskList.push(taskObject);

  // Update the local Storage
  updateLocalStorage();

  // STEP 5: Once task is added, display it in the UI
  displayTaskList();

  // STEP 6: clear the form fields
  form.reset();
};

// Function to display task list
const displayTaskList = () => {
  // define a variable for taskListRowsElement
  let taskListRowsElement = "";

  const entryTaskList = taskList.filter((task) => task.type === "entry");

  entryTaskList.map((task, index) => {
    taskListRowsElement += `
      <tr>
        <th>${index + 1}</th>
        <td>${task.taskName}</td>
        <td>${task.taskTime} hrs</td>
        <td class="text-end">
          <button onclick="handleOnDelete('${
            task.id
          }')" class="btn btn-danger btn-sm">
            <i class="fa-trash fa-solid"></i>
          </button>
        
          <button onclick="switchTask('${
            task.id
          }')" class="btn btn-success btn-sm">
            <i class="fa-sharp fa-solid fa-arrow-right-long"></i>
          </button>
        </td>
      </tr>
    `;
  });

  taskListElement.innerHTML = taskListRowsElement;

  getTotalTimeSpent();
};

// Function to display task list
const displayUnwantedTaskList = () => {
  // define a variable for taskListRowsElement
  let taskListRowsElement = "";

  const unwantedTaskList = taskList.filter((task) => task.type === "unwanted");

  unwantedTaskList.map((task, index) => {
    taskListRowsElement += `
      <tr>
        <th>${index + 1}</th>
        <td>${task.taskName}</td>
        <td>${task.taskTime} hrs</td>
        <td class="text-end">
          <button onclick="handleOnDelete('${
            task.id
          }')" class="btn btn-danger btn-sm">
            <i class="fa-trash fa-solid"></i>
          </button>
        
          <button onclick="switchTask('${
            task.id
          }')" class="btn btn-warning btn-sm">
            <i class="fa-sharp fa-solid fa-arrow-left-long"></i>
          </button>
        </td>
      </tr>
    `;
  });

  unwantedTaskListElement.innerHTML = taskListRowsElement;

  getTotalWastedTime();
};

// Function to disply total time spent
const getTotalTimeSpent = () => {
  const entryTaskList = taskList.filter((task) => task.type === "entry");

  const totalTimeSpent = entryTaskList.reduce((acc, curr) => {
    return acc + curr.taskTime;
  }, 0);

  totalTimeSpentElement.innerHTML = `<b>${totalTimeSpent}</b> hrs`;

  return totalTimeSpent;
};

// Function to disply total time spent
const getTotalWastedTime = () => {
  const unwantedTask = taskList.filter((task) => task.type === "unwanted");
  const totalwastedTime = unwantedTask.reduce((acc, curr) => {
    return acc + curr.taskTime;
  }, 0);

  totalTimeWastedElement.innerHTML = `<b>${totalwastedTime}</b> hrs`;

  return totalwastedTime;
};

// Function to Delete the Task
const handleOnDelete = (taskId) => {
  if (window.confirm("Are you sure you want to delete the task?")) {
    taskList = taskList.filter((task) => task.id !== taskId);

    // Once a task is delted, the task list is now updated, so should be DOM
    displayTaskList();
    displayUnwantedTaskList();
    //update local storage on delete
    updateLocalStorage();
  }
};

// Function to switch | toggle task
const switchTask = (taskId) => {
  taskList = taskList.map((task) => {
    if (task.id === taskId) {
      task.type = task.type === "entry" ? "unwanted" : "entry";
    }

    return task;
  });

  // Update local storage
  updateLocalStorage();

  //change the displays
  displayTaskList();
  displayUnwantedTaskList();
};

// Function to generate random id
const randomIdGenerator = () => {
  const idString =
    "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890";

  let id = "";

  for (let i = 0; i <= 6; i++) {
    const randomPosition = Math.floor(Math.random() * idString.length);
    id += idString[randomPosition];
  }

  return id;
};

// Function to store value in local storage
const updateLocalStorage = () => {
  return localStorage.setItem("taskList", JSON.stringify(taskList));
};

// Function to display task list on the first load
displayTaskList();
displayUnwantedTaskList();
