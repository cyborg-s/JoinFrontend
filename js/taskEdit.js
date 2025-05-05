/**
 * This function delete the Task from Firebase.
 * 
 * @param {number} id - This is the id frome the Task on with Place the task is saved at Firebase.
 */
async function deleteTask(id) {
    let firebaseURL = `http://127.0.0.1:8000/join/tasks/${id}/`
    try {
      const response = await fetch(firebaseURL, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
      });
      if (response.ok) {
          location.reload();
      } else {console.error('Fehler beim Löschen des Tasks:', response.statusText);}
  } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
}}

/**
 * This function fill the AddTask Popup from the board page.
 * 
 * @param {string} positionId - Give the position on the board who the new Task are saved.
 */
function fillAddTaskPopUp(positionId){
    selectedCheckboxes = [];
    subTask = [];
    document.getElementById("main").classList.add ("scrollhidden")
    document.getElementById("body").classList.add ("scrollhidden")
    let addTaskSection = document.getElementById("addTaskSection")
    let background = document.getElementById("addTaskSectionBackground")
    background.classList.remove ("d-none");
    addTaskSection.innerHTML = fillAddTaskSection(positionId);
    setMinDate();
}

/**
 * This function close the AddTask popup at the board Page.
 */
function closePopUp(){
    document.getElementById("addTaskSectionBackground").classList.add ("d-none");
    document.getElementById("main").classList.remove ("scrollhidden");
    document.getElementById("body").classList.remove ("scrollhidden");
}

oldTask = []

/**
 * This Function open the Edit Task popup at the board page.
 * 
 * @param {string} title - Title from the Saved Task
 * @param {string} category -Category from the Saved Task
 * @param {number} dueDate - Date from the Saved Task
 * @param {string} description - Discription from the Saved Task
 * @param {string} positionID - Position ID from the Saved Task
 * @param {number} id -Id from the Saved Task
 * @param {string} Prio -Priority from the Saved Task
 */
function editTask(title, category, dueDate, description, positionID, id, Prio){
    oldTask = []
    document.getElementById("overlay").onclick = null;
    let addTaskSection = document.getElementById("detailCard")
    oldTask.push (title)
    addTaskSection.innerHTML = fillEditTaskSection(title, category, dueDate, description, positionID, id,);
    checkPrioEdit(Prio);
    checkboxHelp(id);
    setMinDate();
}

/**
 * This function Mark the right priority button at the Edit popup
 */
function checkPrioEdit(prioCheck){
    prio = prioCheck
    if(prio == ""){}else{
    document.getElementById(`${prioCheck}`).classList.add (`color${prioCheck}`);
    document.getElementById(`${prioCheck}Color`).classList.add (`d-none`);
    document.getElementById(`${prioCheck}White`).classList.remove (`d-none`);}
}

/**
 * This Function delete the old Task when the title change
 * 
 * @param {string} path - Give the path frome firebase. 
 */
async function deleteForEdit(path) {
    let firebaseURL = "http://127.0.0.1:8000/join/tasks/" + path + ".json"
    if (event) event.preventDefault();
    try {
      const response = await fetch(firebaseURL, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'}
      });
      if (response.ok) {
      } else {console.error('Fehler beim Löschen des Tasks:', response.statusText);}
  } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
  }}

  /**
   * This help function edit the Saved task at firebase 
   * 
   * @param {string} positionID - Position from the Saved Task
   * @param {number} id - Id from the Saved Task
   */
 async function editTaskPopup(positionID, id){
    let button = document.getElementById("editTaskButton");
    button.disabled = true;
    let template = putTemplate(positionID);
    let pk = document.getElementById(`primaryKey${id}`).innerHTML
    putData(pk, template)
    closeDetailCardX();
    loadTasks();
  }

  async function putData(id, data){
    if (event) event.preventDefault();

  const payload = data;

  try {
    let response = await fetch(`http://127.0.0.1:8000/join/tasks/${id}/`, {
      method: "PUT",
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

  /**
   * This function close the Assign to List at the form.
   */
  function hideAssignlist() {
    document.getElementById("hideAssignlist").classList.add("d-none");
    document.getElementById("assingedList").classList.add("d-none");
    renderSelectedContacts();
  }

  /**
   * This Open and generate the Assign to List at the form.
   */
  async function generateAssingTo() {
    await loadContacts();
    if (document.getElementById("assingedList").innerHTML === "") {
      let assigned = "";
      for (let i = 0; i < contacts.length; i++) {
        const element = contacts[i].name;
        const circle = generateCircle(element);
        const isChecked = selectedCheckboxes.includes(element) ? "checked" : "";
        assigned += generateAssingToTemplate(i, circle, element, isChecked);}
      document.getElementById("assingedList").innerHTML = assigned;}
    document.getElementById("hideAssignlist").classList.remove("d-none");
    document.getElementById("assingedList").classList.remove("d-none");}

/**
 * This function limit the text length on the Task Card
 * 
 * @param {string} text - Is the text to shorten.
 */
function limitTextLength(text) {
    if (text.length > 50) {
      content = text.slice(0, 50) + "...";
    } else {content = text;}
    return content;
  }

/**
 * This function returns the correct date format.
 * 
 * @param {number} dateString - Is the original date format
 */
function formatDateToDDMMYYYY(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  
/**
 * This function check witch Category is used and return the correct class.
 * 
 * @param {string} category - Is the used Category
 */
function checkCategory(category) {
    if (category === "Technical Task") {
      catClass = "technical";
    } else if (category === "User Story") {
      catClass = "user";
    } else if (category === "") {
      catClass = "";}
    return catClass;
  }

/**
 * This function check the used Priority and returns the correct img src.
 * 
 * @param {string} prio 
 */
function checkPrio(prio) {
    const urgent = "./assets/img/icon_PrioAltaRed.svg";
    const medium = "./assets/img/icon_PrioMediaOrange.svg";
    const low = "./assets/img/icon_PrioBajaGreen.svg";
    if (prio === "urgent") {
      prioImgSrc = urgent;
    } else if (prio === "medium") {
      prioImgSrc = medium;
    } else if (prio === "low") {
      prioImgSrc = low;
    } else {
      prioImgSrc = "";}
    return prioImgSrc;
  }

/**
 * This function generate a random color for the Background for contact initials at the Task card.
 */
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

/**
* This function clear the board.
*/
function emptyContent() {
    document.getElementById(`toDo`).innerHTML = `<div id="toDoPlaceholder" class="noTask d-flex"><p>No tasks To do</p></div>`;
    document.getElementById(`inProgress`).innerHTML = `<div id="progressPlaceholder" class="noTask d-flex"><p>No tasks In progress</p></div>`;
    document.getElementById(`awaitFeedback`).innerHTML = `<div id="feedbackPlaceholder" class="noTask d-flex"><p>No tasks Await feedback</p></div>`;
    document.getElementById(`done`).innerHTML = `<div id="donePlaceholder" class="noTask d-flex"><p>No tasks Done</p></div>`;
  }

/**
 * This function focus the inputfield when click at the div container detectet. 
 * 
 * @param {string} inputId - Is the ID from the inputfield wich are clicked.
 */
function focusInput(inputId) {
    document.getElementById(inputId).focus();
  }

/**
 * This function check if the div container contains task else show Placeholder.
 */
function checkPlaceholderVisibility() {
    const sections = [
      { container: document.getElementById("toDo"),
        placeholder: document.getElementById("toDoPlaceholder"),},
      { container: document.getElementById("inProgress"),
        placeholder: document.getElementById("progressPlaceholder"),},
      { container: document.getElementById("awaitFeedback"),
        placeholder: document.getElementById("feedbackPlaceholder"),},
      { container: document.getElementById("done"),
        placeholder: document.getElementById("donePlaceholder"),},];
    for (const section of sections) {
      const hasContent = section.container.querySelectorAll(".card").length > 0;
      section.placeholder.style.display = hasContent ? "none" : "flex";}}

/**
 * This function close the detail card at click at the cross.
 */
function closeDetailCardX() {
    document.getElementById("overlay").classList.add("d-none");
    document.getElementById("overlay").classList.remove("d-flex");
    if (document.getElementById("body").classList.contains("scrollhidden")) {
      document.getElementById("body").classList.remove("scrollhidden");}
    document.getElementById("overlay").onclick = closeDetailCard;}

/**
 * This function check keydown enter key.
 * 
 * @param {event} event 
 * @param {string} inputId - Id from inputfield
 */
function checkEnter(event, inputId) {
    const enabledInputs = ["subTaskAdd"];
    if (event.key === "Enter" && enabledInputs.includes(inputId)) {
      addSubTask();
    }
  }

/**
 * This function remove all highlihts from the priority at the form
 *  
 */
function removeOtherClasslist() {
    document.getElementById(`urgent`).classList = ``;
    document.getElementById(`urgentColor`).classList = ``;
    document.getElementById(`urgentWhite`).classList = `d-none`;
    document.getElementById(`medium`).classList = ``;
    document.getElementById(`mediumColor`).classList = ``;
    document.getElementById(`mediumWhite`).classList = `d-none`;
    document.getElementById(`low`).classList = ``;
    document.getElementById(`lowColor`).classList = ``;
    document.getElementById(`lowWhite`).classList = `d-none`;
  }
  
  /**
   * This function open the Subtask Input
   */
  function openAddSubTask() {
    document.getElementById("activSubTask").classList.remove("d-none");
    document.getElementById("activSubTask").classList.add("d-flex");
    document.getElementById("subTaskPlus").classList.add("d-none");
  }
  
/**
* This function close the subtask input
*/
  function cancelSubTask() {
    document.getElementById("subTaskAdd").value = "";
    document.getElementById("activSubTask").classList.add("d-none");
    document.getElementById("activSubTask").classList.remove("d-flex");
    document.getElementById("subTaskPlus").classList.remove("d-none");
    event.stopPropagation();
  }
  
  /**
   * This function change the highlight from the priority at the form
   * 
   * @param {string} p - variable for the priority
   */
  function addClasslist(p) {
    document.getElementById(`${p}`).classList = `color${p}`;
    document.getElementById(`${p}Color`).classList = `d-none`;
    document.getElementById(`${p}White`).classList = ``;
  }
  
  /** 
   * This function remove the highlight from the priority at the form when other prio set
   * 
   * @param {string} p - variable for the priority
   */
  function removeClasslist(p) {
    document.getElementById(`${p}`).classList = ``;
    document.getElementById(`${p}Color`).classList = ``;
    document.getElementById(`${p}White`).classList = `d-none`;
  }

/**
 * This function set the priority to the selectet.
 * 
 * @param {string} p - variable for the priority
 */
function setPrio(p) {
    event.preventDefault();
    const prios = p;
    if (prio == p) {
      prio = "";
    } else {
      prio = p;
    }
    if (document.getElementById(`${p}`).classList.contains(`color${p}`)) {
      removeClasslist(p);
    } else {
      removeOtherClasslist();
      addClasslist(p);
    }}

/**
 * This function switch the checkmark in the form at the assign list when cklicked
 * 
 * @param {*} i - is the number from the container ID
 */
function checkboxshow(i){
    if(document.getElementById(`check${i}`).classList.contains("d-none")){
      document.getElementById(`container${i}`).classList.add ("backgroundAssing")
    document.getElementById(`check${i}`).classList.remove ("d-none");
    document.getElementById(`mark${i}`).classList.add ("d-none");
    updateSelectedCheckboxes();}
    else {
      document.getElementById(`container${i}`).classList.remove ("backgroundAssing")
      document.getElementById(`check${i}`).classList.add ("d-none");
    document.getElementById(`mark${i}`).classList.remove ("d-none");
    updateSelectedCheckboxes();
    }
  }

/**
 * This funtion show the confirmation Massage when the form are submit.
 */
function showConfirmationMessage() {
    const messageElement = document.getElementById('confirmationMessage');
    messageElement.classList.remove('hidden');
    messageElement.classList.add('show');
    setTimeout(() => {
      messageElement.classList.remove('show');
      messageElement.classList.add('hidden');
    }, 900); }

/**
 * This funtion show the Massage and mark the date input red when the date in the past.
 */
function pastDate(){
    document.getElementById("pastDate").classList.remove("d-none");
    document.getElementById("addTaskDate").classList.add ("outlineRed");
      return false
  }