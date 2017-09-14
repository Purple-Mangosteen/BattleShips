function startApp() {

    $(document).on({
        ajaxStart: () => $('#loadingBox').show(),
        ajaxStop: () => $('#loadingBox').hide()
    });
    $('#infoBox').click((e) => $(e.target).hide());
    $('#errorBox').click((e) => $(e.target).hide());

    //INITIALIZE SAMMY AND HANDLEBARS

    const app = Sammy('#pagebody', function () {
        
        this.use('Handlebars', 'hbs');

        // HOME
        this.get('index.html', displayHome);
        this.get('index.html/#home', displayHome);
        this.get('#/home', displayHome);

        this.get('#/login', displayLoginForm);
        this.get('#/register', displayRegisterForm);
        this.get('#/logout', logOutUser);
        this.get('#/choose-map', displayChooseMap);
        this.get('#/play/:id', displayGameBoard); //possibly '#play/:id'  where id is the id of the map
        this.get('#/play(/)?', displayGameBoard); // i know its a hack but ..
        this.get('#/create-map', displayCreateMapForm);
        this.get('#/hall-of-fame', displayHallOfFame);
        this.get('#/how-to-play', displayHowToPlay);

        //put this last!
        this.get('', redirectToHome);


        this.post('#/login', logInUser);
        this.post('#/register', registerUser);


        function redirectToHome(ctx) {            
            ctx.redirect('index.html#/home');
        }

        function displayHome(ctx) {

            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');
            ctx.gameCount;

            requester.get('appdata', 'gameBoards/_count', 'Master')
                .then(function (count) {
                    ctx.gameCount = count['count'];

                    ctx.loadPartials({
                        header: 'templates/common/header.hbs',
                        footer: 'templates/common/footer.hbs',
                        home: 'templates/home/home.hbs'
                    }).then(function () {
                        this.partial('templates/home/homePage.hbs');
                    });

                }).catch(notifier.handleError);
        }

        //LOGIN USER
        function displayLoginForm(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                loginform: 'templates/login/loginform.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/login/loginPage.hbs');
            });
        }

        function logInUser(ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then((userInfo) => {
                    console.log('logged in!');
                    auth.saveSession(userInfo);
                    notifier.showInfo('Login successful.');
                    ctx.redirect('#/home');
                })
                .catch(notifier.handleError);
        }

        //REGISTER USER
        function displayRegisterForm(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                registerForm: 'templates/register/registerform.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/register/registerPage.hbs')
            });
        }

        function registerUser(ctx) {
            let username = ctx.params.username;
            let email = ctx.params.email;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            if (validator.validateUserName(username) &&
                validator.validatePass(password) &&
                validator.checkIfPasswordMatch(password, repeatPass)) {

                auth.register(username, password, email)
                    .then((userInfo) => {
                        auth.saveSession(userInfo);
                        notifier.showInfo('Registered and Logged in!');
                        ctx.redirect('#/home');
                    })
                    .catch(notifier.handleError);
            }


        }

        //LOGOUT USER
        function logOutUser(ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    notifier.showInfo('Logout successful.');
                    ctx.redirect('#/home');
                }).catch(auth.handleError);
        }
        // select map
        function displayChooseMap(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');
            let userId = sessionStorage.getItem('userId');
            requester.get('appdata', `gamesPlayed?query={"userId":"${userId}"}`, '')
                .then(function (userData) {
                    requester.get('appdata', `gameBoards`, '').then(boards => {
                        ctx.choseMapData = [];
                        //
                        // all maps that has been started or completed
                        let mapsStarted = [];

                        for (let map of userData) {
                            mapsStarted.push(map.gameId);
                        }


                        //
                        for (let board of boards) {
                            let score = 0;
                            let gameFinished = false;
                            let boardMissCount = 0;
                            let boardHitCount = 0;
                            for (let row of userData) {
                                if (row.gameId !== board._id) {
                                    continue;
                                }
                                score = row.score > score ? row.score : score;

                                for (let item of row.boardProgress) {
                                    if (item === 'miss') {
                                        boardMissCount++;
                                    }
                                    if (item === 'hit') {
                                        boardHitCount++;
                                    }
                                }
                                if (row.gameStarted === true) {
                                    gameFinished = true;
                                }
                            }
                            console.log('miss', boardMissCount);
                            console.log('hit',boardHitCount);
                            let boardObj = {
                                id          : board._id,
                                gameNumber  : board.gameNumber,
                                gameName    : board.gameName,
                                timesPlayed : board.timesPlayed,
                                score       : score,
                                hits        : boardHitCount,
                                gameStarted : mapsStarted.includes(board._id),
                                gameFinished: boardHitCount >= 9
                            };

                            if (typeof board.gameNumber !== 'undefined' &&
                                parseInt(board.gameNumber) > 0 &&
                                typeof ctx.choseMapData[parseInt(board.gameNumber)] === 'undefined'
                            ) {
                                ctx.choseMapData[parseInt(board.gameNumber)] = boardObj;
                            }
                            else {
                                ctx.choseMapData.push(boardObj);
                            }
                        }

                        ctx.loadPartials({
                            header: 'templates/common/header.hbs',
                            footer: 'templates/common/footer.hbs',
                        }).then(function () {
                            this.partial('templates/gameplay/chosegame.hbs');
                        });
                    })
                }).catch(notifier.handleError);

        }

        function displayGameBoard(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');
            ctx.gameId = null;
            if (typeof ctx.params.id !== "undefined" && ctx.params.id.length > 0) {
                ctx.gameId = ctx.params.id.charAt(0) === '/' ? ctx.params.id.substr(1) : ctx.params.id;
                console.log(ctx.gameId)
            }

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/gameplay/gameboard.hbs');
            });
        }

        //CREATE MAP
        function displayCreateMapForm(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: 'templates/common/header.hbs'
            }).then(function () {
                this.partial('templates/gameadmin/createmapform.hbs')
                    .then(function () {

                        //get the last map
                        gameServices.getTheLastMap()
                            .then((mapinfo) => {

                                let previousGameNumber = 0;
                                if (mapinfo.length === 0) {

                                } else {
                                    previousGameNumber = Number(mapinfo[0]['gameNumber']);
                                }

                                let gameNumber = previousGameNumber + 1;
                                let gameName = `Map:#${gameNumber}`;


                                let fieldId = $('#board').find('div');

                                fieldId.click(showId);

                                let coordinates = [];

                                let counter = 0;

                                function showId() {
                                    counter++;

                                    if (counter < 10) {
                                        let id = $(this).attr('data-id');
                                        $(this).addClass("hit");

                                        id = Number(id);
                                        let shipObj = {};

                                        id = "" + id;
                                        shipObj[`${id}`] = 'ship';
                                        shipObj.g = 'g';
                                        //  console.log(shipObj);
                                        coordinates.push(shipObj);

                                    } else {
                                        notifier.showError("You have reached the maximum cells allowed")
                                    }
                                }

                                $('#createMapBtn').click(() => createMap(coordinates, gameNumber, gameName));

                            });
                    });
            });

            function createMap(coordinatesList, gameNumber, gameName) {


                if (coordinatesList.length === 9) {
                    let board = [];

                    for (let i = 0; i < coordinatesList.length; i += 3) {
                        let coordinate = {};
                        coordinate['coordinates'] = [];
                        coordinate['coordinates'].push(coordinatesList[i]);
                        coordinate['coordinates'].push(coordinatesList[i + 1]);
                        coordinate['coordinates'].push(coordinatesList[i + 2]);
                        board.push(coordinate)
                    }

                    gameServices.createMap(board, gameNumber, gameName)
                        .then(() => {
                            notifier.showInfo('New Map Created');
                            ctx.redirect('#/home');
                        })

                } else {
                    notifier.showError("Please select 9 cells")
                }

            }

        }

        function displayHallOfFame(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            //?query={"author":"${ctx.username}"}&sort={"_kmd.ect": -1}`, ''
            //?query={}&limit=20&skip=0
            //?query={}&limit=20&skip=20
            //?query={}&limit=20&skip=40

            requester.get('appdata', 'gamesPlayed', '')
                .then(function (resultsData) {
                    let results = [];

                    if(resultsData.length ===0){
                        ctx.loadPartials({
                            header: 'templates/common/header.hbs',
                            footer: 'templates/common/footer.hbs',
                            highScoresList: 'templates/gameresults/highScoresList.hbs'
                        }).then(function () {
                            this.partial('templates/gameresults/halloffamePage.hbs');
                        });
                    }else{
                        let winners = new Map();
                        for (let result of resultsData) {
                            if (result.gameStarted === 'true') {
                                if (!winners.has(result.userId)) {
                                    winners.set(result.userId, {score: 0, maps: 0})
                                }
                                let participant = winners.get(result.userId);
                                participant.score += Number(result.score);
                                participant.maps++;

                                winners.set(result.userId, participant);
                            }
                        }

                        for (let player of winners) {
                            results.push({username: player[0], totalScore: player[1].score, gamesPlayed: player[1].maps});
                        }

                        // top 10
                        results = results.slice(0, 10);

                    for (let userData of results) {
                        requester.get('user', `?query={"_id":"${userData.username}"}`, '').then((userDetails) => {
                            userData.username = userDetails[0].username;
                        }).then(() => {
                            results.sort(function (a, b) {
                                if (Number(b.totalScore) === Number(a.totalScore)) {
                                    return Number(b.maps) - Number(a.maps);
                                }
                                return Number(b.totalScore) - Number(a.totalScore);

                            });
                            ctx.results = results;
                            ctx.loadPartials({
                                header: 'templates/common/header.hbs',
                                footer: 'templates/common/footer.hbs',
                                highScoresList: 'templates/gameresults/highScoresList.hbs'
                            }).then(function () {
                                this.partial('templates/gameresults/halloffamePage.hbs');
                            });

                        });
                    }
                 }

                }).catch(notifier.handleError);
        }

        function displayHowToPlay(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: 'templates/common/header.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/gameplay/howtoplay.hbs');
            });
        }

    });

    app.run();
}

// master