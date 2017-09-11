let playground = (() => {

    const gameWinScore = 9;
    const fields = 7 * 7;
    const hitsToSink = 3;
    const startingPoints = fields - gameWinScore;

    let model = {
        ships: [],
        score: 0,
        history: new Array(fields).fill('unknown'),
        points: startingPoints
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

        displayWinn: function (points) {
            this.displayMessage(`You won with a score of ${points}!`);
            $('table').hide();

        },

        displayMiss: function (location) {
            let cell = document.getElementById(location);
            cell.setAttribute("class", "miss");
        }
    };

    function init() {

        // gets all maps from database
        requester.get('appdata', 'gameBoards', '').then((boardsInfo) => {

            // gets the maps the user has played
            requester.get('appdata', `gamesPlayed?query={"userId":"${sessionStorage.getItem('userId')}"}`, '').then((playedMapsInfo) => {

                // all maps that has been started or completed
                let mapsStarted = [];
                let mapsAvailable = false;

                for (let map of playedMapsInfo) {
                    mapsStarted.push(map.gameId);
                }

                // loops through all the maps and picks the first not started
                for (let board of boardsInfo) {

                    // if the map has not been started yet it is loaded
                    if (!mapsStarted.includes(board._id)) {
                        sessionStorage.setItem('boardId', board._id);
                        // MAP INITIALIZATION
                        let historyData = {
                            gameId: board._id,
                            userId: sessionStorage.getItem('userId'),
                            score: 40,
                            boardProgress: model.history
                        };

                        requester.post('appdata', 'gamesPlayed', '', historyData).then((req) => {
                            sessionStorage.setItem('historyId', req._id);
                        });


                        mapsAvailable = true;

                        // get ships location from the database
                        requester.get('appdata', 'gameBoards/' + board._id, '').then((mapInfo) => {
                            for (let i = 0; i < mapInfo.board.length; i++) {
                                let ship = {hits: 0, coordinates: mapInfo.board[i].coordinates};
                                model.ships.push(ship);
                            }
                        });

                        // hides game start button
                        $('#game-init-button').hide();

                        console.log('game initialization...');

                        // attach click event listener to each field
                        let battleBlocks = $('td');
                        for (let block of battleBlocks) {
                            $(block).on('click', shoot);
                        }
                        view.displayMessage("Let's play! There are 3 ships, each 3 cells long");
                        break;
                    }
                }

                // if all maps has been played, game cannot start.
                if (!mapsAvailable) {
                    view.displayMessage("You have played all available maps!");
                }
            });
        });


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

        // sets game local history
        model.history[fieldId] = result;

        // display shoot outcome
        if (result === 'miss') {
            view.displayMiss(fieldId);
            view.displayMessage('Miss!');
            model.points--;
        } else {
            view.displayHit(fieldId);
            view.displayMessage('You hit a battleship!');
        }

        // set game remote history
        let historyData = {
            gameId: sessionStorage.getItem('boardId'),
            userId: sessionStorage.getItem('userId'),
            score: model.points,
            boardProgress: model.history
        };

        requester.update('appdata', 'gamesPlayed/' + sessionStorage.getItem('historyId'), '', historyData).then((data) => {
            console.log('move saved');

        });

        // disable further clicks on this item
        $('#' + fieldId).parent().unbind("click");


        // checks if game has ended
        if (model.score === gameWinScore) {
            view.displayWinn(model.points);
            model.ships = [];
            model.score = 0;
            model.history = new Array(fields).fill('unknown');
            model.points = startingPoints;
        }
    }

    return {
        init
    }
})();





