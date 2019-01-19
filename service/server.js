const   express      = require('express'),
        app          = express(),
        surfboardCtl = require('./controllers/surfboard.ctl'),
        userCtl      = require('./controllers/user.ctl'),
        port         = process.env.PORT || 3000,
        parser       = require('body-parser');

app.set('port', port);
app.use(parser.json({extended : true}));
app.use('/', express.static('./public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
});

/*** All routes ***/
app.get('/getAllSurfboards', surfboardCtl.getAll);
app.get('/matchSurfboard', surfboardCtl.getMatched);
//app.put('/updateSurfboard', surfboardCtl.updateSurfboard);
//app.post('/admin/addSurfboard', surfboardCtl.addSurfboard);
//app.delete('/admin/deleteSurfboard', surfboardCtl.deleteSurfboard);
app.get('/getHistory', userCtl.getHistory);
app.post('/addUser', userCtl.addUser);
app.put('/updateUser', userCtl.updateUser);
app.post('/addUserSurfboard', userCtl.addUserSurfboard);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});