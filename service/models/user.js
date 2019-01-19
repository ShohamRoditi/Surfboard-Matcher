var mongoose    = require('mongoose'),
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

user.path('level').validate( 
    (val) => {
        if (val < 0)
            return false;
        
        return true;
    }, "Level was not defined");

var User = mongoose.model('User', user);


module.exports = User;