var mongoose    = require('mongoose'),
    validator   = require('email-validator'),
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

/* Validations */

user.path('email').validate( 
    (val) => {
        if (!val)
            return false;
        
        if(!validator.validate(val))
            return false;
        
        return true;
    }, "Email was not defined correctly.");
    
user.path('name').validate( 
    (val) => {
        if (!val)
            return false;
        
        return true;
    }, "Name was not defined correctly.");
    
user.path('height').validate( 
    (val) => {
        if (val < 80 || !val)
            return false;
        
        return true;
    }, "Height was not defined correctly. Height should be at least 80cm.");

user.path('level').validate( 
    (val) => {
        if (!val || val < 0 || val > 10)
            return false;
        
        return true;
    }, "Level was not defined correctly. Level should be at least 0 and no more than 10.");
            
user.path('weight').validate( 
    (val) => {
        if (!val || val < 10)
            return false;
        
        return true;
    }, "Weight was not defined correctly. Weight should be at least 10kg.");
                
/* End Of Validations*/

var User = mongoose.model('User', user);

module.exports = User;