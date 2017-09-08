let validator = (() => {

    //A username should be at least 3 characters long and 
    //should contain only english alphabet letters.
    function validateUserName(username) {
        if (username.length < 3) {
            notifier.showError('Invalid username: should be at least 3 characters long and should contain only english alphabet letters.');
            return false;
        }

        let regex = new RegExp(`^[a-zA-Z]+$`);
        if (!regex.exec(username)) {
            notifier.showError('Invalid username: should be at least 3 characters long and should contain only english alphabet letters.');
            return false;
        }

        return true;
    }

    //A user‘s password should be at least 6 characters long and 
    //should contain only english alphabet letters and digits. 
    function validatePass(pass) {

        if (pass.length < 6) {
            notifier.showError('Invalid password : should be at least 6 characters long and should contain only english alphabet letters and digits');
            return false;
        }

        let regex = new RegExp(`^[a-zA-Z0-9]+$`);
        if (!regex.exec(pass)) {
            notifier.showError('Invalid password : should be at least 6 characters long and should contain only english alphabet letters and digits');
            return false;
        }

        return true;
    }

    function checkIfPasswordMatch(password, repeatPass) {
        if (password !== repeatPass) {
            notifier.showError('Passwords do not match');
            return false;
        }

        return true;
    }


    return {
        validateUserName,
        validatePass,
        checkIfPasswordMatch
    }
})();