let gameServices = (()=>{

    function createMap(board, gameName) {

        //get last index number and increment for 
        let gameIndex = getLastGameIndex() + 1;
        
        let postData = {
            'gameNumber': gameIndex,
            'board': board,
            'gameName' : gameName
        };

        console.log(JSON.stringify(postData));

        //turned that off. let get the object defined properly

        // let endpoint = 'gameBoards';
        // return requester.post('appdata', endpoint, 'Kinvey', JSON.stringify(postData));
    }





    return{
        createMap,
    }

})();
