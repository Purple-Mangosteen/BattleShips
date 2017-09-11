let gameServices = (()=>{

    function createMap( board) {

        let postData = {
            gameNumber: '333333',
            board: board
        };

        console.log(JSON.stringify(postData));
        let endpoint = 'gameBoards';
        return requester.post('appdata', endpoint, 'Kinvey', JSON.stringify(postData));
    }





    return{
        createMap,
    }

})();
