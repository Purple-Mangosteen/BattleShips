function startApp() {

    //NOTIFICATIONS
    //$('section').hide();
    $('#errorBox').hide();
    $('#infoBox').hide();
    $('#loadingBox').hide();

    $(document).on({
        ajaxStart: () => $('#loadingBox').show(),
        ajaxStop: () => $('#loadingBox').hide()
    });

    $('#infoBox').click((e) => $(e.target).hide());
    $('#errorBox').click((e) => $(e.target).hide());


    //INITIALIZE SAMMY AND HANDLEBARS
    const app = Sammy('#pagebody', function () {
        // TODO: Define all the routes      
        console.log('i work!');

        //initializations
        this.use('Handlebars', 'hbs');

        //routes
        this.get('index.html', redirectToHome);
        this.get('#/home', displayHome);
        this.get('#/login', displayLoginForm);
        this.get('#/register', displayRegisterForm);
        this.get('#/logout', logOutUser);
        this.get('#/choose-map', displayChooseMapForm);
        this.get('#/play', displayGameBoard); //possibly '#play/:id'  where id is the id of the map
        this.get('#/create-map', displayCreateMapForm);
        this.get('#/hall-of-fame', displayHallOfFame);
        this.get('#/how-to-play', displayHowToPlay);

        //this.get('#/deletepost/:id', deletePost);


        //put this last!
        this.get('', redirectToHome);

        this.post('#/login', logInUser);
        this.post('#/register', registerUser);
        this.post('#/newMap', saveNewMap);

        //functions
        function redirectToHome(ctx) {
            ctx.redirect('index.html#/home');
        }

        function displayHome(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/home/home.hbs');
            });
        }

        function displayLoginForm(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/user/loginform.hbs');
            });
        }

        function displayRegisterForm(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/user/registerform.hbs');
            });
        }        

        function displayChooseMapForm(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/gameplay/chosegame.hbs');
            });
        }

        function displayGameBoard(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/gameplay/gameboard.hbs');
            });
        }

        function displayCreateMapForm(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/gameadmin/createmapform.hbs');
            });
        }

        function displayHallOfFame(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/highscore/halloffame.hbs');
            });
        }

        function displayHowToPlay(ctx) {

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/gameplay/howtoplay.hbs');
            });
        }

        function logInUser(ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            console.log(`attempting login for ${username}`);


            auth.login(username, password)
                .then(function (userInfo) {
                    console.log('logged in!');
                    auth.saveSession(userInfo);
                    notifier.showInfo('Login successful.');
                    ctx.redirect('#/catalog');

                })
                .catch(notifier.handleError);
        }

        function logOutUser(ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    //displayHome(ctx);
                    notifier.showInfo('Logout successful.');
                    ctx.redirect('#/home');
                })
                .catch(auth.handleError);
        }

        function registerUser(ctx) {
            let newUser = {
                username: ctx.params.username,
                password: ctx.params.password,
                repeatPass: ctx.params.repeatPass
            };

            console.log(`verifying input for ${newUser.username}`);

            if (newUser.password !== newUser.repeatPass) {
                notifier.showError('Passwords do not match');

            } else {
                if (!validator.validateUserName(newUser.username)) {
                    notifier.showError('Invalid username: should be at least 3 characters long and should contain only english alphabet letters.');
                } else if (!validator.validatePass(newUser.password)) {
                    notifier.showError('Invalid password : should be at least 6 characters long and should contain only english alphabet letters and digits');
                } else {
                    console.log(`Attempting to register user ${newUser.username}`);
                    auth.register(newUser)
                        .then(function (userInfo) {
                            auth.saveSession(userInfo);
                            //displayHome(ctx); 
                            notifier.showInfo('Registered and Logged in!');
                            ctx.redirect('#/catalog');

                        })
                        .catch(notifier.handleError);
                }
            }
        }

        function saveNewMap(ctx){
            console.log('saving new map!');
        }

        //end of Sammy app
    });

    app.run();
}