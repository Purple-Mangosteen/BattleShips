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
        this.get('#/home', displayHome);

        this.get('#/login', displayLoginForm);
        this.get('#/register', displayRegisterForm);
        this.get('#/logout', logOutUser);
        this.get('#/choose-map', displayChooseMapForm);
        this.get('#/play', displayGameBoard); //possibly '#play/:id'  where id is the id of the map
        this.get('#/create-map', displayCreateMapForm);
        this.get('#/hall-of-fame', displayHallOfFame);
        this.get('#/how-to-play', displayHowToPlay);


        this.post('#/login', logInUser);
        this.post('#/register', registerUser);



        function displayHome(ctx) {

            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                home: './templates/home/home.hbs'
            }).then(function () {
                this.partial('./templates/home/homePage.hbs');
            });
        }


        //LOGIN USER
        function displayLoginForm(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                loginform: './templates/login/loginform.hbs',
            }).then(function () {
                this.partial('./templates/login/loginPage.hbs');
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
                header: './templates/common/header.hbs',
                registerForm: './templates/register/registerform.hbs'
            }).then(function () {
                this.partial('./templates/register/registerPage.hbs')
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


        function displayChooseMapForm(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
            }).then(function () {
                this.partial('./templates/gameplay/chosegame.hbs');
            });
        }

        function displayGameBoard(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
            }).then(function () {
                this.partial('./templates/gameplay/gameboard.hbs');
            });
        }

        function displayCreateMapForm(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
            }).then(function () {
                this.partial('./templates/gameadmin/createmapform.hbs');
            });
        }

        function displayHallOfFame(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            //?query={"author":"${ctx.username}"}&sort={"_kmd.ect": -1}`, ''
            //?query={}&limit=20&skip=0
            //?query={}&limit=20&skip=20
            //?query={}&limit=20&skip=40

            requester.get('user', '?query={}&sort={"totalScore": -1,"gamesPLayed":-1}&limit=10', '')
                .then(function (results) {
                    ctx.results = results;

                    console.log(ctx.results);

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        highScoresList: './templates/gameresults/highScoresList.hbs'
                    }).then(function () {
                        this.partial('./templates/gameresults/halloffamePage.hbs');
                    });
                }).catch(notifier.handleError);
        }

        function displayHowToPlay(ctx) {
            ctx.isAnonymous = sessionStorage.getItem('username') === null;
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                header: './templates/common/header.hbs',
            }).then(function () {
                this.partial('./templates/gameplay/howtoplay.hbs');
            });
        }

    });

    app.run();
}

// master