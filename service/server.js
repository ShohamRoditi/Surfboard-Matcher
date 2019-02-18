const   express      = require('express'),
        app          = express(),
        surfboardCtl = require('./controllers/surfboard.ctl'),
        userCtl      = require('./controllers/user.ctl'),
        port         = process.env.PORT || 3000,
        parser       = require('body-parser'),
        cors         = require('cors'),
        http         = require('http').Server(app);

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

const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('New user connected')
    
	//default username
	socket.username = "Anonymous"
    
    
    //listen on new_message
    socket.on('disconnect', () => {
        //broadcast the new message
        console.log("bye")
    })
    
    //listen on typing
    socket.on('test', async () => {
        const result1 = await surfboardCtl.getWeather(194);
        const result2 = await surfboardCtl.getWeather(4219);
        socket.emit('broadcast', `broadcast! ${result1} ${result2}`);
    })
})
