const User      = require('../models/user.js'),
      Surfboard = require('../models/surfboard');

module.exports = {

    getHistory: async (req, res) => {
        User.find({email: req.query.email}).then( (result) => {
            if(!result.length)
                res.status(404).send(`{"result": "Faliure", "error": "No Documents Were Found", "params": "${req.query.email}"}`);
            else if (!result[0].surfboards.length)
                res.send(`{"result": "Faliure", "error": "User History Is Empty.", "params": "${req.query.email}"}`);
            else res.send(JSON.stringify(result[0].surfboards));
       },
       (err) =>{
           res.status(404).send(`{"Failure": "No Documents Were Found", "error": ${JSON.stringify(err)}}`);
       });
    },

    addUserSurfboard: async (req, res) => {

        const {_id = null, brand = null, maxSwell = null, height = null, width = null, thickness = null, userMinWeight = null, userMaxWeight = null} = req.body.surfboard;
        const surfboard = new Surfboard({_id, brand, maxSwell, height, width, thickness, userMinWeight, userMaxWeight}),
              {email = null} = req.body.email;
        console.log(req.body.surfboard);
        User.updateOne({email: email},{$push: {surfboards: surfboard}}).then( (result) => {
            if(result && result.nModified > 0)
                res.status(200).send(`{"result": "Success", "params": {"email": "${req.body.email}", "update": ${JSON.stringify(surfboard)}}}`);
            else res.status(404).send(`{"result": "Failure", "params":{"email": "${req.body.email}", "update": ${JSON.stringify(surfboard)}}}`);
        },
        (err) => {
            res.status(404).send(`{"result": "Failure", "params":{"email": "${req.body.email}", "update": ${JSON.stringify(surfboard)}}, "error": ${JSON.stringify(err)}}`);
        });     
    },
    
    addUser: async (req, res) => {
        const {email = null, name = null} = req.body;
        const user = new User({email, name});
        
        
        user.save().then( (result) => {
            console.log(result);
            res.status(200).send(`{"result": "Success", "params": ${JSON.stringify(result)}}`);
        },
        (err) =>{
            console.log(err);
            res.status(404).send(`{"result": "Failure", "params":{"email": "${email}", "name": "${name}"}, "error": ${JSON.stringify(err)}}`);
        });
    },

    updateUser: async (req, res) => {
        const conditions = {email: req.query.email},
              {height = 0, weight = 0, level = -1} = req.query,
              update     = {height: height, weight: weight, level: level};
              opts       = {runValidators: true};

        User.updateOne(conditions, update, opts).then( result => {
            if(result.nModified === 0){
                res.status(404).send(`{"result": "Failure", "params":{"email": "${req.query.email}", "update": ${JSON.stringify(update)}}}`);
                return;
            }

            res.status(200).send(`{"result": "Success", "params": {"email": "${req.query.email}", "update": ${JSON.stringify(update)}}}`);
         }, err =>{
            res.status(404).send(`{"result": "Failure", "params":{"email": "${req.query.email}", "update": ${JSON.stringify(update)}}, "error": ${JSON.stringify(err)}}`);
         })
    }
}