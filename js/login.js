async function login(event) {
    event.preventDefault();   
    const email = document.getElementById('inputEmailLogIn').value;
    const password = document.getElementById('inputPasswordLogIn').value;
    await loadUsers();
    const matchedUser = usersArray.find(user => user.mail === email && user.password === password);
    if (matchedUser) {
        localStorage.setItem("user", JSON.stringify(matchedUser));
        window.location.href = "./summary.html";
    } else {   
        displayErrorMessage("E-Mail oder Passwort sind falsch", document.getElementById("Loginerror"));
    }
}
