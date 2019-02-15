const   express      = require('express'),
        app          = express(),
        surfboardCtl = require('./controllers/surfboard.ctl'),
        userCtl      = require('./controllers/user.ctl'),
        port         = process.env.PORT || 3000,
        parser       = require('body-parser'),
        cors         = require('cors');

app.set('port', port);
app.use(cors());
app.use(parser.json({extended : true}));
app.use('/', express.static('./public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Request-Method", "PUT, DELETE, GET, POST");
    res.header("HTTP/1.1 200 OK");
    res.set("Content-Type", "application/json");
    next();
});

/*** Surfboard routes ***/
app.get('/getAllSurfboards', surfboardCtl.getAll);
app.get('/matchSurfboard', surfboardCtl.getMatched);
app.put('/admin/updateSurfboard', surfboardCtl.updateSurfboard);
app.post('/admin/addSurfboard', surfboardCtl.addSurfboard);
app.delete('/admin/deleteSurfboard', surfboardCtl.deleteSurfboard);

/*** User routes ***/
app.get('/getUser', userCtl.getUser);
app.get('/getHistory', userCtl.getHistory);
app.post('/addUser', userCtl.addUser);
app.put('/updateUser', userCtl.updateUser);
app.put('/addUserSurfboard', userCtl.addUserSurfboard);
app.delete('/deleteFromHistory', userCtl.deleteFromHistory);

app.get('/api', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/5628146/RztfvBcS');
});

app.all('*', (req, res) => {
    res.status(404).send(`{"result": "Failure", "error": "Bad Route"}`)
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});