var mongoose    = require('mongoose'),
    Surfboard   = require("./surfboard"),
    user   = new mongoose.Schema({
        email:{
            type: String,
            index: 1
        },
        name:   String,
        height: Number,
        level:  Number,
        weight: Number,
        surfboards: [Surfboard]
    });

var User = mongoose.model('User', user);

module.exports = User;