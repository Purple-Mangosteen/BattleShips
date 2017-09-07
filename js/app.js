$(()=>{

     // ---ATTACH EVENT HANDLERS
     (()=>{

       $('nav').find('a[data-target]').click(navigateTo);
         $('.container').find('button[data-target]').click(navigateTo);

         $('#formRegister').submit(registerUser);
         $('#formLogin').submit(loginUser);
         $('#linkMenuLogout').click(logOutUser);

    })();


    function navigateTo() {
        let dataTarget = $(this).attr('data-target');

        showView(dataTarget);
    }


    //--- REGISTER USER---
    function registerUser(ev) {

        ev.preventDefault();

        let registerUsername= $('#username-register');
        let registerEmail = $('#email-register');
        let registerPassword = $('#pwd-register');
        let registerConfirmPassword = $('#pwd-confirm-register');

        let username = registerUsername.val();
        let email = registerEmail.val();
        let password = registerPassword.val();
        let confirmPassword = registerConfirmPassword.val();

        if(validation(username,email,password,confirmPassword)){
            auth.register(username, password, email)
                .then((userInfo) =>{
                    registerEmail.val('');
                    registerUsername.val('');
                    registerPassword.val('');
                    registerConfirmPassword.val('');
                    saveSession(userInfo);
                    showInfo("Register successful." );
                    showView('game-menu');
                })
                .catch((errorInfo) =>{
                handleError(errorInfo)
            })
        }
    }


    //--- LOGIN USER ---
    function loginUser(ev) {
        ev.preventDefault();
        let loginUsername= $('#username-login');
        let loginPasswd = $('#pwd-login');

        let username = loginUsername.val();
        let password =  loginPasswd.val();

        auth.login(username, password)
            .then((userInfo) =>{
                loginUsername.val('');
                loginPasswd.val('');
                saveSession(userInfo);
                showInfo("User login successful." );
                showView('game-menu');
            })
            .catch((errorInfo) =>{
                handleError(errorInfo)
            })

    }

    //--- LOGOUT USER ---
    function logOutUser() {
        auth.logout()
            .then(() =>{
                sessionStorage.clear();
                showInfo('LogOut successful');
                userLoggedOut();
            })
            .catch(handleError)
    }

    //--- VALIDATIONS ---
    function validation(username, email, password, confirmPassword) {
        if(username.length < 3 ){
            showError('username should be at least 3 characters');
            return false
        }
        if(password.length < 4 ){
            showError('password should be at least 4 characters');
            return false
        }
        if(password !== confirmPassword){
            showError("password doesn't match");
            return false
        }
        return true
    }



    if(sessionStorage.getItem('authtoken') === null){
        userLoggedOut();
    }else{
        userLoggedIn();
    }


    function showView(viewName) {
        // Hide all views and show the selected view only
       // console.log(viewName);
        $('main > section').hide();
        $('#section-' + viewName).show();
    }
    
    
    function userLoggedIn() {
        $('.anonymous').hide();
        $('.useronly').show();
        let username = sessionStorage.getItem('username');
        $('#spanMenuLoggedInUser').text(username);
        $('#battleShipsLogo').click(() => {
            showView('game-menu');
        });
        showView('game-menu');
    }

    function userLoggedOut() {
        $('.anonymous').show();
        $('.useronly').hide();
        $('#spanMenuLoggedInUser').text('');
        $('#battleShipsLogo').click(() => {
            showView('appHome');
        });
        showView('appHome');
    }


    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('name', userInfo['name']);
        userLoggedIn();
    }



    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function handleError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }


    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }


    // ---HANDLE NOTIFICATIONS----
    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

});