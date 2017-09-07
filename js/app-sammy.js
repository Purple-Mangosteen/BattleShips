function startApp() {
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


    const app = Sammy('#container', function () {
        // TODO: Define all the routes      
        console.log('i work!');

        //initializations
        this.use('Handlebars', 'hbs');

        //routes
        this.get('index.html', redirectToHome);
        this.get('#/home', displayHome);
        this.get('#/logout', logOutUser);
        this.get('#/choose-map', displayChooseMapForm);
        this.get('#/myposts', displayMyPosts);
        this.get('#/deletepost/:id', deletePost);
        this.get('#/editpost/:id', displayEditPostForm);
        this.get('#/postdetails/:id', displayPostDetails);
        this.get('#/deletecomment/:id', deleteComment);


        //put this last!
        this.get('', redirectToHome);

        this.post('#/login', logInUser);
        this.post('#/register', registerUser);
        this.post('#/newpost', saveNewPost);
        this.post('#/editpost/:id', savePostEdits);
        this.post('#/addcomment/:id', saveComment);


        //functions
        function redirectToHome(ctx) {
            ctx.redirect('index.html#/home');
        }

        function displayHome(ctx) {

            if (sessionStorage.getItem('authtoken')) {
                ctx.redirect('#/catalog');
            }

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/home/home.hbs');
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

        function displayChooseMapForm(ctx) {

            if (sessionStorage.getItem('authtoken')) {
                ctx.redirect('#/catalog');
            }

            ctx.loadPartials({
                header: '../templates/common/header.hbs',
            }).then(function () {
                this.partial('../templates/home/home.hbs');
            });
        }





        //end of Sammy app
    });

    app.run();
}