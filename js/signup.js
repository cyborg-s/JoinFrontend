/**
 * Handles the sign-up process by validating user inputs, checking email availability,
 * verifying password match, and creating a new user if all inputs are correct.
 *
 * @param {Event} event - The event triggered by the form submission.
 */
async function handleSignUp(event) {
  event.preventDefault();
  const usersArray = await loadUsers();
  let emailField = document.getElementById("inputSignUpMail");
  let passwordField = document.getElementById("inputSignUpPassword1");
  let confirmPasswordField = document.getElementById("inputSignUpPassword2");
  let acceptCheckbox = document.getElementById("checkboxAccept");
  if (!acceptCheckbox.checked) {
    displayErrorMessage("You must accept the terms of use", acceptCheckbox);
    return;
  }
  if (!checkEmailAvailability(usersArray, emailField.value)) {
    displayErrorMessage("Email is already registered", emailField);
    return;
  }
  let newUser = buildUserObject();
  if (await verifyPassword(newUser, passwordField, confirmPasswordField)) {
    createContact(newUser);
    showSuccessMessage();
  }
}

/**
 * Checks if the provided email is available for registration.
 *
 * @param {Array} usersArray - An array of existing users.
 * @param {string} email - The email address to check.
 * @returns {boolean} True if the email is available, otherwise false.
 */
async function checkEmailAvailability(usersArray, email) {
  return !usersArray.some((user) => user.mail === email); // Returns true if email is available
}

/**
 * Verifies if the password and confirmation match and saves the user if correct.
 *
 * @param {Object} user - The user object with form data.
 * @param {HTMLElement} passwordField - The password input field.
 * @param {HTMLElement} confirmPasswordField - The confirm password input field.
 * @returns {boolean} True if passwords match, otherwise false.
 */
async function verifyPassword(user, passwordField, confirmPasswordField) {
  const password = passwordField.value.trim();
  const confirmPassword = confirmPasswordField.value.trim();
  if (!password || !confirmPassword) {
    displayErrorMessage("Passwords cannot be empty", confirmPasswordField);
    return false;
  }
  if (password === confirmPassword) {
    await submitData("registration", user);
    return true;
  } else {
    displayErrorMessage("Passwords do not match", confirmPasswordField);
    return false;
  }
}

/**
 * Loads user data from the server or data source.
 *
 * @returns {Array} An array of user objects.
 */
async function loadUsers() {
  let usersArray = [];
  let usersData = await fetchData("users");
  for (let [userID, userData] of Object.entries(usersData || {})) {
    userData.id = userID;
    usersArray.push(userData);
  }
  return usersArray;
}

/**
 * Displays an error message below the input field and highlights the field in red.
 *
 * @param {string} message - The error message to display.
 * @param {HTMLElement} targetElement - The input field to highlight.
 */
function displayErrorMessage(message, targetElement) {
  let errorElement = document.getElementById("passwordIncorrect");
  errorElement.innerText = message;
  targetElement.style.border = "2px solid red";
}

/**
 * Builds a user object from the form data.
 *
 * @returns {Object} The created user object.
 */
function buildUserObject() {
  let name = document.getElementById("inputSignUpName").value;
  let email = document.getElementById("inputSignUpMail").value;
  let password = document.getElementById("inputSignUpPassword1").value;
  return { name, initials: getInitials(name), password, mail: email };
}

/**
 * Displays a success message and redirects to the home page after 1.5 seconds.
 */
function showSuccessMessage() {
  document.getElementById("bgSignupSuccesfully").classList.remove("d-none");
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 1500);
}

/**
 * Extracts initials from the user's name.
 *
 * @param {string} name - The user's full name.
 * @returns {string} The initials of the user's name.
 */
function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Creates a guest user and saves it in the LocalStorage.
 * Then redirects the user to the summary page.
 */
async function guestLogin() {
  const email = "Guest@Guest.de";
  const password = "GuestLogIn";
  const remember = document.getElementById("remember-me");
  try {
    const response = await fetch("http://localhost:8000/join/api-token-auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Login fehlgeschlagen");
    }
    const data = await response.json();
    if (remember.checked == true) {
      localStorage.setItem(
        "user",
        JSON.stringify({token: data.token, name: data.first_name, email: data.email, remember: true,
        })
      );
    } else {
      localStorage.setItem(
        "user",
        JSON.stringify({token: data.token, name: data.first_name, email: data.email, remember: false,})
      );
    }
    window.location.href = "./summary.html";
  } catch (error) {
    console.error("Login-Fehler:", error);
    displayErrorMessageLogin("E-Mail oder Passwort sind falsch");
  }
}

/**
 * Verifies the email and password and logs the user in if they match.
 * Displays an error message if the email or password is incorrect.
 */
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember-me");
  try {
    const response = await fetch("http://localhost:8000/join/api-token-auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Login fehlgeschlagen");
    }
    const data = await response.json();
    if (remember.checked == true) {
      localStorage.setItem(
        "user",
        JSON.stringify({token: data.token, name: data.first_name, email: data.email, remember: true,})
      );
    } else {
      localStorage.setItem(
        "user",
        JSON.stringify({ token: data.token, name: data.first_name, email: data.email, remember: false,})
      );
    }
    window.location.href = "./summary.html";
  } catch (error) {
    console.error("Login-Fehler:", error);
    displayErrorMessageLogin("E-Mail oder Passwort sind falsch");
  }
}

function displayErrorMessageLogin(massage) {
  document.getElementById("passwordError").innerHTML = massage;
}

/**
 * Handles the login form submission, validates inputs, and calls the login function.
 *
 * @param {Event} event - The event triggered by the form submission.
 */
function handleLogin(event) {
  event.preventDefault(); // Prevent form submission
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  loginUser(emailInput, passwordInput); // Perform login
}

/**
 * Verifies if the user exists with the provided email and password.
 * If found, logs the user in; otherwise, displays an error message.
 *
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 */
async function loginUser(email, password) {
  const usersArray = await loadUsers();
  const matchedUser = usersArray.find(
    (user) => user.mail === email && user.password === password
  );
  if (matchedUser) {
    saveUserToLocal(matchedUser);
    redirectToSummary();
  } else {
    showLoginErrorMessage("E-Mail or password are incorrect");
  }
}

/**
 * Saves the user data in LocalStorage to make it available on other pages.
 *
 * @param {Object} user - The user data to save.
 */
function saveUserToLocal(user) {
  const userString = JSON.stringify(user);
  localStorage.setItem("user", userString);
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
  window.location.href = "./summary.html"; // Redirect to summary page
}

/**
 * Displays a login error message if the login fails.
 *
 * @param {string} message - The error message to display.
 */
function showLoginErrorMessage(message) {
  const loginErrorElement = document.getElementById("Loginerror");
  loginErrorElement.classList.remove("d-none");
  loginErrorElement.innerHTML = message;
}
