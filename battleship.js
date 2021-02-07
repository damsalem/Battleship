const view = {
  displayMessage: function (msg) {
    const msgArea = document.querySelector("#messageArea");
    msgArea.innerHTML = msg;
  },
  displayHit: function (target) {
    const hitTarget = document.getElementById(target);
    hitTarget.className = "hit";
  },
  displayMiss: function (target) {
    const missTarget = document.getElementById(target);
    missTarget.className = "miss";
  },
};

const model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [
    { locations: ["06", "16", "26"], hits: ["", "", ""] },
    { locations: ["24", "34", "44"], hits: ["", "", ""] },
    { locations: ["10", "11", "12"], hits: ["", "", ""] },
  ],
  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      const ship = this.ships[i];
      const index = ship.locations.indexOf(guess);
      if (index >= 0) {
        // We have a hit!
        ship.hits[guess] = "hit";
        view.displayHit(guess);
        view.displayMessage(guess);
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  isSunk: function (ship) {
    for (let i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
};

const controller = {
  guesses: 0,
  processGuess: function (guess) {
    const location = parseGuess(guess);
    if (location) {
      this.guesses++;
      const hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          "You sank all my battleships in " + this.guesses + " guesses!"
        );
      }
    }
  },
};

function parseGuess(guess) {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("Oops! Please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    const row = alphabet.indexOf(firstChar);
    const column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops! That's not on the board.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Oops! That's off the board.");
    } else {
      return `${row}${column}`;
    }
  }
  return null;
}

const guessForm = document.querySelector("#guessForm");
guessForm.onsubmit = handleFire;

function handleFire(e) {
  const guessInput = document.querySelector("#guessInput");
  let guess = guessInput.value;
  e.preventDefault();
  controller.processGuess(guess);
  guessInput.value = "";
}

/* controller.processGuess("A0");

controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");

controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");

controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2"); */
