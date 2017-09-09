let playground = (() => {

    const gameWinScore = 9;
    const fields = 7 * 7;
    const hitsToSink = 3;

    let model = {
        ships: [],
        score: 0,
        history: new Array(fields).fill('unknown')

    };

    let view = {
        displayMessage: function (msg) {
            let messageArea = document.getElementById("messageArea");
            messageArea.innerHTML = msg;
        },

        displayHit: function (location) {
            let cell = document.getElementById(location);
            cell.setAttribute("class", "hit");

        },

        displayWinn: function () {
            this.displayMessage('You won!');
            $('table').hide();

        },

        displayMiss: function (location) {
            let cell = document.getElementById(location);
            cell.setAttribute("class", "miss");
        }
    };

    function init() {

        // hard coded map ID

        // get ships location from the database
        requester.get('appdata', 'gameBoards/59b456d4797e4f820497665f', '').then((mapInfo) => {
            for (let i = 0; i < mapInfo.board.length; i++) {
                let ship = {hits: 0, coordinates: mapInfo.board[i].coordinates};
                model.ships.push(ship);
            }
        });

        // hides game start button
        $('#game-init-button').hide();

        console.log('game initialization...');

        let battleBlocks = $('td');
        for (let block of battleBlocks) {
            $(block).on('click', shoot);
        }
        view.displayMessage("Let's play! There are 3 ships, each 3 cells long");


    }

    function shoot() {
        let fieldId = $(this).find('div:first').attr('id');
        let result = 'miss';
        // checks outcome of the shoot
        for (let ship of model.ships) {
            // checks if it hits
            for (let i = 0; i < ship.coordinates.length; i++) {
                if (ship.coordinates[i].hasOwnProperty(fieldId) && ship.coordinates[i][fieldId] === 'ship') {
                    ship.coordinates[i][fieldId] = 'hit';
                    ship.hits++;
                    result = 'hit';
                    model.score++;
                    if (ship.hits >= hitsToSink) {
                        view.displayMessage('You sunk a battleship!');
                    }
                }
            }
        }

        // sets game history
        model.history[fieldId] = result;


        // display shoot outcome
        if (result === 'miss') {
            view.displayMiss(fieldId);
            view.displayMessage('Miss!');
        } else {
            view.displayHit(fieldId);
            view.displayMessage('You hit a battleship!');
        }

        // disable further clicks on this item
        $('#' + fieldId).parent().unbind("click");


        // checks if game has ended
        if (model.score === gameWinScore) {
            view.displayWinn();
        }
    }

    return {
        init
    }
})();





