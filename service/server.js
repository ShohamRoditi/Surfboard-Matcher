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

const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log("bye");
    })
    
    socket.on('connected', async () => {
        const result1 = await surfboardCtl.getWeather(194);
        const result2 = await surfboardCtl.getWeather(4219);
        socket.emit('conditions', {location1: result1, location2: result2});
    })
})

/* Admin Check Conditions route */
app.get('/admin/updateClients', async (req, res) => {
    const result1 = await surfboardCtl.getWeather(194);
    const result2 = await surfboardCtl.getWeather(4219);
    io.emit('conditions', {location1: result1, location2: result2});
    res.status(200).send(`{"result": "Success", "response": {"location1": ${result1}, "location2": ${result2}}}`);
})

app.all('*', (req, res) => {
    res.status(404).send(`{"result": "Failure", "error": "Bad Route"}`)
});