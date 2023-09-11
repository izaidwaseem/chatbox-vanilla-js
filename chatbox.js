let Users = JSON.parse(localStorage.getItem('Users')) || [];
let loggedUser = JSON.parse(localStorage.getItem('LoggedUser')) || {};

let clickedName = [];
let displayName = '';
let conversationListHTML = '';
let messageId = 0;
let loginTime = '';
let clickedUserKey = null;

// Check if the loggedUser object is empty (not authenticated)
let isEmpty = true;

for (const key in loggedUser) {
  isEmpty = false;
  break;
}
if (isEmpty) {
  window.location.href = './login.html';
}

//function to get the name of user who logged in
const getName = () => {
    const loggedInEmail = loggedUser.loginEmail;
    const matchingUser = Users.find((user) => user.email === loggedInEmail);

    if (matchingUser) {
        return matchingUser.fName + ' ' + matchingUser.lName;
    } else {
        return "Unknown User";
    }
};
displayName = getName();


//function to get the login time of the logged-in user
const getLoginTime = (users) => {
    const loggedInUser = users.find((user) => user.key === loggedUser.loginId);
    return loggedInUser.loggedInTime
}
loginTime = getLoginTime(Users);

//function to generate random badge numbers
function getRandomNumber() {
    return Math.floor(Math.random() * 10 + 1);
}  

//function to get current time
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;
    
    // Convert hours to string and pad with leading zero if needed
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes} ${ampm}`;
}


//function to get current time plus one hour
function getCurrentTimePlusOneHour() {
    const now = new Date();
    
    // Add one hour to the current time
    now.setHours(now.getHours() + 1);
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Convert hours to string and pad with leading zero if needed
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes} ${ampm}`;
}


//function to generate conversation list 
function generateConversationListItems(users){
    users.forEach((user, index) => {
        if (user.key !== loggedUser.loginId) {
            const { fName, lName } = user;
            const avatar = `${fName.charAt(0)}${lName.charAt(0)}`;
            var badgeNum = getRandomNumber();

            const listItemHTML = `
                <li class="p-2 border-bottom conversation-person">
                    <a class="d-flex justify-content-between"> 
                        <div class="d-flex flex-row">
                            <div>
                                <h5 class="d-flex align-self-center me-3 avatar-img">${avatar}</h5>
                                <span class="badge bg-success avatar-badge"></span>
                            </div>
                            <div class="pt-1">
                                <p class="fw-bold mb-0 chat-name">${fName} ${lName}</p>
                                <p class="small text-muted">Hello, Are you there?</p>
                            </div>
                        </div>
                        <div class="pt-1">
                            <p class="small text-muted mb-1">${loginTime}</p>
                            <span class="badge bg-primary rounded-pill float-end">${badgeNum}</span>
                        </div>
                    </a>
                </li>
            `;
            conversationListHTML += listItemHTML;            
        }
    });
    conversationListContainer.innerHTML = conversationListHTML;
    addEventListenersToConversationItems();    
}


function generateMessageList(chatKey, clickedUserAvatar) {
    const messagesContainer = document.getElementById('messagesContainer');

    if (!messagesContainer) {
        return; 
    }

    // Check if the chatKey exists in localStorage and retrieve the messages if available
    const localStorageData = JSON.parse(localStorage.getItem('Users'));
    const currentUser = localStorageData.find((user) => user.key === loggedUser.loginId);
    const chatHistory = currentUser?.chatHistory || [];
    let messages = chatHistory.find((entry) => entry.chatKey === chatKey)?.message || [];
  
    // If there are no messages for this chatKey 
    if (messages.length === 0) {
        return;
    }

    messages = userMessagesMap[chatKey]?.messages || [];

    // Generate HTML for each message
    let messagesHTML = '';
    messages.forEach((message, index) => {
        if (message.SID === loggedUser.loginId) {
            // Message sent by the logged-in user (display on the right)
            messagesHTML += `
                <div class="d-flex flex-row justify-content-end">
                    <div>
                        <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary message-text">${message.text}
                            <img class="text-menu" src="./images/dots (1).png" alt="dots-icon" height="15px" width="15px" >
                        </p>
                        <ul class="list-unstyled message-options" style="display: none;">
                            <li onclick=deleteText(${message.MID})>Delete For Me
                                <img class="text-menu" src="./images/delete (1).png" alt="dots-icon" height="15px" width="15px" >
                            </li>
                            <li onclick=deleteTextForEveryone(${message.MID})>Delete For Everyone
                                <img class="text-menu" src="./images/delete (2).png" alt="dots-icon" height="15px" width="15px">
                            </li>
                            <li onclick=editText(${message.MID})>Edit Message
                                 <img class="text-menu" src="./images/pencil.png" alt="dots-icon" height="15px" width="15px" >
                            </li>
                        </ul>
                        <p class="small me-3 mb-3 rounded-3 text-muted">${message.time}</p>
                    </div>
                </div>
            `;
        } else {
            // Message sent by the other user (display on the left)
            messagesHTML += `
                <div class="d-flex flex-row justify-content-start">
                    <div>
                        <p class="small p-2 ms-3 mb-1 rounded-3" style="background-color: #f5f6f7;">${message.text}
                            <img class="text-menu" src="./images/menu.png" alt="dots-icon" height="15px" width="15px" >
                        </p>
                        <ul class="list-unstyled message-options" style="display: none;">
                            <li onclick=deleteText(${message.MID})>Delete For Me
                                <img class="text-menu" src="./images/delete (1).png" alt="dots-icon" height="15px" width="15px" >
                            </li>
                        </ul>
                        <p class="small ms-3 mb-3 rounded-3 text-muted float-end">${message.time}</p>
                    </div>
                </div>
            `;
        }
    });

    messagesContainer.innerHTML = messagesHTML;

    // Add event listeners to the new message options
    const messageOptionsElements = messagesContainer.querySelectorAll('.message-options');
    messageOptionsElements.forEach(messageOptions => {
        const textMenu = messageOptions.previousElementSibling;
        textMenu.addEventListener('click', () => {
            //console.log("Three dots clicked");
            if (messageOptions.style.display === 'block') {
                messageOptions.style.display = 'none';
            } else {
                messageOptions.style.display = 'block';
            }
        });
    });

}

function deleteText(messageId) {
    const userKey = clickedUserKey;

    // Get the logged user's chat history from local storage
    const usersInLocalStorage = JSON.parse(localStorage.getItem("Users"));
    const currentLoggedUser = usersInLocalStorage.find((user) => user.key === loggedUser.loginId);

    if (currentLoggedUser) {
        // Find the chat history entry for the clicked user
        const chatHistoryEntryIndex = currentLoggedUser.chatHistory.findIndex(
            (entry) => entry.chatKey === userKey
        );

        // If the chat history entry exists, remove the message from the logged user's chat history
        if (chatHistoryEntryIndex !== -1) {
            const messages = currentLoggedUser.chatHistory[chatHistoryEntryIndex].message;
            const updatedMessages = messages.filter((message) => message.MID !== messageId);
            currentLoggedUser.chatHistory[chatHistoryEntryIndex].message = updatedMessages;

            // Save the updated chat history to local storage
            localStorage.setItem("Users", JSON.stringify(usersInLocalStorage));

            // Update the userMessagesMap for the logged-in user (if needed)
            if (userMessagesMap[userKey]) {
                userMessagesMap[userKey].messages = updatedMessages;
            }

            // Update the UI by generating the message list again
            generateMessageList(userKey);
        }
    }
}

// Function to parse the time string to a Date object (12-hour format)
function parseTimeStringToDate(timeString) {
    const [time, ampm] = timeString.split(" ");
    const [hours, minutes] = time.split(":");
    let hoursValue = parseInt(hours);

    if (ampm === "PM" && hoursValue !== 12) {
        hoursValue += 12;
    } else if (ampm === "AM" && hoursValue === 12) {
        hoursValue = 0;
    }

    return new Date().setHours(hoursValue, minutes, 0, 0);
}


// Function to delete text on both sides
function deleteTextForEveryone(messageId) {
    const userKey = clickedUserKey;

    // Find the clicked user's chat history in the userMessagesMap
    const userChatHistory = userMessagesMap[userKey]?.messages || [];

    // Find the index of the message to be deleted in the chat history
    const messageIndex = userChatHistory.findIndex((message) => message.MID === messageId);

    // If the message is found in the chat history, check the time difference
    if (messageIndex !== -1) {
        const messageTime = parseTimeStringToDate(userChatHistory[messageIndex].time);
        //console.log(messageTime);
        const currentTime = new Date();
        const timeDifferenceInMinutes = Math.floor((currentTime - messageTime) / (1000 * 60));

        // Check if the time difference is less than or equal to one hour (60 minutes)
        if (timeDifferenceInMinutes <= 60) {
            // Delete the message
            userChatHistory.splice(messageIndex, 1);

            // Save the updated chat history to local storage and update the UI
            updateUserMessageMap(userKey, userChatHistory, userChatHistory.length);
            generateMessageList(userKey);
            saveChatHistoryToLocalStorage();
        } else {
            // Notify the user that deletion is not allowed
            alert("Deletion not allowed. The message is older than one hour.");
        }
    }
}

//function to edit messages
function editText(messageId) {
    const userKey = clickedUserKey;

    const userChatHistory = userMessagesMap[userKey].messages || [];
    const messageIndex = userChatHistory.findIndex((message) => message.MID === messageId);

    if (messageIndex !== -1) {
        const editedMessage = prompt('Edit your message:', userChatHistory[messageIndex].text);

        if (editedMessage !== null) {
            userChatHistory[messageIndex].text = editedMessage;
            userChatHistory[messageIndex].time = getCurrentTime(); // Update the timestamp to current time

            // Save the updated chat history to local storage and update the UI
            updateUserMessageMap(userKey, userChatHistory, userChatHistory.length);
            generateMessageList(userKey);
            saveChatHistoryToLocalStorage();
        }
    }
}

//function to display name of clicked user in conversation list and then rendering too
function handleConversationItemClick(user) {
    const { fName, lName, key } = user;
    clickedName = { fName, lName };

    const displayNameConversation = document.getElementById('displayNameConversation');
    displayNameConversation.textContent = `${fName} ${lName}`;

    const clickedUserAvatar = `${fName.charAt(0)}${lName.charAt(0)}`;
    const chatKey = key;
    generateMessageList(chatKey, clickedUserAvatar);

    clickedUserKey = user.key;

    // const conversationListContainer = document.querySelector('.message-list-container');
    // const messageContainer = document.querySelector('.message-container');
    // const backButton = document.querySelector('.back-button');

    // backButton.addEventListener('click', () => {
    //     // Hide the message container and show the conversation list container
    //     messageContainer.style.display = 'none';
    //     conversationListContainer.style.display = 'block';
    // });

    return { key, fName, lName };
}



//function to handle messages upon entering it
function sendMessageHandler(event) {
    if (event.keyCode === 13) {
        event.preventDefault();

        const inputText = event.target.value;
        const userKey = clickedUserKey; 

        // Create the messages array and lastAssignedMID for the current user
        if (!userMessagesMap[userKey]) {
            userMessagesMap[userKey] = {
                messages: [],
                lastAssignedMID: 0,
            };
        }

        // Create a new message object with the unique messageId
        const newMessage = {
            MID: userMessagesMap[userKey].lastAssignedMID,
            SID: loggedUser.loginId,
            text: inputText,
            time: getCurrentTime(),
        };

        // Increment the last assigned MID for the current user
        userMessagesMap[userKey].lastAssignedMID++;

        // Add the new message to the messages array
        userMessagesMap[userKey].messages.push(newMessage);

        // Save the chat history after adding the new message
        saveChatHistoryToLocalStorage();

        // Generate the updated message list for the clicked user
        generateMessageList(userKey);

        event.target.value = "";
    }
}

// Function to load chat history from local storage
function loadChatHistoryFromLocalStorage() {
    const usersInLocalStorage = JSON.parse(localStorage.getItem("Users"));
    const currentLoggedUser = usersInLocalStorage.find(
      (user) => user.key === loggedUser.loginId
    );
  
    if (currentLoggedUser) {
      const chatHistory = currentLoggedUser.chatHistory || [];
  
      chatHistory.forEach((entry) => {
        userMessagesMap[entry.chatKey] = {
          messages: entry.message,
          lastAssignedMID: entry.message.length,
        };
      });
    }

     // Call generateMessageList for each chatKey in the userMessagesMap
     Object.keys(userMessagesMap).forEach(chatKey => {
        generateMessageList(chatKey);
    });
}

// Create a map to store messages for each user
const userMessagesMap = {};
loadChatHistoryFromLocalStorage();


function updateUserMessageMap(userKey, messages, lastAssignedMID) {
    userMessagesMap[userKey] = {
      messages,
      lastAssignedMID,
    };
}


function addEventListenersToConversationItems() {
    const conversationItems = document.querySelectorAll('.message-list-container li.conversation-person');
    conversationItems.forEach((item) => {
        item.addEventListener('click', () => {
            const user = Users.find((user) => {
                const { fName, lName } = user;
                return `${fName} ${lName}` === item.querySelector('p.fw-bold.mb-0.chat-name').textContent;
            });

            if (user) {
                const userData = handleConversationItemClick(user);
                const textInput = document.getElementById("text-message-input");

                // Remove the existing event listener before adding a new one
                textInput.removeEventListener("keydown", sendMessageHandler);

                const userKey = userData.key;
                if (!userMessagesMap[userKey]) {
                    userMessagesMap[userKey] = {
                        messages: [],
                        lastAssignedMID: 0,
                    };
                }

                // Set the clickedUserKey
                clickedUserKey = userKey;
                textInput.addEventListener("keydown", sendMessageHandler);

                // Toggle classes based on screen size
                const conversationListContainer = document.querySelector('.message-list-container');
                const messageContainer = document.querySelector('.message-container');
                if (window.innerWidth <= 576) {
                    conversationListContainer.classList.add('show-on-mobile');
                    messageContainer.classList.remove('show-on-desktop');
                } else {
                    conversationListContainer.classList.remove('show-on-mobile');
                    messageContainer.classList.add('show-on-desktop');
                }

            }         
        });
    });
}


  
//function to save chat history in local storage
function saveChatHistoryToLocalStorage() {
    const usersInLocalStorage = JSON.parse(localStorage.getItem("Users"));
    const currentLoggedUser = usersInLocalStorage.find(
        (user) => user.key === loggedUser.loginId
    );

    if (currentLoggedUser) {
        const userKey = clickedUserKey;

        // Get or create the chat history array for the current logged-in user
        let chatHistory = currentLoggedUser.chatHistory || [];

        const chatHistoryEntryIndex = chatHistory.findIndex(
            (entry) => entry.chatKey === userKey
        );

        // Get the messages for the clicked user from the userMessagesMap
        const messages = userMessagesMap[userKey].messages || [];

        // Create newChatHistory with the updated messages
        let newChatHistory = {
            chatKey: userKey,
            name: clickedName,
            message: messages,
        };

        // If chat history entry exists, update it or just otherwise, push a new entry
        if (chatHistoryEntryIndex !== -1) {
            chatHistory[chatHistoryEntryIndex] = newChatHistory;
        } else {
            chatHistory.push(newChatHistory);
        }

        // Updating the chat history in the currentLoggedUser
        currentLoggedUser.chatHistory = chatHistory;

        localStorage.setItem("Users", JSON.stringify(usersInLocalStorage));

        // Saving the same chat history to the clicked user's chat history as well
        const clickedUser = usersInLocalStorage.find(
            (user) => user.key === userKey
        );

        if (clickedUser) {
            // Get or create the chat history array for the clicked user
            let clickedUserChatHistory = clickedUser.chatHistory || [];

            // Find the chat history entry for the logged-in user
            const clickedUserChatHistoryEntryIndex = clickedUserChatHistory.findIndex(
                (entry) => entry.chatKey === loggedUser.loginId
            );

            //newChatHistory for the logged-in user to save it both ways
            let newChatHistoryForClickedUser = {
                chatKey: loggedUser.loginId,
                name: {
                    fName: loggedUser.fName,
                    lName: loggedUser.lName,
                },
                message: messages,
            };

            // If chat history entry exists, update it; otherwise, push a new entry
            if (clickedUserChatHistoryEntryIndex !== -1) {
                clickedUserChatHistory[clickedUserChatHistoryEntryIndex] = newChatHistoryForClickedUser;
            } else {
                clickedUserChatHistory.push(newChatHistoryForClickedUser);
            }

            // Update the chat history in the clickedUser
            clickedUser.chatHistory = clickedUserChatHistory;
            localStorage.setItem("Users", JSON.stringify(usersInLocalStorage));
        }
    }
}

// Function to clear/delete chat history of the clicked User and update the chat history of the logged-in User
function clearChatHistoryFromLocalStorage() {
    const usersInLocalStorage = JSON.parse(localStorage.getItem("Users"));
    const currentLoggedUser = usersInLocalStorage.find((user) => user.key === loggedUser.loginId);

    if (currentLoggedUser) {
        const userKey = clickedUserKey;

        // Clear the chat history of the clicked user
        const clickedUser = usersInLocalStorage.find((user) => user.key === userKey);
        if (clickedUser) {
            clickedUser.chatHistory = [];
        }

        // Update the chat history of the logged-in user
        let chatHistory = currentLoggedUser.chatHistory || [];
        const chatHistoryEntryIndex = chatHistory.findIndex((entry) => entry.chatKey === userKey);

        // If the chat history entry exists, remove it
        if (chatHistoryEntryIndex !== -1) {
            chatHistory.splice(chatHistoryEntryIndex, 1);
        }

        delete userMessagesMap[userKey];

        // Save the changes to local storage
        localStorage.setItem("Users", JSON.stringify(usersInLocalStorage));
    }

    // Save the updated chat history to localStorage
    saveChatHistoryToLocalStorage();

    // Generate the updated message list for the logged-in user (for the conversation list)
    generateMessageList(loggedUser.loginId);

    // Generate the updated conversation list after clearing chat history
    generateConversationListItems(Users);
}


// appending or rendering data section //

// Set the welcome text
let displayNamePlaceholder = document.getElementById('displayNamePlaceholder');
displayNamePlaceholder.textContent = `Welcome ${displayName}!`;

// Append the generated conversation list items to the conversation list container
let conversationListContainer = document.getElementById('conversationList');
generateConversationListItems(Users);

// Initialize Perfect Scrollbar on the conversation lists
const conversationLists = document.querySelectorAll('.conversation-list');
conversationLists.forEach(list => {
    new PerfectScrollbar(list);
});

const menuMain = document.querySelector('.menu-main');
const mainOption = document.querySelector('.main-option');

menuMain.addEventListener('click', () => {
    if (mainOption.style.display === 'flex') {
        mainOption.style.display = 'none'; 
    } else {
        mainOption.style.display = 'flex'; 
    }
});




mainOption.addEventListener('click', () => {
    // console.log("console running");
    clearChatHistoryFromLocalStorage();
});

//function to logout and ensure that chatbox cant be accessed w/o logging in first
const logout = () => {
    loggedUser = {}; 
    localStorage.removeItem('LoggedUser'); 
    window.location.href = './login.html'; 
};
