let playground = (() => {

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships:[
        { locations: ["11", "12", "13"], hits: ["", "", ""] },
        { locations: ["31", "32", "33"], hits: ["", "", ""] },
        { locations: ["51", "52", "53"], hits: ["", "", ""] }
    ],

    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (ship.hits[index] === "hit") {
                view.displayMessage("You hit this ship before.");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("It's a hit!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sunk my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("It's a miss!");
        return false;
    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    }
};

let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class","hit");

    },

    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class","miss");
    }
};

let controller = {
    guesses: 0,
    processGuess: function(location) {
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sunk all of my battleships in " + this.guesses + " tries.");
                let end = document.getElementById("guessInput").disabled = true;
            }
        }
    }
};

function init() {
    $('#game-init-button').hide();
    $('#board').show();
    console.log('game init');
    let guessClick = document.getElementsByTagName("td");
    for (let i = 0; i < guessClick.length; i++) {
        guessClick[i].onclick = answer;
    }

    view.displayMessage("Hello, let's play! There are 3 ships, each 3 cells long");
}

function answer(eventObj) {
    let shot = eventObj.target;
    let location = shot.id;
    controller.processGuess(location);
}
return{
    init,
    answer
}
})();





