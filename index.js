const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const cors = require('cors')
const jwtCheck = require('express-jwt')
const jwt = require('jsonwebtoken')
const _PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: process.env.WS_PORT })

let peers = {}
wss.on('connection', function connection(ws) {

    ws.on('message', function (m) {
        let message = {}
        try {
            message = JSON.parse(m)
            switch (message.channel) {
                case 'authentication': {
                    var decoded = jwt.verify(message.data, _PRIVATE_KEY)
                    if (decoded) {
                        peers[decoded.id] = ws
                    }
                } break;
            }
        } catch (e) {
            console.log(e)
        }
    });
});

const MongoClient = mongodb.MongoClient

const app = express()
app.use(bodyParser.json());
app.use(cors())
app.use(jwtCheck({ secret: _PRIVATE_KEY }).unless({
    path: [
        '/services/login',
        '/services/register',
        '/users/login',
        '/users/register',
    ]
}));



MongoClient.connect(`mongodb://${process.env.MONGO_URL}`, function (err, client) {
    if (err) {
        process.kill()
    }
    const db = client.db(process.env.MONGO_DB)

    require('./routes/services')({ db, app, _PRIVATE_KEY })
    require('./routes/users')({ db, app, _PRIVATE_KEY })
    require('./routes/push')({ db, app, _PRIVATE_KEY, peers })

    app.listen(process.env.HTTP_PORT)
})