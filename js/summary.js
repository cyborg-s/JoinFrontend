let task = [];
let BASE_URL_TASK = "http://127.0.0.1:8000/join/tasks/";

/**
 * This function is used to Load saved Task from Firebase.
 * 
 */
async function loadTask() {
  try {const response = await fetch(`${BASE_URL_TASK}`);
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Daten: ${response.statusText}`);}
    const taskData = await response.json();
    if (!taskData) {
      console.error("Keine Daten aus Firebase erhalten oder Daten sind leer.");
      return;}
    task.length = 0;
    for (const key in taskData) {
      if (taskData.hasOwnProperty(key)) {
        task.push(taskData[key]);
      }}} catch (error) {console.error("Fehler beim Laden der Daten:", error);}
  updateSummary();}

/**
 * This function updates the summary page with the data from the Board.
 * 
 */ 
function updateSummary() {
    const positionCounts = {toDo: 0, done: 0, awaitFeedback: 0, inProgress: 0,};
    let totalTasks = 0;
    let urgentTasks = 0;
    let earliestDueDate = null;
    task.forEach(task => {totalTasks++;
      if (task.PositionID in positionCounts) {
        positionCounts[task.PositionID]++;}
      if (task.prio === "urgent") {
        urgentTasks++;
        if (!earliestDueDate || new Date(task.due_date) < new Date(earliestDueDate)) {
          earliestDueDate = task.due_date;}}});
    document.getElementById('assignments').innerText = `${totalTasks}`;
    document.getElementById('todo').innerText = `${positionCounts.toDo}`;
    document.getElementById('done').innerText = `${positionCounts.done}`;
    document.getElementById('pending-response').innerText = `${positionCounts.awaitFeedback}`;
    document.getElementById('ongoing-task').innerText = `${positionCounts.inProgress}`;
    document.getElementById('high-priority').innerText = `${urgentTasks}`;
    document.getElementById('end-date').innerText = earliestDueDate ? `${earliestDueDate}` : 'No urgent tasks found.';}