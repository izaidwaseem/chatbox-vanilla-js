let Users = [];

const checkEmail = (email) => {
    for (const userId in Users) {
        if (Users[userId].email === email) {
            return true;
        }
    }
    return false;
};

const checkPassword = (email, password) => {
    for (const userId in Users) {
        if (Users[userId].email === email && Users[userId].password === password) {
            return true; // Email and password match for a user
        }
    }
    return false; // No matching email-password pair found
};

let loggedUser = JSON.parse(localStorage.getItem('LoggedUser')) || {};

const login = (event) => {
    event.preventDefault();

    const emailValue = document.getElementById('inputEmail').value;
    const passwordValue = document.getElementById('inputPassword').value;

    

    var date = new Date();
    var loggedInTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (emailValue.trim() === '' || passwordValue.trim() === '') {
        const errorDisplay = document.querySelector('.error');
        errorDisplay.textContent = 'Please fill in both email and password fields.';
    } else if (checkEmail(emailValue) && checkPassword(emailValue, passwordValue)) {
        const matchingUser = Users.find((user) => user.email === emailValue);
        if (matchingUser) {
            let newLogin = {
                loginId: matchingUser.key,
                loginEmail: emailValue,
                loginPassword: passwordValue,
                loggedInTime: loggedInTime,
                fName: matchingUser.fName, 
                lName: matchingUser.lName,
            };
            loggedUser = newLogin; 
            localStorage.setItem('LoggedUser', JSON.stringify(loggedUser));

            // Update the loggedInTime for the matchingUser in the Users array
            matchingUser.loggedInTime = loggedInTime;
            localStorage.setItem('Users', JSON.stringify(Users)); // Save the updated Users array to localStorage

            alert('Login Successful!');
            window.location.href = './chatbox.html';
        }
    } else {
        const errorDisplay = document.querySelector('.error');
        errorDisplay.textContent = 'Invalid email or password. Please enter valid credentials.';
    }
};

const logout = () => {
    loggedUser = {}; // Clear the loggedUser object
    localStorage.removeItem('LoggedUser'); // Remove the loggedUser from localStorage
    window.location.href = './login.html'; // Redirect the user to the login page
};


window.onload = function () {
    if (localStorage) {
        Users = JSON.parse(localStorage.getItem('Users')) || {};
    } else {
        console.log('local storage not found');
    }
};
