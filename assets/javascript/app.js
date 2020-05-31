// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDD9_RFpr7ENcB-oJ8uUjge2T8OOgtcG58",
  authDomain: "rps-multiplayer-9e346.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-9e346.firebaseio.com",
  projectId: "rps-multiplayer-9e346",
  storageBucket: "rps-multiplayer-9e346.appspot.com",
  messagingSenderId: "567696946751",
  appId: "1:567696946751:web:c47ca8c4496ef268096a8a",
  measurementId: "G-8PQZ9VBD65",
};

firebase.initializeApp(firebaseConfig);

// Create variables to reference different parts of firebase data storage
var database = firebase.database();
console.log(database);
let chatCollection = database.ref("chat-data");
let playerList = database.ref("player-list");
let currentTurnRef = database.ref("turn-ref");

// Initialize game variables
let username = "Guest";
let currentPlayersCount = null;
let currentPhase = null;
let playerNum = false;
let playerOneExists = false;
let playerTwoExists = false;
let playerOneData = null;
let playerTwoData = null;

// Create HTML Dom references
// USERNAME
let directionsDisp = $("#directions-disp");
let loginBtn = $("#login-btn");
let usernameText = $("#username-text");

// CHAT
let sendChatBtn = $("#send-chat-btn");
let chatText = $("#chat-input");

// USER LOGIN GAME
// Create a function to log user into the game
let loginGameFunc = () => {
  // Create a reference to the chat data discussion log
  let chatDataLog = database.ref("/chat/" + Date.now());

  // Check for players currently logged into the game
  // If currentPlayersCount is less than two, meaning that there are no or only one player logged in
  if (currentPlayersCount < 2) {
    // Check to see that playerOne exists
    if (playerOneExists) {
      // Then that new player that just logged in is now player 2
      playerNum = 2;
    }
    // Else, that player is playerOne
    else {
      playerNum = 1;
    }

    // Access the playerRef collection in the database and create a key based on the assigned player number
    playerList = database.ref("/player-list/" + playerNum);

    // Create a player object with: username, wins, losses, and option choice
    playerList.set({
      username: username,
      wins: 0,
      losses: 0,
      choice: null,
    });

    // When they disconnect from the game, remove this user's player object from playerList
    playerList.onDisconnect().remove();

    // If a player disconnects, set the current turn to null so that the game does not continue

    currentTurnRef.onDisconnect().remove();

    // Send a disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
    chatDataLog.onDisconnect().set({
      userID: 0,
      username: username,
      time: firebase.database.ServerValue.TIMESTAMP,
      message: "has disconnected.",
    });

    // Remove name input box from directionsDisp
    directionsDisp.empty();

    // Create a HTML element that confirms player logged in
    let playerLoggedInMsg = $("<h3>").text(
      "Hi, " + username + "! You are Player " + playerNum
    );

    // And show that message in directionsDisp
    directionsDisp.append(playerLoggedInMsg);

    // Else, if playerNum is already at two (there are already two players logged in), alert user trying to log in that the game is currently full
  } else {
    alert("Sorry, the game is currently full!");
  }
};

// USERNAME
// Create a function to listen to user logging in
// On click of the loginBtn, run a function
loginBtn.click(function () {
  // That checks to see if the usernameText value is not equal to an empty string
  if (usernameText.val() !== "") {
    console.log(usernameText.val());
    // If so, set the username variable to be the value the user entered, capitalize first letter
    username =
      usernameText.val().charAt(0).toUpperCase() + usernameText.val().slice(1);
    console.log(username);

    // Run loginGameFunc
    loginGameFunc();
  }
});

// Create a function to listen to user logging in
// On ENTER press, run a function
usernameText.keypress(function (event) {
  // Check that the event key pressed is enter and the usernameText value is not equal to an empty string
  if (event.which === 13 && usernameText.val() !== "") {
    console.log(usernameText.val());
    // If so, set the username variable to be the value the user entered, capitalize first letter
    username =
      usernameText.val().charAt(0).toUpperCase() + usernameText.val().slice(1);
    console.log(username);

    // Run loginGameFunc
    loginGameFunc();
  }
});

// CHAT
// Create a function that listens for send chat button click
// On click of the sendChatBtn, run a function
sendChatBtn.click(function () {
  // Check to see that value of chatText is not empty
  if (chatText.val() !== "") {
    console.log(chatText.val());
    // If so, create a new variable to hold chat message
    let chatMessage = "";

    // Set chatMessage to equal the input value
    chatMessage = chatText.val();

    // Push an object to the chatData database containing: userID number, username of sender, their message, and a timestamp
    chatCollection.push({
      userID: playerNum,
      userName: userName,
      message: chatMessage,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });

    // Clear the input
    chatText.val("");
  }
});

// Create a function that listens for send chat ENTER key press
chatText.keypress(function (event) {
  // Check to see if keypress is ENTER and that the value of chatText is not empty
  if (event.which === 13 && chatText.val() !== "") {
    console.log(chatText.val());
    // If so, create a new variable to hold chat message
    let chatMessage = "";

    // Set chatMessage to equal the input value
    chatMessage = chatText.val();

    // Push an object to the chatData database containing: userID number, username of sender, their message, and a timestamp
    // Line 52

    // Clear the input
    chatText.val("");
  }
});

// Create a function that listens to database's chatCollection for when a new child (message) is detected, order each child (message) by time
// chatCollection.orderByChild("time").on(
//   "child_added",
//   function (snapshot) {
//     // Log everything that's coming out of snapshot
//     console.log(snapshot.val());

//     // Create a new HTML p tag element for the new message
//     let newMsg = $("<p>", {
//       class: "player-" + snapshot.val().idNum,
//     });

//     // Create a new HTML span tag element to hold new message text
//     let newMsgText = $("<span>", {
//       class: "player-" + snapshot.val().idNum + "-msg",
//     }).text(snapshot.val().name + ": " + snapshot.val().message);

//     // Construct the newMsg
//     newMsg.append(newMsgText);

//     // Append message to message list disp

//     // Keep div scrolled to bottom of each new updated message
//     //   $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
//   },
//   // Handle errors
//   (err) => {
//     console.log("Errors handled: " + err.code);
//   }
// );

// OPTIONS
// Create an on click listener for when a player selects a RPS option, run a function
$(document).on("click", "li", function () {
  // Get a handle on the option clicked
  let clickedOption = $(this);

  console.log("Clicked: " + clickedOption);

  // Get a handle on the option's data-option
  let clickOptionData = clickedOption
    .children("img.option-img")
    .attr("data-option");

  console.log(clickOptionData);

  // Set the player's opton choice in the current player object in firebase
  // Line 89
});

// Create a function that renders a battlefield box in the current action disp
// Take in player's option choice as a parameter
let renderBattlefieldFunc = (choice) => {
  // Create a new HTML element for battlefield disp
  let battlefieldDisp = $("<div>", {
    id: "battlefield-disp",
  });

  // Create a new HTML element for battle box
  let battleBox = $("<div>", {
    class: "battlefield-box",
  });

  // Create a new HTML element for row
  let battleBoxRow = $();

  // Create a new HTML element for p1 option col

  // Create a new HTML element for p2 option col
};
