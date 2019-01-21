const User      = require('../models/user.js'),
      Surfboard = require('../models/surfboard');

module.exports = {

    getHistory: async (req, res) => {
        User.find({email: req.query.email}).then( (result) =>{
            if(result)
                res.send(JSON.stringify(result[0].surfboards));
            else res.status(404).send(`{"Failure": "No Documents Were Found"}`);
       },
       (err) =>{
           res.status(404).send(`{"Failure": "No Documents Were Found", "error": ${JSON.stringify(err)}}`);
       });
    },

    addUserSurfboard: async (req, res) => {

        const {_id = null, brand = null, maxSwell = null, height = null, width = null, thickness = null, userMinWeight = null, userMaxWeight = null, email = null} = req.body;
        const surfboard = new Surfboard({_id, brand, maxSwell, height, width, thickness, userMinWeight, userMaxWeight});

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
        
        
        user.save().then( (result) =>{
            res.status(200).send(`{"result": "Success", "params": ${JSON.stringify(result)}}`);

        },
        (err) =>{
            console.log(err);
            res.status(404).send(`{"result": "Failure", "params": ${JSON.stringify(result)}, "error": ${JSON.stringify(err)}}`);
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