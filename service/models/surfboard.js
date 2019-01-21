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

/* Validations */
surfboard.path('brand').validate( 
    (val) => {
        if (!val)
            return false;
        
        return true;
    }, "Brand was not defined correctly.");

surfboard.path('maxSwell').validate( 
    (val) => {
        if (!val || val < 1)
            return false;
        
        return true;
    }, "maxSwell was not defined correctly. maxSwell should be at least 1m.");

surfboard.path('height').validate( 
    (val) => {
        if (!val || val < 170)
            return false;
        
        return true;
    }, "Height was not defined correctly. Height should be at least 170cm.");

surfboard.path('width').validate( 
    (val) => {
        if (!val || val < 30)
            return false;
        
        return true;
    }, "Width was not defined correctly. Width should be at least 30cm.");

surfboard.path('thickness').validate( 
    (val) => {
        if (!val || val < 3)
            return false;
        
        return true;
    }, "Thickness was not defined correctly. Thickness should be at least 3cm.");

surfboard.path('userMinWeight').validate( 
    (val) => {
        if (!val || val < 35 || val > 96)
            return false;
        
        return true;
    }, "userMinWeight was not defined correctly. userMinWeight should be at least 35kg and no more than 96.");

surfboard.path('userMaxWeight').validate( 
    (val) => {
        if (!val || val < 45 || val > 105)
            return false;
        
        return true;
    }, "userMaxWeight was not defined correctly. userMaxWeight should be at least 45kg and no more than 105.");

/* End Of Validations*/

var Surfboard = mongoose.model('Surfboard', surfboard);

module.exports = Surfboard;