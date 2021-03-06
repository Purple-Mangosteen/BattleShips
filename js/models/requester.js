let requester = (() => {
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_ByZceVpYb"; // APP KEY HERE
    const kinveyAppSecret = "64396b4c538c4e4ea6fc30726cb2133f"; // APP SECRET HERE

    // Creates the authentication header
    function makeAuth(type) {
        if(type==='basic') {
        return 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret);
        } else if(type==='Master'){
            return 'Basic a2lkX0J5WmNlVnBZYjoxYzEwOTg2MWIyMTc0YmUyYmEyZTNmNDljZTNlMTFiOQ==';
        } else {
            return 'Kinvey ' + sessionStorage.getItem('authtoken');
        }            
    }

    // Creates request object to kinvey
    function makeRequest(method, module, endpoint, auth) {
        return req = {
            method,
            url: kinveyBaseUrl + module + '/' + kinveyAppKey + '/' + endpoint,
            headers: {
                'Authorization': makeAuth(auth)
            }
        };
    }

    // Function to return GET promise
    function get (module, endpoint, auth) {
        return $.ajax(makeRequest('GET', module, endpoint, auth));
    }

    // Function to return POST promise
    function post (module, endpoint, auth, data) {
        let req = makeRequest('POST', module, endpoint, auth);
        req.data = data;
        return $.ajax(req);
    }

    // Function to return PUT promise
    function update (module, endpoint, auth, data) {
        let req = makeRequest('PUT', module, endpoint, auth);
        req.data = data;
        return $.ajax(req);
    }

    // Function to return DELETE promise
    function remove (module, endpoint, auth) {
        return $.ajax(makeRequest('DELETE', module, endpoint, auth));
    }

    return {
        get,
        post,
        update,
        remove
    }
})();