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
// let chatData = firebase.ref("/chat");
// let playersRef = database.ref("players");
// let currentTurnRef = database.ref("turn");

// Initialize game variables
let username = "Guest";
let currentPlayers = null;
let currentTurn = null;
let playerNum = false;
let playerOneExists = false;
let playerTwoExists = false;
let playerOneData = null;
let playerTwoData = null;

// Create HTML Dom references
let loginBtn = $("#login-btn");
let usernameText = $("#username-text");

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

    // Run logUserIntoGameFunc
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

    // Run logUserIntoGameFunc
  }
});
