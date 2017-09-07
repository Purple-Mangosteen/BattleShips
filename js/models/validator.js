let validator = (() => {

    //A username should be at least 3 characters long and 
    //should contain only english alphabet letters.
    function validateUserName(username) {
        if (username.length < 3) {
            return false;
        }

        let regex = new RegExp(`^[a-zA-Z]+$`);
        if (!regex.exec(username)) {
            return false;
        }

        return true;
    }

    //A user‘s password should be at least 6 characters long and 
    //should contain only english alphabet letters and digits. 
    function validatePass(pass) {

        if (pass.length < 6) {
            return false;
        }

        let regex = new RegExp(`^[a-zA-Z0-9]+$`);
        if (!regex.exec(pass)) {
            return false;
        }

        return true;
    }
    
    //url should always start with “http”. 
    function validateUrl(url) {
        if (url.substr(0, 4) !== 'http') {
            return false;
        }

        let regex2 = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
        let match = regex2.exec(url);


        if(!match){
            return false;
        }

        
        return true;
    }

    // title is not optional
    function validateTitle(title) {
        if (title.length < 1) {
            return false;
        }
        return true;
    }

    return {
        validateUserName,
        validatePass,
        validateUrl,
        validateTitle
    }
})();