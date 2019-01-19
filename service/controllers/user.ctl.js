const User      = require('../models/user.js'),
      Surfboard = require('../models/surfboard');

module.exports = {

    getHistory: async function(req, res){
        const result = await User.find({email: req.query.email});

        if(result)
            res.send(JSON.stringify(result[0].surfboards));
        else res.status(404).send(`{"Failure": "No Documents Were Found"}`);
    },

    addUserSurfboard: async function(req, res){

        const {_id = null, brand = null, maxSwell = null, height = null, width = null, thickness = null, userMinWeight = null, userMaxWeight = null, email = null} = req.body;
        const surfboard = new Surfboard({_id, brand, maxSwell, height, width, thickness, userMinWeight, userMaxWeight});

        let result = await User.updateOne({email: email},{$push: {surfboards: surfboard}});

        if(result && result.nModified > 0)
            res.status(200).send(`{"result": "Success"}`);
        else res.status(404).send(`{"result": "Failure"}`);
    },
    
    addUser: async function(req, res){
        const {email = null, name = null} = req.body;
        const user = new User({email, name});
        
        
        user.save().then( (result) =>{
            res.status(200).send(result);
        },
        (err) =>{
            console.log(err);
            res.status(404).send(`{"result": "Failure"}`);
        });
    },

    updateUser: async function(req, res){
        const conditions = {email: req.query.email},
              {height = 0, weight = 0, level = -1} = req.query,
              update     = {height: height, weight: weight, level: level};
              opts       = {runValidators: true};

        User.updateOne(conditions, update, opts).then( result => {
            if(result.nModified === 0){
                res.status(200).send(`{"result": "Failure"}`);
                return;
            }

            res.status(200).send(`{"result": "Success"}`);
         }, err =>{
            res.status(404).send({"result": "Failure"});
         })
    }
}