let gameServices = (()=>{

    function createMap( board) {

        let postData = {
            gameNumber: '14',
            board: board,
            gameName: '#9999'
        };

        console.log(JSON.stringify(postData));
        let endpoint = 'gameBoards';
        return requester.post('appdata', endpoint, 'Kinvey', postData);
    }





    return{
        createMap,
    }

})();
