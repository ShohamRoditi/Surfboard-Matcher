const   express      = require('express'),
        app          = express(),
        surfboardCtl = require('./controllers/surfboard.ctl'),
        port         = process.env.PORT || 3000;

app.set('port',port);
app.use('/', express.static('./public'));
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
});

/*** All routes ***/
app.get('/getAllSurfboards', surfboardCtl.getAll);
//app.get('/matchSurfboard', surfboardCtl.getMatched);
//app.get('/final-ideas/updateIdea', ideaCtl.updateData);
//app.get('/final-ideas/deleteIdea', ideaCtl.deleteData);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});