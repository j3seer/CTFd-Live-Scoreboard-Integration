const express = require('express');
const app = express()
const bodyParser = require("body-parser");
const fs = require('fs')
const server = require('http').createServer(app)
const utils = require('./utils.js')


CTF_TITLE = process.env.CTF_TITLE
scoreboard_file = process.env.start_date || "./scoreboard.json"
firstblood_file = process.env.start_date || "./firstblood.json"
CTFd_TOKEN = process.env.CTFd_TOKEN || "TOKEN"
start_date = process.env.start_date || "2000-01-01 00:00:00"
finish_date = process.env.finish_date || "2000-01-02 00:00:00"
PORT = process.env.PORT || 5000

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:" + PORT.toString(),
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json());



app.post('/api/scoreboard', utils.authcheck, (req, res) => {
    try {
        data = JSON.parse(JSON.stringify(req.body))
        // save in case breaks to reload
        fs.writeFile('scoreboard_log.json', JSON.stringify(req.body), function(err) {
            if (err) throw err;
            console.log('Saved scoreboard!');
        });
        io.emit("update", data)
        res.send('OK! Updating Scoreboard!');
    } catch {
        res.send('Something went wrong..');
    }
});


app.post('/api/firstblood', utils.authcheck, (req, res) => {
    data = JSON.parse(JSON.stringify(req.body))
    // save blood
    fs.appendFile('firstblood_log.txt', JSON.stringify(req.body) + "\n", function(err) {
        if (err) throw err;
        console.log('Saved firstbloods!');
    });
    io.emit("firstblood", data);

    res.send('OK! Scheduled Blood');


});


app.post('/api/solve', utils.authcheck, (req, res) => {
    data = JSON.parse(JSON.stringify(req.body))
    // save solve
    fs.appendFile('solves.txt', JSON.stringify(req.body) + "\n", function(err) {
        if (err) throw err;
        console.log('Saved solve!');
    });
    io.emit("solve", data);

    res.send('OK! Solve sent!');


});

io.on('connection', socket => {
   // clean activity table from frontend
   io.emit("clean")

   console.log("Connected via socket:" + socket.id.toString())
   try {
         if (fs.statSync('scoreboard_log.json').size != 0) {
            var d = JSON.parse(fs.readFileSync('./scoreboard_log.json', 'utf8'));
            // update scoreboard
            io.emit("update", d);
         }  
   } catch (err) {
      console.log(err)
   }

   try {
      if (fs.statSync('./solves.txt').size != 0) {
         fs.readFileSync('./solves.txt', 'utf-8').split(/\r?\n/).forEach(function(line) {
            if (line) {
               io.emit("solve", JSON.parse(line));
            }
         })
      }
    } catch (err) {
      console.log(err)
    }

});

app.get('/activity', (req, res) => {
    res.render('activity', {
        title: CTF_TITLE,
        start: start_date,
        finish: finish_date,
    })
});

app.get('/', (req, res) => {
    res.render('index', {
        title: CTF_TITLE,
        start: start_date,
        finish: finish_date,
    })
});

// error handler
app.use((err, req, res, next) => {
    res.status(400).send(err.message)
})

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:%s", PORT);
});