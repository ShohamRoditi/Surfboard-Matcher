var mongoose    = require('mongoose'),
    surfboard   = new mongoose.Schema({
        id:{
            type: Number,
            index: 1
        },
        brand:      String,
        swell:      Number,
        height:     Number,
        width:      Number,
        thickness:  Number,
        level:      Number,
        userWeight: Number
    });

var Surfboard = mongoose.model('Surfboard', surfboard);

module.exports = Surfboard;