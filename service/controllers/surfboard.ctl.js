var Surfboard   = require('../models/surfboard'),
    fetch       = require('node-fetch');

async function getWeather(){
    var result;
    var url = 'http://magicseaweed.com/api/fddcb4d4dfe5f4d98e9ba4c0351d9614/forecast/?spot_id=3663';

    try {
        const response = await fetch(url);
        result = await response.json();
    } 
    catch (error) {
        console.log(error);
    }

        return result;
      
}


module.exports = {

    getAll: async function(req, res){
        //const result = await Surfboard.find({});
        const result = await getWeather();
        console.log(result);
        if(result)
            res.send(JSON.stringify(result));
        else res.status(404).send(`{"Failure": "No Documents Were Found"}`);
    },

    getMatched: async function(req, res){
        const conditions = {height:{$gt: parseFloat(req.query.height) - 0.2, $lt: parseFloat(req.query.height) + 0.2}, userWeightMin: {$gt: parseFloat(req.query.weight) - 1},
                            userWeightMax: {$lt: parseFloat(req.query.weight) + 11}};
        let result;
        console.log(conditions);
        result = await Surfboard.find(conditions);

        res.send(JSON.stringify(result));
    }
}