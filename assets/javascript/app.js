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
let currentPlayers = null;
let currentTurn = 0;
let playerNum = false;
let playerOneExists = false;
let playerTwoExists = false;
let playerOneData = null;
let playerTwoData = null;

// Create HTML Dom references
// USERNAME
let usernameTextField = $("#username-text");
let usernameDisp = $("#username-disp");
let loginBtn = $("#login-btn");
let usernameText = $("#username-text");

// CHAT
let chatDisp = $("#chat-messages-disp");
let chatText = $("#chat-input");
let sendChatBtn = $("#send-chat-btn");

// Interaction Display
let interactionDisp = $("#interaction-disp");
let interactionText = $("#interaction-text");

// USERS
// Player 1
let p1Disp = $("#p1-disp");
let p1NameText = $("#p1-name-text");
let p1OptionsDisp = $("#p1-options-disp");
let p1ChoiceDisp = $("#p1-choice-disp");
let p1WinsText = $("#p1-wins-counter-text");
let p1TiesText = $("#p1-ties-counter-text");
let p1LossesText = $("#p1-losses-counter-text");

// Player 2
let p2Disp = $("#p2-disp");
let p2NameText = $("#p2-name-text");
let p2OptionsDisp = $("#p2-options-disp");
let p2ChoiceDisp = $("#p2-choice-disp");
let p2WinsText = $("#p2-wins-counter-text");
let p2TiesText = $("#p2-ties-counter-text");
let p2LossesText = $("#p2-losses-counter-text");

// ALL RENDERING FUNCTIONS HERE
// Create a function that dynamically renders RPS options to player 1/2 options disp
let renderOptionsFunc = (disp) => {
  // Create a HTML element for list item rock
  let liItemRock = $("<li>");

  // Create an img tag for list item rock
  let imgRock = $("<img>", {
    class: "option-img",
    dataOption: "rock",
    src: "./assets/images/rock.png",
    alt: "Rock",
  });

  // Construct li item for rock
  liItemRock.append(imgRock);

  // Create a HTML element for list item paper
  let liItemPaper = $("<li>");

  // Create an img tag for list item rock
  let imgPaper = $("<img>", {
    class: "option-img",
    dataOption: "paper",
    src: "./assets/images/paper.png",
    alt: "Paper",
  });

  // Construct li item for rock
  liItemPaper.append(imgPaper);

  // Create a HTML element for list item scissors
  let liItemScissors = $("<li>");

  // Create an img tag for list item rock
  let imgScissors = $("<img>", {
    class: "option-img",
    dataOption: "scissors",
    src: "./assets/images/scissors.png",
    alt: "Scissors",
  });

  // Construct li item for rock
  liItemScissors.append(imgScissors);

  // Append all three option list items to disp
  disp.append(liItemRock, liItemPaper, liItemScissors);
};

// RENDERING OPTIONS - SINGLE OPTION
// Create a function to render single chosen option
let renderChosenOptionFunc = (chosen, disp) => {
  // Create a HTML element for the chosen list item option
  let chosenOption = $("<li>");

  // Create an img tag for chosen list item option
  let chosenOptionImg = $("<img>", {
    class: "option-img",
    dataOption: chosen,
    src: "./assets/images/" + chosen + ".png",
    alt: chosen,
  });

  // Construct li item for chosen option
  chosenOption.append(chosenOptionImg);

  // Append chosen option to disp
  disp.append(chosenOption);
};

// RENDER LOADING DOTS
// Create a function to render loading dots
let renderWaitingDotsFunc = (disp) => {
  // Create a HTML element to hold loading dots
  let dotsContainer = $("<div>", {
    class: "loading-dots",
  });

  // Create 3 HTML element for 3 dots
  let dot1 = $("<div>", {
    class: "dot1",
  });

  let dot2 = $("<div>", {
    class: "dot2",
  });

  let dot3 = $("<div>", {
    class: "dot3",
  });

  // Contruct the loading dots element
  dotsContainer.append(dot1, dot2, dot3);

  // Append to disp
  disp.append(dotsContainer);
};

// RENDER INTERACTION TEXT
// Create a function that renders a battlefield box in the current action disp
// Take in player's option choice as a parameter
let renderInteractionText = (text) => {
  // Create a new HTML element for battlefield disp
  let newInteractionText = $("<p>", {
    id: "new-interaction-text",
  }).text(text);

  // Append newInteractionText to interactionDisp
  interactionDisp.append(newInteractionText);
};

// ALL LISTENERS HERE

// USERNAME INPUT LISTENER - Button Click
// Create a function to listen to user logging in
// On click of the loginBtn, run a function
loginBtn.click(function () {
  // That checks to see if the usernameText value is not equal to an empty string
  if (usernameText.val() !== "") {
    // If so, set the username variable to be the value the user entered, capitalize first letter
    username =
      usernameText.val().charAt(0).toUpperCase() + usernameText.val().slice(1);
    // console.log("User Created: " + username);

    // Run loginGameFunc
    loginGameFunc();
  }
});

// USERNAME INPUT LISTENER - Pressed Enter
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

// CHAT INPUT LISTENERS - Button Click
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
      username: username,
      message: chatMessage,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });

    // Clear the input
    chatText.val("");
  }
});

// CHAT INPUT LISTENERS - Enter Pressed
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
    chatCollection.push({
      userID: playerNum,
      username: username,
      message: chatMessage,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });

    // Clear the input
    chatText.val("");
  }
});

// CHAT UPDATE LISTENER - New Chat Value
// Create a function that listens to database's chatCollection for when a new child (message) is detected, order each child (message) by time
// Order each message by time
// Listen for when a new child is added
chatCollection.orderByChild("time").on(
  "child_added",
  // Run an anonomys function that returns snapshot of chat-data
  function (snapshot) {
    // Log everything that's coming out of snapshot
    // console.log(snapshot.val());

    // Create a new HTML p tag element for the new message
    let newMsg = $("<p>", {
      class: "player-" + snapshot.val().userID,
    });

    // Create a new HTML span tag element to hold new message text
    let newMsgText = $("<span>", {
      class: "chat-message",
      id: "player-" + snapshot.val().userID + "-msg",
    }).text(snapshot.val().username + ": " + snapshot.val().message);

    // Construct the newMsg
    newMsg.append(newMsgText);

    // Append message to message list disp
    chatDisp.append(newMsg);

    // Keep div scrolled to bottom of each new updated message
    chatDisp.scrollTop(chatDisp[0].scrollHeight);
  },
  // Handle errors
  (err) => {
    console.log("Errors handled: " + err.code);
  }
);

// PLAYER LIST UPDATE LISTENER - New Player Added
// Create a function to detect changes to the player-list in the database
playerList.on("value", function (snapshot) {
  // Access the current length of the player-list array snapshot, set it equal to currentPlayersCount
  currentPlayers = snapshot.numChildren();

  // console.log("Current Players: " + currentPlayers);

  // Check to see that two players exist in player-list collection and update playerOneExists and playerTwoExists variables
  playerOneExists = snapshot.child("1").exists();
  playerTwoExists = snapshot.child("2").exists();
  // If two players exist in snapshot of player-list collection, then these two variables should now have value of true

  // Pull and store the data of those two players into the local variables: playerOneData and playerTwoData
  playerOneData = snapshot.child("1").val();
  playerTwoData = snapshot.child("2").val();

  console.log("Player One Exists: ");
  console.log(playerOneExists);
  console.log("Player One Data: ");
  console.log(playerOneData);

  console.log("Player Two Exists: ");
  console.log(playerTwoExists);
  console.log("Player Two Data: ");
  console.log(playerTwoData);

  console.log("____________________");

  // If playerOneExists is true,
  if (playerOneExists) {
    // Pull and set: name and win/tie/loss records for playerOne
    p1NameText.text(playerOneData.username);
    p1WinsText.text(playerOneData.wins);
    p1TiesText.text(playerOneData.ties);
    p1LossesText.text(playerOneData.losses);
  }
  // Else if playerOneExist is false, set win/ties/losses to "-" and show loading dots
  else {
    // Clear p1OptionsDisp
    p1OptionsDisp.empty();

    // Run renderWaitingDotsFunc on p1NameText
    renderWaitingDotsFunc(p1NameText);
  }

  // If playerTwoExists is true,
  if (playerTwoExists) {
    // Pull and set: name and win/tie/loss records for playerOne
    p2NameText.text(playerTwoData.username);
    p2WinsText.text(playerTwoData.wins);
    p2TiesText.text(playerTwoData.ties);
    p2LossesText.text(playerTwoData.losses);
  }
  // Else if playerTwoExist is false, set win/ties/losses to "-" and show loading dots
  else {
    // Clear p2Nametext
    p2NameText.empty();

    // Run renderWaitingDotsFunc on p2NameText
    renderWaitingDotsFunc(p2NameText);
  }
});

// CURRENT TURN UPDATE LISTENER - New Turn Value
// Create a function to detect changes to the turn collection in the database
currentTurnRef.on("value", function (snapshot) {
  // Get the current turn from the snapshot
  currentTurn = snapshot.val();

  console.log("Player Num: " + playerNum);
  console.log("Current Turn: " + currentTurn);

  // Check to see if player is logged in and therefore playerNum exists and is set
  if (playerNum) {
    // Check to see if the currentTurn is 1
    if (currentTurn === 1) {
      console.log("Player Num: " + playerNum);
      console.log("Current Turn: " + currentTurn);

      // If its the current player's turn, let them know it's their turn and tell them to pick an option
      // They are player one
      if (currentTurn === playerNum) {
        // Create an HTML element to hold directions for user to pick an option
        let turnDirections = $("<p>").text(
          "It's your turn. Please pick an option."
        );

        // Clear battlefield interactionText
        interactionText.empty();

        // Display that message to the battlefield interactionText
        interactionText.append(turnDirections);

        // Store current player option display into variable
        let currentPlayerOptionDisp = $("#p" + playerNum + "-options-disp");

        // run the renderOptionsFunc for playerNum disp
        renderOptionsFunc(currentPlayerOptionDisp);

        console.log("rendered");
      }
      // Else, if it isnt the current players turn, tell them to wait for first player to choose
      // They are NOT player one
      else {
        // Create HTML lement to hold alt directions
        let turnDirectionsAlt = $("<p>").text(
          "Waiting for Player 1: " + playerOneData.username + " to choose."
        );

        // Clear battlefield interactionText
        interactionText.empty();

        // Display that message to the battlefield interactionText
        interactionText.append(turnDirectionsAlt);
      }

      // Highlight the border of th active player

      p1Disp.css("border", "3px solid yellow");
      p2Disp.css("border", "1px solid black");
    }

    // Else if, the currentTurn is 2
    // They are player two
    else if (currentTurn === 2) {
      console.log("Current Turn: " + currentTurn);
      // If its the current player's turn, let them know it's their turn and tell them to pick an option
      if (currentTurn === playerNum) {
        // Create an HTML element to hold directions for user to pick an option
        let turnDirections = $("<p>").text(
          "It's your turn. Please pick an option."
        );

        // Clear battlefield interactionText
        interactionText.empty();

        // Display that message to the battlefield interactionText
        interactionText.append(turnDirections);

        // Store current player option display into variable
        let currentPlayerOptionDisp = $("#p" + playerNum + "-options-disp");

        // run the renderOptionsFunc for playerNum disp
        renderOptionsFunc(currentPlayerOptionDisp);

        console.log("rendered");
      }
      // Else, if it isnt the current players turn, tell them to wait for second player to choose
      // They are NOT player two
      else {
        // Create HTML lement to hold alt directions
        let turnDirectionsAlt = $("<p>").text(
          "Waiting for Player 2: " + playerTwoData.username + " to choose."
        );

        // Clear battlefield interactionText
        interactionText.empty();

        // Display that message to the battlefield interactionText
        interactionText.append(turnDirectionsAlt);
      }

      // Shows yellow border around active player
      $("#player2").css("border", "2px solid yellow");
      $("#player1").css("border", "1px solid black");
    }

    // Else if currentTurn is 3
    else if (currentTurn === 3) {
      console.log("Current Turn: " + currentTurn);
      // Run the gameLogicFunc with the player choice parameter inputs
      gameLogicFunc(playerOneData.choice, playerTwoData.choice);

      console.log("game logic ran");

      // Clear p1 and p2 choice displays
      p1ChoiceDisp.empty();
      p2ChoiceDisp.empty();

      // Reveal both player's choices using renderChosenOptionFunc
      renderChosenOptionFunc(playerOneData.choice, p1ChoiceDisp);
      renderChosenOptionFunc(playerTwoData.choice, p2ChoiceDisp);

      // Create a function that moves onto the next round
      let nextRoundFunc = () => {
        // Clear p1Chosen and p2Chosen divs
        p1ChoiceDisp.empty();
        p2ChoiceDisp.empty();

        // Clear interactionDisp
        interactionDisp.empty();

        // Check to make sure players didnt leave before timeout
        if (playerOneExists && playerTwoExists) {
          currentTurnRef.set(1);
        }
      };

      // Reset after a timeout of 2 seconds
      setTimeout(nextRoundFunc, 2000);

    } else {
      // Else, make player option display empty
      p1ChoiceDisp.empty();
      p2ChoiceDisp.empty();

      // Set interactionText to say that youre waiting on another player to join
      // Create span for text
      let waitingForAnotherPlayerText = $("<span>").text(
        "Waiting for another player to join."
      );

      // Clear interactionText
      interactionText.empty();

      // Set interactionText to that span
      interactionText.append(waitingForAnotherPlayerText);
    }
  }
});

// PLAYER LIST UPDATE LISTENER - When There Are Two Active Players
playerList.on("child_added", function (snapshot) {
  if (currentPlayers === 1) {
    // Set turn to 1, which starts the game
    currentTurnRef.set(1);
  }
});

// CLICK EVENT LISTENER - Player Choice Click
// Create an on click listener for when player 1 selects a RPS option, run a function
$(document).on("click", "li", function () {
  // Get a handle on the option clicked
  let clickedOption = $(this);

  // Get a handle on the option's data-option
  let clickOptionData = clickedOption
    .children("img.option-img")
    .attr("dataOption");

  console.log("Clicked: ");
  console.log(clickOptionData);

  // Set the player's opton choice in the current player object in firebase
  console.log(playerRef);
  playerRef.child("choice").set(clickOptionData);

  // Get a handle on the option img clicked
  let clickedOptionImg = clickedOption.children("img.option-img").attr("src");

  // Set the player's opton choice img in the current player object in firebase
  playerRef.child("choiceImgSrc").set(clickedOptionImg);

  // When player has chosen and their choice is updated in their person object in player-list collection
  // Clear the options display
  console.log("Player Num: " + playerNum);
  $("#p" + playerNum + "-options-disp").empty();

  // And render only their chosen option
  renderChosenOptionFunc(clickOptionData, $("#p" + playerNum + "-choice-disp"));

  // Increment turn
  // Turns:
  // 1 - Player 1
  // 2 - Player 2
  // 3 - Determine winner
  currentTurnRef.transaction(function (turn) {
    return turn + 1;
  });
});

// OTHER FUNCTIONS & GAME LOGIC

// USER LOGIN GAME
// Create a function to log user into the game
let loginGameFunc = () => {
  // Create a reference for adding a disconnection
  let chatDataDisc = database.ref("/chat-data/" + Date.now());

  // Check for players currently logged into the game
  // If currentPlayers is less than two, meaning that there are no or only one player logged in
  if (currentPlayers < 2) {
    // Check to see that playerOne exists
    if (playerOneExists) {
      // Then that new player that just logged in is now player 2
      playerNum = 2;

      console.log(username + ", you are player " + playerNum);
    }
    // Else, that player is playerOne
    else {
      playerNum = 1;

      // console.log(username + ", you are player " + playerNum);
    }

    // Access the playerList collection in the database and create a key based on the assigned player number
    playerRef = database.ref("/player-list/" + playerNum);

    // Create a player object with: username, wins, losses, and option choice
    playerRef.set({
      username: username,
      wins: 0,
      ties: 0,
      losses: 0,
      choice: null,
      choiceImgSrc: null,
    });

    // When they disconnect from the game, remove this user's player object from playerList
    playerRef.onDisconnect().remove();

    // If a player disconnects, set the current turn to null so that the game does not continue

    currentTurnRef.onDisconnect().remove();

    // Send a disconnect message to chat with Firebase server generated timestamp and id of '0' to denote system message
    chatDataDisc.onDisconnect().set({
      userID: 0,
      username: username,
      time: firebase.database.ServerValue.TIMESTAMP,
      message: "has disconnected.",
    });

    // Empty out the input box for usernameTextField
    usernameTextField.empty();

    // Remove name input box from usernameDisp
    usernameDisp.empty();

    // Create a HTML element that confirms player logged in
    let playerLoggedInMsg = $("<h3>").text(
      "Hi, " + username + "! You are Player " + playerNum
    );

    // And show that message in usernameDisp
    usernameDisp.append(playerLoggedInMsg);

    // Else, if playerNum is already at two (there are already two players logged in), alert user trying to log in that the game is currently full
  } else {
    alert("Sorry, the game is currently full!");
  }
};

// GAME LOGIC
// Reads choices from the two active players and displays the results for who wins/loses/or if there is a tie in the interactionDisp
// Increments the wins/losses/ties counter of two active players accordingly
// Create a function for game logic that takes in two parameters: p1Choice and p2Choice
let gameLogicFunc = (p1Choice, p2Choice) => {
  console.log(p1Choice);
  console.log(p2Choice);

  // Create a function that runs in the scenario where p1 wins
  let p1WinsFunc = () => {
    // Confirm that playerNum is p1
    if (playerNum === 1) {
      // Access the playersList, access p1, access p1's wins, increment p1's wins by 1
      playerList
        .child("1")
        .child("wins")
        .set(playerOneData.wins + 1);

      // Access the playersList, access p2, access p2's losses, increment p2's losses by 1
      playerList
        .child("2")
        .child("losses")
        .set(playerTwoData.losses + 1);
    }

    // Clear interactionText
    interactionText.empty();

    // Create a HTML element to hold the p1 win message
    let p1WinMessage = $("<p>").text(playerOneData.name + " wins!");

    // Append p1 win message to interactionText
    interactionText.append(p1WinMessage);
  };

  // Create a function that runs in the scenario where p2 wins
  let p2WinsFunc = () => {
    // Confirm that playerNum is p2
    if (playerNum === 2) {
      // Access the playersList, access p2, access p2's wins, increment p2's wins by 1
      playerList
        .child("2")
        .child("wins")
        .set(playerTwoData.wins + 1);

      // Access the playersList, access p1, access p1's losses, increment p1's losses by 1
      playerList
        .child("1")
        .child("losses")
        .set(playerOneData.losses + 1);
    }

    // Clear interactionText
    interactionText.empty();

    // Create a HTML element to hold the p2 win message
    let p2WinMessage = $("<p>").text(playerTwoData.name + " wins!");

    // Append p2 win message to interactionText
    interactionText.append(p2WinMessage);
  };

  // Create a function that runs in the scenario of a tie
  let tieFunc = () => {
    // Access playerList, access p1, access p1's ties, increment p1's ties by 1
    playerList
      .child("1")
      .child("ties")
      .set(playerOneData.ties + 1);

    // Access playerList, access p2, access p2's ties, increment p2's ties by 1
    playerList
      .child("2")
      .child("ties")
      .set(playerTwoData.ties + 1);

    // Clear interactionText
    interactionText.empty();

    // Create a HTML element to hold the p2 win message
    let tieGameMsg = $("<p>").text("Tie game!");

    // Append p2 win message to interactionText
    interactionText.append(tieGameMsg);
  };

  // Define all possible outcomes
  // Define all tie cases
  if (p1Choice === "rock" && p2Choice === "rock") {
    console.log("Tie");
    tieFunc();
  } else if (p1Choice === "paper" && p2Choice === "paper") {
    console.log("Tie");
    tieFunc();
  } else if (p1Choice === "scissors" && p2Choice === "scissors") {
    console.log("Tie");
    tieFunc();
  }
  // Define all p1 win cases
  else if (p1Choice === "rock" && p2Choice === "scissors") {
    console.log("P1 Win");
    p1WinsFunc();
  } else if (p1Choice === "paper" && p2Choice === "rock") {
    console.log("P1 Win");
    p1WinsFunc();
  } else if (p1Choice === "scissors" && p2Choice === "paper") {
    console.log("P1 Win");
    p1WinsFunc();
  }
  // Define all p2 win cases
  else if (p1Choice === "scissors" && p2Choice === "rock") {
    console.log("P2 Win");
    p2WinsFunc();
  } else if (p1Choice === "rock" && p2Choice === "paper") {
    console.log("P2 Win");
    p2WinsFunc();
  } else if (p1Choice === "paper" && p2Choice === "scissors") {
    console.log("P2 Win");
    p2WinsFunc();
  }
};
