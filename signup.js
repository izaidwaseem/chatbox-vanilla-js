let Users = [];
let key = 0;
let chatKey = 0;
    // localStorage.clear();

    window.onload = function () {
        const setError = (element, message) => {
            const inputControl = element.parentElement;
            const errorDisplay = inputControl.querySelector('.error');

            errorDisplay.innerText = message;
            inputControl.classList.add('error');
            inputControl.classList.remove('success');
        };
        

        const setSuccess = (element) => {
            const inputControl = element.parentElement;
            const errorDisplay = inputControl.querySelector('.error');

            errorDisplay.innerText = '';
            inputControl.classList.add('success');
            inputControl.classList.remove('error');
        };


        // Function to check if the email exists in the database
        const checkEmailInDatabase = (email) => {
                for (const user of Users) {
                    if (user.email === email) {
                        return true; // Email already exists
                    }
                }
                return false; // Email does not exist
            };


        if (localStorage) {
            Users = JSON.parse(localStorage.getItem('Users')) || [];
            key = Users.length;

            // Form field validation on input and blur events
            document.getElementById('inputfName').addEventListener('input', function () {
                const fNameValue = this.value.trim();
                if (fNameValue === '') {
                    setError(this, 'First Name is required');
                } else {
                    setSuccess(this);
                }
            });

            document.getElementById('inputfName').addEventListener('input', function () {
                const fNameValue = this.value.trim();
                if (fNameValue === '') {
                    setError(this, 'Last Name is required');
                } else {
                    setSuccess(this);
                }
            });

            document.getElementById('inputEmail').addEventListener('input', function(){
                const emailValue = this.value.trim();
                if (emailValue === ' '){
                    setError(this, 'Email is required');
                }
                else if (checkEmailInDatabase(emailValue)) {
                    setError(this, 'This email already exists');
                }
                else {
                    setSuccess(this);
                }
            });

            document.getElementById('inputPassword').addEventListener('input', function () {
                const passwordValue = this.value.trim();
                if (passwordValue === '') {
                    setError(this, 'Password is required');
                } else if (passwordValue.length < 8) {
                    setError(this, 'Password must be at least 8 characters.');
                } else {
                    setSuccess(this);
                }
            });

            

            document.getElementById('inputPassword2').addEventListener('input', function () {
                const passwordValue = document.getElementById('inputPassword').value.trim();
                const password2Value = this.value.trim();
                if (password2Value === '') {
                    setError(this, 'Please confirm your password');
                } else if (password2Value !== passwordValue) {
                    setError(this, "Password doesn't match");
                } else {
                    setSuccess(this);
                }
            });

            // Function to update the key value in localStorage
            function updateKeyInLocalStorage() {
                localStorage.setItem('key', key); // Save the updated key value in localStorage
            }

            // Form submission
                document.getElementById('signupForm').addEventListener('submit', function (event) {
                    event.preventDefault(); // Add this line to prevent default form submission

                    
                    if (validateInputs()) {
                        var fName = document.getElementById('inputfName').value;
                        var lName = document.getElementById('inputlName').value;
                        var email = document.getElementById('inputEmail').value;
                        var password = document.getElementById('inputPassword').value;
                        var password2 = document.getElementById('inputPassword2').value;

                        // var text = "hello my name is zaid";
                        // var SID = 1;
                       
                        const newUser = {
                            key: key,
                            fName: fName,
                            lName: lName,
                            email: email,
                            password: password,
                            password2: password2,
                            chatHistory: []
                        };

                        key++;
                        Users.push(newUser);
                    
                        localStorage.setItem('Users', JSON.stringify(Users));
                        document.getElementById('signupForm').reset();

                        alert('Registration successful');
                        console.log("console is running", Users);
                        // console.log(key);
                    }
                });

            } 
        else {
            console.log('local storage not found!');
        }

        function validateInputs() {
            const fNameValue = document.getElementById('inputfName').value.trim();
            const lNameValue = document.getElementById('inputlName').value.trim();
            const emailValue = document.getElementById('inputEmail').value.trim();
            const passwordValue = document.getElementById('inputPassword').value.trim();
            const password2Value = document.getElementById('inputPassword2').value.trim();

            let isValid = true;

            if (fNameValue === '') {
                setError(document.getElementById('inputfName'), 'First Name is required');
                isValid = false;
            } else {
                setSuccess(document.getElementById('inputfName'));
            }

            if (lNameValue === '') {
                setError(document.getElementById('inputlName'), 'Last Name is required');
                isValid = false;
            } else {
                setSuccess(document.getElementById('inputlName'));
            }

            if (emailValue === '') {
                setError(document.getElementById('inputEmail'), 'Email is required');
                isValid = false;
            } 
            else if(checkEmailInDatabase(emailValue)){
                setError(document.getElementById('inputEmail'), 'This email already exists');
                invalid = false;
                return;
            }
            else {
                setSuccess(document.getElementById('inputEmail'));
            }

            if (passwordValue === '') {
                setError(document.getElementById('inputPassword'), 'Password is required');
                isValid = false;
            } else if (passwordValue.length < 8) {
                setError(document.getElementById('inputPassword'), 'Password must be at least 8 characters.');
                isValid = false;
            } else {
                setSuccess(document.getElementById('inputPassword'));
            }

            if (password2Value === '') {
                setError(document.getElementById('inputPassword2'), 'Please confirm your password');
                isValid = false;
            } else if (password2Value !== passwordValue) {
                setError(document.getElementById('inputPassword2'), "Password doesn't match");
                isValid = false;
            } else {
                setSuccess(document.getElementById('inputPassword2'));
            }

            return isValid;
        }
    }