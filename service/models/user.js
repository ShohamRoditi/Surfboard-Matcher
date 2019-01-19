var mongoose    = require('mongoose'),
    Surfboard   = require("./surfboard"),
    ObjectId    = mongoose.SchemaTypes.ObjectId,
    user        = new mongoose.Schema({
        email:{
            type: String,
            unique: true,
            dropDups: true,
            required: true,
            index: 1
        },
        name:   String,
        height: Number,
        level:  Number,
        weight: Number,
        surfboards: []
    });

var User = mongoose.model('User', user);

module.exports = User;