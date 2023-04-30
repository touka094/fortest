const squares = document.querySelectorAll(".square");
const message = document.querySelector(".message");
const attackButton = document.querySelector(".attackButt");
const skillButton = document.querySelector(".skillButt");
const resetButton = document.querySelector(".ResetButt");
const botHPTXT = document.querySelector(".botHP");
const playerHPTXT = document.querySelector(".playerHP");




let turn = "X";
let gameIsOver = false;
let computerPlayer = "O";
let botHP = 3;
let botAtk = 1;
let playerHp = 0;
let skillup = 'No';
// Check if game is over
function checkGameOver() {
  

  const board = [
    squares[0].textContent, squares[1].textContent, squares[2].textContent,
    squares[3].textContent, squares[4].textContent, squares[5].textContent,
    squares[6].textContent, squares[7].textContent, squares[8].textContent
  ];

  const possibleWins = [
    // horizontal
    [0,1,2], [3,4,5], [6,7,8],
    // vertical
    [0,3,6], [1,4,7], [2,5,8],
    // diagonal
    [0,4,8], [2,4,6]
  ];

  for (let i = 0; i < possibleWins.length; i++) {
    const [a, b, c] = possibleWins[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      message.textContent = `${turn} Move!`;
      gameIsOver = true;
      if (turn === "X") {
        // Player won, do something
        attackButton.disabled = false;
        if(skillup == 'No'){
          skillButton.disabled = false;
        }else if(skillup == 'yes'){
          skillButton.disabled = true;
        }
        
        console.log("Player won");
      } else {
        // Clear squares
        squares.forEach(square => {
          square.textContent = "";
          square.classList.remove("X", "O");
        });
        // Reset game variables
        turn = "X";
        gameIsOver = false;
        message.textContent = `${turn}'s turn`;
        // Computer player won, do something
        if(SelectedChar == "Wizard"){
          playerHp-=botAtk;
          playerHPTXT.innerHTML = `HP:${playerHp}`;
        }else if(SelectedChar == "Knight"){
          if(skillup == "No"){
           playerHp-=botAtk;
           playerHPTXT.innerHTML = `HP:${playerHp}`;
          }else{
            playerHp-=0;
            playerHPTXT.innerHTML = `HP:${playerHp}`;
            skillup = "No";
            playerChar.setAttribute("src", "Pic/knight.gif");
          }
        }

        if(playerHp == 0){
          gameIsOver = true;
          attackButton.style.display = 'none';
          skillButton.style.display = 'none';
          resetButton.style.display = 'inline-block';
          resetButton.disabled = false;
        }
        console.log("Computer player won");
      }
      return;
    }
  }

  if (board.every(square => square !== "")) {
    message.textContent = "It's a tie!";
    gameIsOver = true;
    setTimeout(() => {
      // Clear squares
      squares.forEach(square => {
        square.textContent = "";
        square.classList.remove("X", "O");
      });

      // Reset game variables
      turn = "X";
      gameIsOver = false;
      message.textContent = `${turn}'s turn`;
    }, 1000); // Wait 1 second before resetting board
    return;
  }

  // Change turn
  turn = turn === "X" ? computerPlayer : "X";
  
  // Computer player's turn
  if (turn === computerPlayer) {
    setTimeout(() => {
      // Find best move
      let bestMove = findBestMove(board, computerPlayer);
      squares[bestMove.index].textContent = computerPlayer;
      squares[bestMove.index].classList.add(computerPlayer);
      checkGameOver();
    }, 500); // Wait 0.5 second before computer player's turn
  }

  // Display turn
  message.textContent = `${turn}'s turn`;
}

// Event listener for squares
squares.forEach(square => {
  square.addEventListener("click", () => {
    // If square is already occupied or game is over, do nothing
    if (square.textContent !== "" || gameIsOver || turn === computerPlayer) {
      return;
    }

    // Add turn to square
    square.textContent = turn;
    square.classList.add(turn);

    // Check if game is over
    checkGameOver();
  });
});


// Event listener for Attack button
attackButton.addEventListener("click", () => {
  // Clear squares
  squares.forEach(square => {
    square.textContent = "";
    square.classList.remove("X", "O");
  });
  // Reset game variables
  turn = "X";
  gameIsOver = false;
  message.textContent = `${turn}'s turn`;

  if(SelectedChar == "Knight"){
    botHP-=1;
    botHPTXT.innerHTML = `HP:${botHP}`;
  }else if(SelectedChar == "Wizard"){
    if(skillup == "No"){
      botHP-=2;
      botHPTXT.innerHTML = `HP:${botHP}`;
    }else{
      botHP-=4;
      skillup = 'No';
      botHPTXT.innerHTML = `HP:${botHP}`;
      playerChar.setAttribute("src", "Pic/Wizard.gif");
    }
  }
  if(botHP <= 0){
    gameIsOver = true;
    attackButton.style.display = 'none';
    skillButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
    resetButton.disabled = false;
  }
  attackButton.disabled = true;
  skillButton.disabled = true;
});


// Event listener for Skill button
skillButton.addEventListener("click", () => {
  // Clear squares
  squares.forEach(square => {
    square.textContent = "";
    square.classList.remove("X", "O");
  });
  // Reset game variables
  turn = "X";
  gameIsOver = false;
  message.textContent = `${turn}'s turn`;

  if(SelectedChar == "Knight"){
    skillup = "yes";
    playerChar.setAttribute("src", "Pic/knight_Shield.gif");
  }else if(SelectedChar == "Wizard"){
    skillup = "yes";
    playerChar.setAttribute("src", "Pic/Wizard_Flame.gif");
  }
  attackButton.disabled = true;
  skillButton.disabled = true;
});


resetButton.addEventListener("click", () => {
  botHP = 3;
// Clear squares
squares.forEach(square => {
  square.textContent = "";
  square.classList.remove("X", "O");
});
// Reset game variables
turn = "X";
gameIsOver = false;
message.textContent = `${turn}'s turn`;
resetButton.style.display = 'none';

attackButton.style.display = 'inline-block';
skillButton.style.display = 'inline-block';

botHPTXT.innerHTML = `HP:${botHP}`;
playerHPTXT.innerHTML = `HP:${playerHp}`;
});





// Bot Move
function findBestMove(board, player) {
    let bestMove = { score: -Infinity, index: null };
  
    for (let i = 0; i < board.length; i++) {
      // Check if square is empty
      if (board[i] === "") {
        // Make a move on the empty square
        board[i] = player;
  
        // Calculate the score for this move
        let score = minimax(board, 0, false, player);
  
        // Undo the move
        board[i] = "";
  
        // Update best move if score is higher than current best score
        if (score > bestMove.score) {
          bestMove.score = score;
          bestMove.index = i;
        }
      }
    }
  
    return bestMove;
  }
  
  function minimax(board, depth, isMaximizingPlayer, player) {
    // Base case: check if game is over
    let gameResult = checkGameResult(board, player);
    if (gameResult !== null) {
      return gameResult === "tie" ? 0 : (gameResult === player ? 1 : -1);
    }
  
    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        // Check if square is empty
        if (board[i] === "") {
          // Make a move on the empty square
          board[i] = player;
  
          // Calculate the score for this move
          let score = minimax(board, depth + 1, false, player);
  
          // Undo the move
          board[i] = "";
  
          // Update best score if score is higher than current best score
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        // Check if square is empty
        if (board[i] === "") {
          // Make a move on the empty square
          board[i] = player === "X" ? "O" : "X";
  
          // Calculate the score for this move
          let score = minimax(board, depth + 1, true, player);
  
          // Undo the move
          board[i] = "";
  
          // Update best score if score is lower than current best score
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  }
  
  function checkGameResult(board, player) {
    const possibleWins = [    // horizontal    [0,1,2], [3,4,5], [6,7,8],
      // vertical
      [0,3,6], [1,4,7], [2,5,8],
      // diagonal
      [0,4,8], [2,4,6]
    ];
  
    for (let i = 0; i < possibleWins.length; i++) {
      const [a, b, c] = possibleWins[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
  
    if (board.every(square => square !== "")) {
      return "tie";
    }
  
    return null;
  }

const knightBox = document.querySelector('#character1');
const wizardBox = document.querySelector('#character2');
const selectButt = document.querySelector('.selectChar');

const charSelPage = document.querySelector('.characterSelection');
const gamePage = document.querySelector('.gamePage');

const playerChar = document.getElementById("playerChar");

const propc = document.querySelector('.propc');

var SelectedChar = "none";


selectButt.addEventListener("click", () => { 
  charSelPage.style.display = 'none';
  gamePage.style.display = 'flex';
  propc.style.display = 'none';
  if(SelectedChar == "Knight"){
    playerHPTXT.innerHTML = `HP:${playerHp}`;
    playerChar.setAttribute("src", "Pic/knight.gif");
  }else if(SelectedChar == "Wizard"){
    playerHPTXT.innerHTML = `HP:${playerHp}`;
    playerChar.setAttribute("src", "Pic/Wizard.gif");
  }
});




knightBox.addEventListener("click", function() {
  // remove "selected" class from all character elements
  const characters = document.querySelectorAll(".character");
  characters.forEach((character) => {
    character.classList.remove("selected");
  });
  knightBox.classList.add("selected");

  SelectedChar = "Knight";
  playerHp = 5;
  selectButt.disabled = false;
  console.log(SelectedChar);
});

wizardBox.addEventListener("click", function() {
  // remove "selected" class from all character elements
  const characters = document.querySelectorAll(".character");
  characters.forEach((character) => {
    character.classList.remove("selected");
  });
  wizardBox.classList.add("selected")

  SelectedChar = "Wizard";
  playerHp = 3;
  selectButt.disabled = false;
  console.log(SelectedChar);
});