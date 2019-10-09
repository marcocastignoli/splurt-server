const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')

module.exports = ({ db, app, _PRIVATE_KEY }) => {
    app.delete('/users/my', function (req, res) {
        if (req.user.type === 'user') {
            db.collection('users').deleteOne({ _id: new mongodb.ObjectID(req.user.id) });
            return res.send('ok')
        } else {
            return res.send('You are not a user')
        }
    })

    app.put('/users/my', function (req, res) {
        if (req.user.type === 'user') {
            if (req.body.name) {
                db.collection('users').updateOne({ _id: new mongodb.ObjectID(req.user.id) }, {
                    $set: {
                        pwd: req.body.pwd
                    }
                })
                return res.send('ok')
            } else {
                return res.send('err: passami il parametro name nel body')
            }
        } else {
            return res.send('You are not a user')
        }
    })

    app.post('/users/register', function (req, res) {
        if (req.body.name) {
            db.collection('users').insert({
                name: req.body.name,
                pwd: req.body.pwd
            })
            return res.send('ok')
        } else {
            return res.send('err: passami il parametro name nel body')
        }
    })

    app.post('/users/login', (req, res) => {
        if (req.body.name && req.body.pwd) {
            db.collection('users').findOne({
                name: req.body.name,
                pwd: req.body.pwd,
            }, (err, result) => {
                if (err || !result) {
                    return res.send('pwd sbagliata')
                }
                const token = jwt.sign({ name: result.name, id: result._id, type: 'user' }, _PRIVATE_KEY);
                return res.send(JSON.stringify({
                    data: { name: result.name, id: result._id, type: 'user' },
                    token
                }))
            });
        } else {
            return res.send('err: inviami name e pwd')
        }
    })

    app.get('/users/available_services', function (req, res) {
        if (req.user.type === 'user') {
            db.collection('services').find({}, { fields: { pwd: 0 } }).toArray((err, services) => {
                if (err) {
                    throw err;
                }
                db.collection('users').findOne({ _id: new mongodb.ObjectID(req.user.id) }, async (err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        services.forEach(element => {
                            for (let s_i in user.services) {
                                let s = user.services[s_i].toString()
                                if (s === element._id.toString()) {
                                    element.active = true
                                    break;
                                } else {
                                    element.active = false
                                }
                            }
                        });
                        return res.send(services)
                    } else {
                        res.send('cannot find user')
                    }
                });
            });
        } else {
            return res.send('You are not a user')
        }
    })

    app.put('/users/service/:service', function (req, res) {
        if (req.user.type === 'user') {
            db.collection('users').updateOne({ _id: new mongodb.ObjectID(req.user.id) }, {
                $addToSet: {
                    services: new mongodb.ObjectID(req.params.service)
                }
            })
            return res.send('ok')
        } else {
            return res.send('You are not a user')
        }
    })

    app.delete('/users/service/:service', function (req, res) {
        if (req.user.type === 'user') {
            db.collection('users').updateOne({ _id: new mongodb.ObjectID(req.user.id) }, {
                $pull: {
                    services: new mongodb.ObjectID(req.params.service)
                }
            })
            return res.send('ok')
        } else {
            return res.send('You are not a user')
        }
    })
}