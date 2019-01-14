var Surfboard   = require('../models/surfboard');

module.exports = {

    getAll: async function(req, res){
        console.log("here");
        const result = await Surfboard.find({});
        
        if(result)
            res.send(JSON.stringify(result));
        else res.status(404).send(`{"Failure": "No Documents Were Found"}`);
    }

}