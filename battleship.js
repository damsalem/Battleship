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
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
  ],
  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      const ship = this.ships[i];
      const index = ship.locations.indexOf(guess);
      if (index >= 0 && ship.hits[index] === "") {
        // We have a hit!
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("Hit!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      } else if (index >= 0 && ship.hits[index] === "hit") {
        view.displayMessage("Hey, you already scored there!");
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
  generateShipsLocations: function () {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    const direction = Math.floor(Math.random() * 2);
    let row, col;

    if (direction === 1) {
      // Generate starting location for horizontal ship
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      // Generate starting location for vertical ship
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    const newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // Add location to array for new horizontal ship
        newShipLocations[i] = row + "" + (col + i);
      } else {
        // Add location to array for new vertical ship
        newShipLocations[i] = row + i + "" + col;
      }
    }
    return newShipLocations;
  },
  collision: function (newShip) {
    // Returns true if there is a collision, else false
    for (let i = 0; i < this.numShips; i++) {
      let ship = model.ships[i];
      for (let j = 0; j < newShip.length; j++) {
        if (ship.locations.indexOf(newShip[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
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
    firstChar = guess.charAt(0).toUpperCase();
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

window.onload = function () {
  model.generateShipsLocations();
};
