var Surfboard   = require('../models/surfboard');

module.exports = {

    getAll: async function(req, res){
        console.log("here");
        const result = await Surfboard.find({});
        
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