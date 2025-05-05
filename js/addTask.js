let BASE_Url = "http://127.0.0.1:8000/join/tasks/";

let taskA = []

/**
 * This function load the saved Task from the firebase database.
 */
async function loadTask() {
  try {const response = await fetch(`${BASE_Url}`);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);}
    const taskData = await response.json();
    if (!taskData) {
      console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
      return;}
    taskA.length = 0;
    for (const key in taskData) {
      if (taskData.hasOwnProperty(key)) {
        taskA.push(taskData[key]);
      }}} catch (error) {
    console.error("Fehler beim Laden der Daten:", error);}}

/**
 * This Function render the addtask site.
 */    
function renderAddTask() {
  let contentSection = document.getElementById("addTaskSide");
  contentSection.innerHTML = "";
  contentSection.innerHTML = addTaskTemplate();
  loadContacts();
  document.getElementById("electedContacts").innerHTML = '';
  selectedCheckboxes = [];
  setMinDate();
}

/**
 * This function set the min date to the current date.
 */
function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); 
  const dd = String(today.getDate()).padStart(2, '0');      
  const minDate = `${yyyy}-${mm}-${dd}`;
  document.getElementById("addTaskDate").setAttribute("min", minDate);
}

/**
 * This Function validate the date input is not in the past.
 */
function validateDateInput() {
  const dateInput = document.getElementById("addTaskDate");
  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate >= today && document.getElementById("addTaskDate").classList.contains("outlineRed")){
    document.getElementById("pastDate").classList.add("d-none");
  document.getElementById("addTaskDate").classList.remove ("outlineRed");
  }else 
  if (selectedDate < today) {
    dateInput.value = "";
    pastDate();
  }
}

let prio = "medium";
let subTask = [];
let checkBox = [];
let selectedCheckboxes = [];
let positionID = ""

/**
 * This function submit the form to the firebase function.
 */
async function addTaskSummit() {
  let button =  document.getElementById("submitButton");
  event.preventDefault()
  await loadTask();
  let id = taskA.length;
  if(!checkRequired()) { return;}
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    button.disabled = true;
  const task = {title: document.getElementById("addTasktitleInput").value, category: document.getElementById("addTaskCategory").value, description: document.getElementById("addTaskDiscription").value, due_date: document.getElementById("addTaskDate").value, prio: prio, assigned_to: selectedCheckboxes, subTask, PositionID: "toDo", checkboxState: [checkBox]};
  await postData(task.title, task);
  showConfirmationMessage();
  goToBoard();
  }
}


function putTemplate(positionID,) {
   return {
    title: document.getElementById("addTasktitleInput").value,
    description: document.getElementById("addTaskDiscription").value,
    assigned_to: selectedCheckboxes, // sollte ein Array sein
    due_date: document.getElementById("addTaskDate").value,
    prio: prio,
    category: document.getElementById("addTaskCategory").value, // Achtung: vorher hattest du "T${data.category}"
    PositionID: positionID,
    subtask: subTask
  };
}

/**
 * This function check the required fields are not empty.
 */
function checkRequired(){
  let titleR = document.getElementById("addTasktitleInput");
  let dateR = document.getElementById("addTaskDate");
  let categoryR = document.getElementById("addTaskCategory");
  resetRequired();
  if (titleR.value === ""){
    document.getElementById("requiredTitle").classList.remove("d-none");
    titleR.classList.add ("outlineRed");
    return false} else if (dateR.value === ""){
    document.getElementById("requiredDate").classList.remove("d-none")
    dateR.classList.add ("outlineRed");
    return false;} else if (categoryR && categoryR.value === ""){
    document.getElementById("requiredCat").classList.remove("d-none");
    categoryR.classList.add ("outlineRed");
    return false} else {return true}}

/**
 * This function reset the required input when filled.
 */    
function resetRequired(){
  let titleR = document.getElementById("addTasktitleInput");
  let dateR = document.getElementById("addTaskDate");
  let categoryR = document.getElementById("addTaskCategory");
  if (titleR.classList.contains('outlineRed')) {
    document.getElementById("requiredTitle").classList.add("d-none");
    titleR.classList.remove ("outlineRed");} else if (dateR.classList.contains('outlineRed')) {
    document.getElementById("requiredDate").classList.add("d-none");
    dateR.classList.remove ("outlineRed");} else if (categoryR && categoryR.classList.contains('outlineRed')) {
    document.getElementById("requiredCat").classList.add("d-none");
    categoryR.classList.remove ("outlineRed");}
}

/**
 * This function go to board after submit the form.
 */
function goToBoard(){
  window.location.href = './board.html';
}

/**
 * This function submit the form in the popup at the board page. 
 * 
 * @param {string} positionId - Give the position were the task to save at the board. 
 */
async function addTaskPopup(positionId) {
  let button = document.getElementById("addTaskPopupButton");
  event.preventDefault();
  if (!checkRequired()) {return;}
  if (button !== null && document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== '') {button.disabled = true;}
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    button.disabled = true;
    positionID = positionId;
  const task = {title: document.getElementById("addTasktitleInput").value, category: document.getElementById("addTaskCategory").value, description: document.getElementById("addTaskDiscription").value, due_date: document.getElementById("addTaskDate").value, prio: prio, assigned_to: selectedCheckboxes, subTask, PositionID: positionID, checkboxState: [checkBox]};
  const jsonString = JSON.stringify(task);
  await postData(task.title, task);
  showConfirmationMessage();
  closePopUp();
  closeDetailCardX();
  await loadTasks();}}

  /**
   * This function submit the edit popup at the boardpage.
   * 
   * @param {string} positionId - Give the position were the task to save at the board. 
   * @param {number} id - ID frome the edited Task to save it in firebase.
   */
async function addTaskPopup2(positionId, id) {
  let button = document.getElementById("editTaskButton")
  if (!checkRequired()) {return;}
  if (button !== null && document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== '') {button.disabled = true;}
  if (document.getElementById("addTasktitleInput").value !== '' && document.getElementById("addTaskDate").value !== '' && document.getElementById("addTaskCategory").value !== ''){
    button.disabled = true;
    positionID = positionId
  const task = {title: document.getElementById("addTasktitleInput").value, category: document.getElementById("addTaskCategory").value, description: document.getElementById("addTaskDiscription").value, due_date: document.getElementById("addTaskDate").value, prio: prio, assigned_to: selectedCheckboxes, subtasks: [subTask], PositionID: positionID, checkboxState: [checkBox]};
  const jsonString = JSON.stringify(task);
  await postData(task.title, task);
  await loadTasks();
  closeDetailCardX();
}
}

  /**
   * This function update the selected Checkbox array for assign to at addtask.
   * 
   */
function updateSelectedCheckboxes() {
  selectedCheckboxes = []; 
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedCheckboxes.push(checkbox.id);
    }
  });
}

/**
 * This function update the checkbox array for assign to for edit.
 */
function updateSelectedCheckboxes2() {
    if (!Array.isArray(selectedCheckboxes)) {
        selectedCheckboxes = [];
    }
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (selectedCheckboxes.includes(checkbox.id)) {
            checkbox.checked = true;
        }
        if (checkbox.checked && !selectedCheckboxes.includes(checkbox.id)) {
            selectedCheckboxes.push(checkbox.id);
        }
    });
}

/**
 * This function add Subtask to the form.
 */
function addSubTask() {
  if (document.getElementById("subTaskAdd").value === "") {
  }else{
  let value = document.getElementById("subTaskAdd").value;
  subTask.push({title: value, status: false});
  renderSubTask();
  checkBox.push("false")
  cancelSubTask();
  event.stopPropagation();}
}

/**
 * This function render the subtask at the form.
 */
function renderSubTask(){
  let show = document.getElementById("subTaskView");
  show.innerHTML = ""
for (let index = 0; index < subTask.length; index++) {
  const element = subTask[index].title;
  show.innerHTML += renderSubTaskTemplate(index, element);
}
}

/**
 * This function show the edit input for the subtask.
 * 
 * @param {number} index - ID for the selectet subtask 
 */
function editSubTask(index) {
  renderSubTask();
  const subTaskText = document.getElementById(`subtask-text-${index}`);
  const editInput = document.getElementById(`edit-input-${index}-div`);
  const saveButton = document.getElementById(`save-btn-${index}`);
  const subTaskLeft = document.getElementById(`subTaskLeft-${index}`)
  subTaskText.classList.add('d-none');
  subTaskLeft.classList.add('d-none')
  editInput.classList.remove('d-none');
  saveButton.classList.remove('d-none');
}

/**
 * This function save the edited subtask.
 * 
 * @param {number} index - ID for the selectet subtask 
 */
function saveSubTask(index) {
  const editInput = document.getElementById(`edit-input-${index}`);
  const value = editInput.value.trim();
  const id = subTask[index].id

  if (value !== "") {
    subTask[index] = {id: id, title: value, status: false }; // oder true, je nach Bedarf
    renderSubTask();
  } else {
    editInput.placeholder = "This field must not be empty";
  }
}

/**
 * This function delete the selectet subtask.
 * 
 * @param {number} index - Position for the selectet subtask.
 */
async function deleteSubTask(index) {
  const subtaskToDelete = subTask[index];

  // Wenn Subtask ein Objekt mit ID ist → in DB löschen
  if (subtaskToDelete.id) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/join/subtasks/${subtaskToDelete.id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Löschen: ${response.status}`);
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Subtasks:', error);
      return; // Abbruch falls Backend-Fehler
    }
  }

  // In jedem Fall lokal entfernen
  subTask.splice(index, 1);
  renderSubTask();
}

let subTask2 = []

/**
 * This function fill the subtask section at the edit form.
 * 
 * @param {number} id - Task ID
 */
function fillsubtask(id){
  subTask2 = []
  let subTasks = ""
  if (id === "undefined"){subTask = ""} else if (task[id].subtasks){
  for (let index = 0; index < task[id].subtasks.length; index++) {
    const element = task[id].subtasks[index].title;
    const check = task[id].subtasks[index].status;
    subTasks += fillsubtaskTemplate(index, element);
    subTask2.push(task[id].subtasks[index]);
    checkBox.push(check);
  }}
  subTask = subTask2
  return subTasks;
}

/**
 * This function filter the contacts by input in the form.
 */
function filterContacts() {
  const filterValue = document.getElementById("assinged").value.toLowerCase();
  assigned = "";
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i].name;
    const circle = generateCircle(element);
    if (element.toLowerCase().startsWith(filterValue)) {
      const isChecked = selectedCheckboxes.includes(element);
      assigned += filterContactsTemplate(circle, element, isChecked);
    }
  }
  document.getElementById("assingedList").innerHTML = assigned;
}

/**
 * This function set the contact to selectet or unselectet.
 * 
 * @param {string} username - contact name
 */
function toggleCheckbox(username) {
  if (selectedCheckboxes.includes(username)) {
    selectedCheckboxes = selectedCheckboxes.filter(item => item !== username);
  } else {
    selectedCheckboxes.push(username);
  }
}

/**
 * This function render the selectet contacts when the assign to list are closed in initials.
 */
function renderSelectedContacts() {
  const electedContactsDiv = document.getElementById('electedContacts');
  electedContactsDiv.innerHTML = ''; 
  const maxVisibleContacts = 5;
  const extraContacts = selectedCheckboxes.length - maxVisibleContacts;
  selectedCheckboxes.slice(0, maxVisibleContacts).forEach(contact => {
    const circle = generateCircle(contact);
    electedContactsDiv.innerHTML += circle;
  });
  if (extraContacts > 0) {
    const extraCircle = `<div class="initialsDetails" style="background-color: brown;">+${extraContacts}</div>`;
    electedContactsDiv.innerHTML += extraCircle;
  }
}

/**
 * This function help to render the assign to list and fill the selectet array.
 * 
 * @param {number} id - Task ID
 */
function checkboxHelp(id){
  selectedCheckboxes = task[id].AssignedTo;
  updateSelectedCheckboxes2();
    renderSelectedContacts();
}

/**
 * This function post the data from the form in the firbase database.
 * 
 * @param {string} path - path  at the database
 * @param {string} data - Data to save in the database
 */
async function postData(path = "", data = {}) {
  if (event) event.preventDefault();

  const payload = postTemplate(data); // korrektes Objekt

  try {
    let response = await fetch(BASE_Url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // automatisch korrektes JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during postData:", error);
    return { error: "An error occurred during the data post." };
  }
}

function postTemplate(data) {
  const subtasks = data.subTask

  return {
    title: data.title,
    description: data.description,
    assigned_to: data.assigned_to, // sollte ein Array sein
    due_date: data.due_date,
    prio: data.prio,
    category: data.category, // Achtung: vorher hattest du "T${data.category}"
    PositionID: data.PositionID,
    subtasks: subtasks
  };
}


