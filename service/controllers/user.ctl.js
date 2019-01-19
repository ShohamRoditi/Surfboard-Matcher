const User      = require('../models/user.js'),
      Surfboard = require('../models/surfboard');

module.exports = {

//app.put('/updateUser', userCtl.updateUser);


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
              update     = {height: req.query.height, weight: req.query.weight, level: req.query.level};

        const result = await User.updateOne(conditions, update);

        console.log(result);

        res.status(200).send("d");
    }
}