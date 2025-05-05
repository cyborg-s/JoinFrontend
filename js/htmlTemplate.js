let contacts = [];
let Second_URL = "http://127.0.0.1:8000/join/contacts/";

/**
 * This function Load the contacts from Firebase.
 */
async function loadContacts() {
  try {const response = await fetch(`${Second_URL}`);
    if (!response.ok) {throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);}
    const contactData = await response.json();
    if (!contactData) {
      console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
      return;}
    contacts.length = 0;
    for (const key in contactData) {
      if (contactData.hasOwnProperty(key)) {
        contacts.push(contactData[key]);}}
  } catch (error) {console.error("Fehler beim Laden der Daten:", error);}}

/**
 * This function generate the circles for the initial.
 * 
 * @param {string} names - Name for the Initial.
 */
function generateCircle(names) {
  let initial = "";
  const color = getRandomColor();
  const nameParts = names.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");
  ini = initials.toUpperCase();
  initial += `<div class="initialsDetails" style="background-color: ${color};">${ini}</div>`;
  return initial;
}

/**
 * This function make Initial from the name.
 * 
 * @param {string} names - Name for initial.
 */
function getInitialsDetail(names) {
  let initial = "";
  const color = getRandomColor();
  const nameParts = names.split(" ");
  const initials = nameParts.map((part) => part.charAt(0)).join("");
  ini = initials.toUpperCase();
  initial += `<div class="initialsDetails" style="background-color: ${color};">${ini}</div>`;
  return initial;
}

/**
 * This function returns a Random color for the Background from the initials.
 * 
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }return color;}

/**
 * This function fill the Template for the assign to List.
 * 
 * @param {number} i - is the number from the container ID
 * @param {string} circle - contains the html code for the initial from the contact
 * @param {string} element - contains the Name from the contact
 * @param {true or false} isChecked - mark the contacts as checked or not
 */
function generateAssingToTemplate(i, circle, element, isChecked){
  let unchecked = ""
  let checked = "d-none"
  let background = "backgroundAssing"
  if (isChecked == ""){
    unchecked = "d-none";
    checked = ""
    background = ""
  }
  return /*html*/`
  <div class="d-flex assingUser">
  <label class="container" >
    <div class="d-flex assingLeft ${background}" id="container${i}">
      <div>${circle}</div>
      <p>${element}</p>
    </div>    
    <input id="${element}" type="checkbox" ${isChecked} onclick="checkboxshow(${i})">
    <img src="imgs/ckeckMark.png" alt="" class="white ${unchecked} checkmark" id="check${i}">
    <img src="imgs/mark.png" alt="" class="${checked} checkmark" id="mark${i}">
  </label>
  </div>`;
}

/**
 * This function fill the addtask template for the addtask site.
 */
function addTaskTemplate() {
  return /*html*/ `
  <form id="addTaskForm">
    <div class="addTaskContent d-flex">
        <div class="addTaskHeader d-flex">
            <h1 class="addTaskHeader">Add Task</h1>
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
              <input id="addTasktitleInput" type="text" placeholder="Enter a title" >
              <p id="requiredTitle" class="required d-none">This field is required</p>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription"></textarea>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"></div><div id="assingedList" class="assingedList d-none" onclick="event.stopPropagation();"></div>
            <div id="electedContacts" class="d-flex "></div>
          </div>
          <div class="middleLine"></div>
          <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>      
            <input type="date" name="Date" id="addTaskDate" onblur="validateDateInput()">
            <p id="requiredDate" class="required d-none">This field is required</p>
            <p id="pastDate" class="required d-none">The date must not be in the past</p>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button type="button" id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button type="button" id="medium" onclick="setPrio('medium')" class="colormedium">Medium <img id="mediumColor" class="d-none" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button type="button" id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>         
            <select name="Category" id="addTaskCategory" >
                <option disabled selected value="">Select task Category</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
           <p id="requiredCat" class="required d-none">This field is required</p>         
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask" onkeydown="checkEnter(event, 'subTaskAdd')">
                <img id="subTaskPlus" class="subTaskPlus" src="./assets/img/icon_subtasks.svg" alt="">
                <div id="activSubTask" class="d-none d-center">
                    <img onclick="cancelSubTask()" class="subTaskCross" src="./assets/img/icon_closeVectorBlack.svg" alt="">
                    <div class="middleLineShort"></div>
                    <img onclick="addSubTask()" class="subTaskCheck" src="./assets/img/check.png" alt="">
                </div>
            </div>
            <ul id="subTaskView"></ul>
        </div>
    </div>
    <div class="addTaskFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="addTaskSubmit d-flex d-space">
                <button type="button" onclick="renderAddTask()" class="clear d-flex">Clear <img src="./assets/img/icon_closeVectorBlack.svg" alt=""></button>
                <button type="button" id="submitButton" onclick="addTaskSummit()" class="createTask d-flex" >Create Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
        </div>
    </div>
  </form>
  <div id="confirmationMessage" class="confirmation hidden">Task added to board <img class="conformationImg" src="./assets/img/icon_board.svg" alt=""></div>
    `;
}

/**
 * This function fill the Template for the addtask popup frome the board page
 * 
 * @param {string} positionId - Is the Position were the new Task are Saved.
 * 
 */
function fillAddTaskSection(positionId) {
  return /*html*/ `
  <form id="addTaskForm">
    <div class="addTaskContent d-flex">
        <div class="addTaskHeader d-flex d-space headerResponsiv">
            <h1 class="addTaskHeader">Add Task</h1>
            <img onclick="closePopUp()" src="./assets/img/icon_closeVectorBlack.svg" alt="close">
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
            <input id="addTasktitleInput" type="text" placeholder="Enter a title" >
            <p id="requiredTitle" class="required d-none">This field is required</p>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription"></textarea>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"></div><div id="assingedList" class="assingedList d-none" onclick="event.stopPropagation();"></div>
            <div id="electedContacts" class="d-flex"></div>
          </div>
          <div class="middleLine"></div>
          <div class="addTaskRight d-flex">
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" onblur="validateDateInput()">
            <p id="requiredDate" class="required d-none">This field is required</p>
            <p id="pastDate" class="required d-none">The date must not be in the past</p>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button type="button" id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button type="button" id="medium" onclick="setPrio('medium')" class="colormedium">Medium <img id="mediumColor" class="d-none" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button type="button" id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <div class="d-flex"><p>Category</p><p class="red">*</p></div>
           <select name="Category" id="addTaskCategory" >
                <option disabled selected value="">Select task Category</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
           <p id="requiredCat" class="required d-none">This field is required</p>
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask" onkeydown="checkEnter(event, 'subTaskAdd')">
                <img id="subTaskPlus" class="subTaskPlus" src="./assets/img/icon_subtasks.svg" alt="">
                <div id="activSubTask" class="d-none d-center">
                    <img onclick="cancelSubTask()" class="subTaskCross" src="./assets/img/icon_closeVectorBlack.svg" alt="">
                    <div class="middleLineShort"></div>
                    <img onclick="addSubTask()" class="subTaskCheck" src="./assets/img/check.png" alt="">
                </div>
            </div>
            <ul id="subTaskView"></ul>
        </div>
    </div>
    <div class="addTaskFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="addTaskSubmit d-flex d-space">
                <button type="button" onclick="fillAddTaskPopUp()" class="clear d-flex">Clear <img src="./assets/img/icon_closeVectorBlack.svg" alt=""></button>
                <button type="button" id="addTaskPopupButton" onclick="addTaskPopup('${positionId}')" class="createTask d-flex" >Create Task <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
        </div>
    </div>
  </form>
  <div id="confirmationMessage" class="confirmation hidden">Task added to board <img class="conformationImg" src="./assets/img/icon_board.svg" alt=""></div>
    `;
}


/**
 * This function fill the Edit Task template for the Popup at the boardpage
 * 
 * @param {string} titleId - is the old title
 * @param {string} category - is the old category
 * @param {number} dueDate - is the old date
 * @param {string} Description - is the old discription
 * @param {string} positionID - is the position on the board page
 * @param {number} id - is the task ID
 * @returns 
 */
function fillEditTaskSection(titleId, category, dueDate, Description, positionID, id) {
  let subTask = fillsubtask(id);
  return /*html*/ `
  <form id="addTaskForm">
    <div class="addTaskContent d-flex">
        <div class="editTaskX">
            <img onclick="closeDetailCardX()" src="./assets/img/icon_closeVectorBlack.svg" alt="close">
        </div>
        <div class="d-flex d-space addTaskBody">
          <div class="addTaskLeft d-flex">
            <div class="d-flex"><p>Title</p><p class="red">*</p></div>
            <input id="addTasktitleInput" type="text" placeholder="Enter a title" value="${titleId}" >
            <p id="requiredTitle" class="required d-none">This field is required</p>
            <p>Description</p>
            <textarea cols="50" placeholder="Enter a Description" name="Discription" id="addTaskDiscription" >${Description}</textarea>
            <div class="d-flex"><p>Due date</p><p class="red">*</p></div>
            <input type="date" name="Date" id="addTaskDate" value="${dueDate}" >
            <p id="requiredDate" class="required d-none">This field is required</p>
            <p>Prio</p>
            <div class="d-flex d-space">
                <button type="button" id="urgent" onclick="setPrio('urgent')">Urgent <img id="urgentColor" src="./assets/img/icon_PrioAltaRed.svg" alt=""><img id="urgentWhite" class="urgentWhite d-none" src="./assets/img/PrioWhite.svg" alt=""></button>
                <button type="button" id="medium" onclick="setPrio('medium')">Medium <img id="mediumColor" src="./assets/img/icon_PrioMediaOrange.svg" alt=""><img id="mediumWhite" class="d-none" src="./assets/img/icon_PrioMediaWhite.svg" alt=""></button>
                <button type="button" id="low" onclick="setPrio('low')">Low <img id="lowColor" src="./assets/img/icon_PrioBajaGreen.svg" alt=""><img id="lowWhite" class="d-none" src="./assets/img/PrioWhite.svg" alt=""></button></div>
            <p>Assigned to</p>
            <div class="assingedField d-flex"><input id="assinged" class="assingedInput" type="text" placeholder="Select contacts to assign" onfocus="generateAssingTo()" oninput="filterContacts()"><img class="icon" src="./assets/img/arrow_drop_down.png" alt=""></div>
            <div id="hideAssignlist" class="d-none" onclick="hideAssignlist()"></div><div id="assingedList" class="assingedList d-none" onclick="event.stopPropagation();"></div>
            <div id="electedContacts" class="d-flex"></div>
            <p>Subtasks</p>
            <div id="pointer" onclick="openAddSubTask()" class="d-flex subTask">
                <input id="subTaskAdd" type="text" placeholder="Add new subtask"  onkeydown="checkEnter(event, 'subTaskAdd')">
                <img id="subTaskPlus" class="subTaskPlus" src="./assets/img/icon_subtasks.svg" alt="">
                <div id="activSubTask" class="d-none d-center">
                    <img onclick="cancelSubTask()" class="subTaskCross" src="./assets/img/icon_closeVectorBlack.svg" alt="">
                    <div class="middleLineShort"></div>
                    <img onclick="addSubTask()" class="subTaskCheck" src="./assets/img/check.png" alt="">
                </div>
            </div>
            <ul id="subTaskView" class="editSubtaskView">${subTask}</ul>
            <div class="editFooter d-flex d-space">
            <div class="addTaskNote d-flex">
                <p class="red note">*</p><p class="note">This field is required</p>
            </div>
            <div class="editTaskSubmit d-flex d-space">
                <button type="button" id="editTaskButton" onclick="editTaskPopup('${positionID}', '${id}')" class="createTask d-flex editTask" >Ok <img src="./assets/img/icon_check-white.svg" alt=""></button>
            </div>
            <select name="Category" id="addTaskCategory" class="d-none">
                <option value="${category}">${category}</option>
                <option value="Technical Task">Technical Task</option>
                <option value="User Story">User Story</option>
           </select>
        </div>
    </div>
    </div>  
  </form>  
    `;
}

/**
 * This function fill the template for the contact filter at the form 
 * 
 * @param {string} circle - Contains the html for the contact initial
 * @param {string} element - contains the contact name
 * @param {true or false} isChecked - mark the contact checked or not
 * @returns 
 */
function filterContactsTemplate(circle, element, isChecked) {
  return /*html*/`
      <div class="d-flex assingUser">
        <label class="container">
          <div class="d-flex assingLeft">
            <div>${circle}</div>
            <p>${element}</p>
          </div>
          <input id="${element}" type="checkbox" onclick="toggleCheckbox('${element}')" ${isChecked ? "checked" : ""}>
          <span class="checkmark"></span>
        </label>
      </div>`;
}

/**
 * This function fill the template for the Subtask list at the form by edit
 * 
 * @param {number} index - give the position number at the list
 * @param {string} element - contains the text for the subtask
 */
function fillsubtaskTemplate(index, element) {
  return /*html*/`
  <li class="subTaskList">
    <p id="subtask-text-${index}">${element}</p>
    <div id="subTaskLeft-${index}" class="subTaskLeft">
      <img class="subTaskEdit" onclick="editSubTask(${index})" src="./assets/img/edit.svg" alt="Edit">
      <div class="middleLineShort"></div>
      <img class="subTaskDelete" onclick="deleteSubTask(${index})" src="./assets/img/delete.svg" alt="Delete">
    </div>
    <div id="edit-input-${index}-div" class="editInput d-none">
      <input type="text" id="edit-input-${index}"  class="edit-input" value="${element}">
      <div id="save-btn-${index}" class="d-none d-flex d-align">
        <img onclick="saveSubTask(${index})" class="subTaskCheck" src="./assets/img/check.png" alt="">
        <div class="middleLineShort"></div>
        <img class="subTaskDelete" onclick="deleteSubTask(0)" src="./assets/img/delete.svg" alt="Delete">
      </div>
    </div>
  </li>`;
}

/**
 * This function render the subtask by add subtask
 * 
 * @param {number} index - give the position in the list
 * @param {string} element  - text for subtask list
 */
function renderSubTaskTemplate(index, element){
  return /*html*/`
  <li class="subTaskList">
  <p id="subtask-text-${index}">${element}</p>
  <div id="subTaskLeft-${index}" class="subTaskLeft">
  <img class="subTaskEdit" onclick="editSubTask(${index})" src="./assets/img/edit.svg" alt="Edit">
  <div class="middleLineShort"></div>
  <img class="subTaskDelete" onclick="deleteSubTask(${index})" src="./assets/img/delete.svg" alt="Delete">
  </div>
  <div id="edit-input-${index}-div" class="editInput d-none">
  <input type="text" id="edit-input-${index}"  class="edit-input" value="${element}">
  <div id="save-btn-${index}" class="d-none d-flex d-align">
  <img onclick="saveSubTask(${index})" class="subTaskCheck" src="./assets/img/check.png" alt="">
  <div class="middleLineShort"></div>
  <img class="subTaskDelete" onclick="deleteSubTask(0)" src="./assets/img/delete.svg" alt="Delete">
  </div>
  </div>
  </li>`;
}


/**
 * This function fill the tamplate for detailcard
 * 
 * @param {number} id  - Task ID
 * @param {*} contentSection 
 * @param {string} assign - Assign to List
 * @param {string} cardSubTask - Subtask List 
 * @param {string} catClass - Category class 
 * @param {number} formattedDate - due Date
 * @param {string} priosrc - Priority src for img
 */
function fillDetailTemplate(id, contentSection, assign, cardSubTask, catClass, formattedDate, priosrc) {
  contentSection.innerHTML = "";
  contentSection.innerHTML = /*html*/ `
        <div id="detailCard" class="detailCard">
            <div class="d-flex d-space">
                <div class="detailCardCategory ${catClass} d-flex d-center">${task[id].category}</div>
                <img onclick="closeDetailCardX()" class="closeCard" src="./assets/img/icon_closeVectorBlack.svg" alt="">
            </div>
            <h2>${task[id].title}</h2>
            <div>
                <p class="detailDescription">${task[id].description}</p>
                <div class="d-flex detailDate">
                    <p class="detailDue">DueDate:</p>
                    <p>${formattedDate}</p> 
                </div>
                <div class="d-flex detailPrio">
                    <p class="detailPr">Priority:</p>
                    <p class="d-flex dPrio">${task[id].prio} ${priosrc}</p>
                </div>
            </div>
            <ul class=" assignContainer">
                <p class="detailAssign">Assigned To:</p>
                ${assign}
            </ul>
            <p class="detailSubtask">Subtasks</p>
            <ul id="subtasksContainer${id}" class="subtask-container">
                ${cardSubTask}
        </ul>
        <div class="d-flex detailDeleteEdit">
            <div class="deleteEdit d-flex" onclick="deleteTask('${task[id].id}')">
                <img src="./assets/img/delete.svg" alt="">
                <p>Delete</p>
            </div>
            <div class="detailMiddleline"></div>
            <div class="deleteEdit d-flex" onclick="editTask('${task[id].title}', '${task[id].category}', '${task[id].due_date}', '${task[id].description}' ,'${task[id].PositionID}' ,'${id}' ,'${task[id].prio}')">
                <img src="./assets/img/edit.svg" alt="">
                <p>Edit</p>
            </div>
        </div>
        <div class="mobileDragTask">
          <p>Select board position</p>
          <select class="mobileSelect" onchange="changePosition(${id},'${task[id].Title}')" name="positionSwitch" id="positionSwitch">
            <option disabled selected value="">Choose New Position</option>
            <option value="toDo">To do</option>
            <option value="inProgress">In Progress</option>
            <option value="awaitFeedback">Await Feedback</option>
            <option value="done">Done</option>
          </select>
        </div>
        </div>   
    `;
}

/**
 * this function fill the tamplate for the checkbox filter
 * 
 * @param {number} id - Task ID
 * @param {number} i - SubID
 * @param {true or false} checked - checkbox is checked or not 
 * @param {string} element - contais the subtask text
 * 
 */
function filterSubTaskTemplate(id, i, checked, element){
  return /*html*/`<li class="d-flex subtaskList"><input id="${id}${i}" type="checkbox" class="subtask-checkbox-${id} c-pointer" onclick="updatecheckbox(${id}, ${i})" ${checked}><p>${element.title}</p></li> `;  
}

/**
 * This function fill the tamplate for the card at the board
 * 
 * @param {string} title - Task Title
 * @param {string} category - Task Category
 * @param {string} text - Task Discription
 * @param {string} assigned - Assign to list
 * @param {string} prio - Priority
 * @param {number} id - Task ID
 * @returns 
 */
function fillTemplate(pk, title, category, text, assigned, prio, id) {
  let priosrc = checkPrio(prio);
  let catClass = checkCategory(category);
  let content = limitTextLength(text);
  let initials = getInitials2(assigned);
  return /*html*/ `
    <div class="card" id="${title}" draggable="true" ondragstart="drag(event, ${id}, '${title}')" onclick="openDetailCard(${id})">
        <div class="cardCategory ${catClass} d-flex d-center">${category}</div>
        <h3 class="cardTitle">${title}</h3>
        <p class="cardText">${content}</p>
        <div class="cardBalken d-flex">
            <div class="progress-container" id="progressContainer${id}">
                <div class="progress-bar" id="progressBar${id}"></div>
            </div>
            <div class="progress-text" id="progressText${id}"></div>
        </div>
        <div class="cardFooter d-flex d-space">
            <div class="initials-container">${initials}</div>
            <img class="cardPrio " src="${priosrc}">
        </div>
        </div>
        <p id="primaryKey${id}" class="none">${pk}</p>
    </div>`;
}