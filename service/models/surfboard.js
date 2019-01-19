var mongoose    = require('mongoose'),
    surfboard   = new mongoose.Schema({
        brand:          String,
        maxSwell:       Number,
        height:         Number,
        width:          Number,
        thickness:      Number,
        userMinWeight:  Number,
        userMaxWeight:  Number
    });

var Surfboard = mongoose.model('Surfboard', surfboard);

module.exports = Surfboard;