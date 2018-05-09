///SERVER///

const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const {hashPassword, checkPassword} = require('./bcrypt')
const {register, getMatchesByEmail, getInfo, insertImage, editBio, acceptFR, cancelFR, sendFR, seeFR, rejectFR, deleteFR, listFR, getUsersbyName, getUsersById} = require('./db')

//socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080 192.168.50.83:* kitty-net.herokuapp.com/:*' });

//upload files stuff:
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const s3 = require('./s3')
const config = require('./config')

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) { //24 is the number of bytes who want the unique id to have, b64 encoded
          callback(null, uid + path.extname(file.originalname)); //originalname is the name as it was in the user file
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 //2MB
    }
});

//MIDDLEWARE:

app.use(express.static('./public'))

const cookieSessionMiddleware = cookieSession({
    secret: 'a very secretive secret',
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(bodyParser());

app.use(compression()); //gzip compression of textual responses

//csurf protection middleware: get the csrf token into a cookie
//verifies request comes from my site, not from someone else's
app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js', //if url is bundle.js, use:
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}


function requireLogin (req, res, next) {
    if(!req.session.user) {
        res.sendStatus(403);
    } else {
        next();
    }
}

//MY ROUTES:

app.get('/user', requireLogin, function(req,res) {
    console.log(req.session.user.id);
    getInfo(req.session.user.id).then (result => {
        console.log("result.rows from getInfo", result.rows);
        res.json({
            success: true,
            id: result.rows[0].id,
            first: result.rows[0].first,
            last: result.rows[0].last,
            email: result.rows[0].email,
            pass: result.rows[0].pass,
            img: result.rows[0].img,
            bio: result.rows[0].bio
        })
    }).catch(e => {
        console.log(e);
        res.json({
            success: false
        })
    })
})

app.post('/upload', uploader.single('file'), s3.upload, function(req, res) { //name of the field where we appended the formData
console.log("upload route req.body", req.body);
console.log("upload route req.file", req.file);
    if (req.file) {
        console.log('file to upload:', req.file, req.body);
        const imgUrl = config.s3Url + req.file.filename;
        console.log(imgUrl);
        insertImage(imgUrl, req.session.user.id).then(function(result) {
            console.log("insert image result.rows", result.rows);
            //todo: io.sockets.emit()
            res.json({
                success: true,
                img: result.rows[0].img
            })
            req.session.user.img = result.rows[0].img;
            console.log(req.session.user.img);
        }).catch(e => {
            console.log(e);
        })
    } else {
        console.log('no file!');
    }
})

//delete session (cookies):
app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/welcome')
})

app.get('/welcome', function(req, res) {
    if (req.session.user){
        res.redirect('/')
    } else {
        res.sendFile(__dirname + '/index.html')
    }
})

app.post("/register", (req, res) => {
    console.log("req.body post register", req.body);
    if (req.body.email && req.body.pass && req.body.first && req.body.last) {
        hashPassword(req.body.pass).then (result => {
            register(req.body.first, req.body.last, req.body.email, result).then(result => {
                console.log("in post register: result.rows[0]", result.rows[0]);
                req.session.user = {
                    id: result.rows[0].id,
                    first: req.body.first,
                    last: req.body.last,
                    email: result.rows[0].email,
                    pass: result.rows[0].pass
                }
                res.json({
                    success: true
                })
            }).catch(e => {
                console.log(e);
                res.json({
                    success: false,
                    error: 'Email already registered: Log in! :)'
                })
            })
        }).catch(e => {
            console.log(e);
            res.json({
                success: false
            })
        })
    } else {
        res.json({
            success: false,
            error: 'Fill all the blanks, kitty cat! ;)'
        })
    }
})

app.post("/login", (req, res) => {
    if (req.body.email && req.body.pass) {
        getMatchesByEmail(req.body.email).then(result => {
            if (result.rows[0] == undefined) {
                res.json({
                    success: false,
                    error: 'Unknown email! Whose that kitty???'
                })
            } else {
            // console.log(req.body.pass, result.rows[0].pass);
                checkPassword(req.body.pass, result.rows[0].pass).then(result2 => {
                    if (result2 == false) {
                        res.json({
                            success: false,
                            error: 'Ooops! Wrong pass! :o'
                        })
                    } else {
                        console.log(req.session.user);
                        req.session.user = {
                            id: result.rows[0].id,
                            first: result.rows[0].first,
                            last: result.rows[0].last,
                            email: result.rows[0].email,
                            pass: result.rows[0].pass
                        }
                        res.json({
                            success: true
                        })
                    }
                }).catch(e => {
                    console.log(e);
                })
            }
        }).catch(e => {
            console.log(e);
        })
    } else {
        res.json({
            success: false,
            error: 'Fill all the blanks, kitty cat! ;)'
        })
    }
})

app.post("/editbio", (req, res) => {
    console.log(req.body);
    if (req.body.bio) {
        editBio(req.body.bio, req.session.user.id).then(result => {
            console.log("editbio results.rows", result.rows);
            res.json({
                success: true,
                bio: result.rows[0].bio
            })
        }).catch(e => {
            console.log(e);
        })
    } else {
        res.json({
            success: false,
            error: 'Express yourself, kitty! ;)'
        })
    }
})

app.get('/get-user/:id', (req, res) => {
    getInfo(req.params.id).then(result => {
        console.log("req.params.id == req.session.user.id ? ", req.params.id,  req.session.user.id, req.params.id == req.session.user.id);
        res.json({
            success: true,
            first: result.rows[0].first,
            last: result.rows[0].last,
            email: result.rows[0].email,
            img: result.rows[0].img,
            bio: result.rows[0].bio,
            sameProfile: (req.params.id == req.session.user.id)
        })
    }).catch(e => {
        console.log(e);
        res.json({
            success: false
        })
    })
})

app.post("/sendFR", (req, res) => {
    console.log("req.body.otherUserId", req.body.otherUserId);
    sendFR(req.session.user.id, req.body.otherUserId, 1).then(result => {
        res.json({
            success: true,
            status: 1,
            receiver_id: result.rows[0].receiver_id,
            sender_id: result.rows[0].sender_id
        })
    }).catch(e => {
        console.log(e);
    })
})

app.post("/cancelFR", (req, res) => {
    console.log("req.body.otherUserId", req.body.otherUserId);
    cancelFR(req.session.user.id, req.body.otherUserId).then(result => {
        console.log("cancelFR results.rows", result.rows);
        res.json({
            success: true,
            sender_id: result.rows[0] && result.rows[0].sender_id,
            receiver_id: result.rows[0] && result.rows[0].receiver_id,
            status: 3
        })
    }).catch(e => {
        console.log(e);
    })
})

app.post("/acceptFR", (req, res) => {
    console.log("req.body.otherUserId", req.body.otherUserId);
    acceptFR(req.session.user.id, req.body.otherUserId).then(result => {
        console.log("acceptFR results.rows", result.rows);
        res.json({
            success: true,
            sender_id: result.rows[0] && result.rows[0].sender_id,
            receiver_id: result.rows[0] && result.rows[0].receiver_id,
            status: 2
        })
    }).catch(e => {
        console.log(e);
    })
})

app.post("/rejectFR", (req, res) => {
    console.log("req.body.otherUserId", req.body.otherUserId);
    rejectFR(req.session.user.id, req.body.otherUserId).then(result => {
        console.log("rejectFR results.rows", result.rows);
        res.json({
            success: true,
            sender_id: result.rows[0] && result.rows[0].sender_id,
            receiver_id: result.rows[0] && result.rows[0].receiver_id,
            status: 5
        })
    }).catch(e => {
        console.log(e);
    })
})

app.post("/deleteFR", (req, res) => {
    console.log("req.body.otherUserId", req.body.otherUserId);
    deleteFR(req.session.user.id, req.body.otherUserId).then(result => {
        console.log("deleteFR results.rows", result.rows);
        res.json({
            success: true,
            sender_id: result.rows[0] && result.rows[0].sender_id,
            receiver_id: result.rows[0] && result.rows[0].receiver_id,
            status: 4
        })
    }).catch(e => {
        console.log(e);
    })
})

app.get("/seeFR/:otherUserId", (req, res) => {
    console.log("req.params.otherUserId, req.session.user.id", req.params.otherUserId, req.session.user.id);
    seeFR(req.session.user.id, req.params.otherUserId).then(result => {
        console.log("seeFR result.rows", result.rows);
        res.json({
            success: true,
            sender_id: result.rows[0] && result.rows[0].sender_id,
            receiver_id: result.rows[0] && result.rows[0].receiver_id,
            status: result.rows[0] && result.rows[0].status
        })
    }).catch(e => {
        console.log(e);
    })
})

app.get("/listFR", (req, res) => {
    listFR(req.session.user.id).then(result => {
        console.log("listFR results.rows", result.rows);
        res.json({
            success: true,
            users: result.rows,
            loggedUser: req.session.user.id
        })
    }).catch(e => {
        console.log(e);
    })
})

app.get("/getUsersbyName", (req, res) => {
    getUsersbyName(req.body.name).then(result => {
        res.json({
            success: true,
            first: result.rows[0].first,
            last: result.rows[0].last,
            img: result.rows[0].img,
            id: result.rows[0].id
        })
    }).catch(e => {
        console.log(e);
    })
})

//FINAL ROUTE *!
app.get('*', function(req, res) {
    if (!req.session.user){
        res.redirect('/welcome')
    } else {
        res.sendFile(__dirname + '/index.html')
    }
});


//socket.io

let online = {};
let chat = [];

io.on('connection', function(socket) {

    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.user.id;
    const first = socket.request.session.user.first;
    const last = socket.request.session.user.last;
    const img = socket.request.session.user.img;
    console.log("socket.request.session.user", socket.request.session.user);


    //broadcast: everybody but connected user
    socket.broadcast.emit('userJoined', userId)

    online[socket.id] = userId;

    getUsersById(Object.values(online)).then(function(users) {
        console.log("socket getUsersById", users.rows);
        socket.emit('onlineUsers', users.rows)
        socket.on('chatMessage', (text) => {
            chat.push({
                id: userId,
                img,
                first,
                last,
                text
            })

            io.sockets.emit('chatMessage', {
                id: userId,
                img,
                first,
                last,
                text
            })
        })

        socket.emit('mostRecentTenMessages', chat)
    })

    socket.on('disconnect', function() {
        delete online[socket.id]
        //check if not in list, disconnect
        socket.emit('userLeft', userId)
    })
});


//LISTENING:
server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.");
});
