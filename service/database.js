var consts      = require("./consts"),
    mongoose    = require('mongoose');

var Surfboard   = require('./models/surfboard'),

    options = {
        useNewUrlParser:    true,
        useCreateIndex:     true,
        user:               consts.DB_USER,
        pass:               consts.DB_PASS,
        autoReconnect :true
    };

mongoose.connect(consts.MLAB_URL,options).then(
        () => {
            console.log('connected');
        },
        err => {
            console.log(`connection error: ${err}`);
        }
);