const User      = require('../models/user.js'),
      Surfboard = require('../models/surfboard'),
      ObjectId  = require('mongoose').Types.ObjectId;

module.exports = {
    /* Gets user's saved matching surfboards */
    getHistory: async (req, res) => {
        User.find({email: req.query.email}).then( (result) => {
            if(!result.length)
                res.status(404).send(`{"result": "Failure", "error": "No Documents Were Found", "params": "${req.query.email}"}`);
            else if (!result[0].surfboards.length)
                res.send(`{"result": "Failure", "error": "User History Is Empty.", "params": "${req.query.email}"}`);
            else res.send(JSON.stringify(result[0].surfboards));
       },
       (err) =>{
           res.status(404).send(`{"Failure": "No Documents Were Found", "error": ${JSON.stringify(err)}}`);
       });
    },
     /* Adds a surfboard to the user's saved matching surfboards history */
    addUserSurfboard: async (req, res) => {
        console.log(req.body);
        const {_id = null, brand = null, maxSwell = null, height = null, width = null, thickness = null, userMinWeight = null, userMaxWeight = null} = req.body.surfboard;
        const surfboard = new Surfboard({_id, brand, maxSwell, height, width, thickness, userMinWeight, userMaxWeight});
        const email = req.body.email;

        User.updateOne({email: email},{$push: {surfboards: surfboard}}).then( (result) => {
            if(result && result.nModified > 0)
                res.status(200).send(`{"result": "Success", "params": {"email": "${req.body.email}", "update": ${JSON.stringify(surfboard)}}}`);
            else res.status(404).send(`{"result": "Failure", "params":{"email": "${req.body.email}", "update": ${JSON.stringify(surfboard)}}}`);
        },
        (err) => {
            res.status(404).send(`{"result": "Failure", "params":{"email": "${req.body.email}", "update": ${JSON.stringify(surfboard)}}, "error": ${JSON.stringify(err)}}`);
        });     
    },
    
    /* Adds a new user */
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

    /* Updates a user's weight, height and level */ 
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
    },

    deleteFromHistory: async (req, res) => {
        const {_id = null, email = null} = req.query;
        var update = {$pull: {surfboards: {_id: ObjectId(_id)}}};

        //User.find({email: email, surfboard})
        User.updateOne({email: email}, update).then( (result) => {
            if(result && result.nModified > 0)
                res.status(200).send(`{"result": "Success", "params":{"email": "${req.query.email}", "id": "${req.query._id}"}}`);
            else res.status(404).send(`{"result": "Failure", "params":{"email": "${req.query.email}", "id": "${req.query._id}"}}`);
        },
        (err) => {
            console.log(err);
            res.status(404).send(`{"result": "Failure", "params":{"email": "${req.query.email}", "id": "${req.query._id}", "error": ${JSON.stringify(err)}}`);
        });     
    },

    getUser: async (req,res) => {
        const email = req.query.email;

        User.find({email: email}).then(result => {
            console.log(result);
            if(result.length)
                res.send(JSON.stringify(`{"result": "Success", "response": ${JSON.stringify(result)}`));
            else res.status(200).send(`{"result": "Failure", "response": "No Documents Were Found"}`);
        }, err =>{
            res.status(404).send(`{"result": "Failure", "response": "No Documents Were Found"}`);
        });
    }
}