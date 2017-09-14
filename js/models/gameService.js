let gameServices = (()=>{

    function createMap( board , gameNumber, gameName) {

        let postData = {
            gameNumber: gameNumber,
            board: board,
            gameName: gameName
        };

       // console.log(JSON.stringify(postData));
        let endpoint = 'gameBoards';
        return requester.post('appdata', endpoint, 'Kinvey', postData);
    }


    function getTheLastMap() {

        let  endpoint = 'gameBoards?query={}&sort={"_kmd": -1}&limit=1';

       return requester.get('appdata', endpoint, 'Kinvey')

    }



    return{
        createMap,
        getTheLastMap
    }

})();
