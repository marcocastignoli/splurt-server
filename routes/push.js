const jwt = require('jsonwebtoken')
const mongodb = require('mongodb');

module.exports = ({db, app, _PRIVATE_KEY, peers}) => {

    app.post('/push/:user', function (req, res) {
        if (req.user.type === 'service') {
            const user = req.params.user
            db.collection('users').findOne({
                _id: new mongodb.ObjectID(user),
                services: new mongodb.ObjectID(req.user.id),
            }, (err, result) => {
                if (err || !result) {
                    return res.send('servizio non autorizzato')
                }
                if (req.body.title) {
                    if (peers[user]) {
                        peers[user].send(JSON.stringify({
                            service: req.user.name,
                            title: req.body.title
                        }))
                        return res.send('sent')
                    } else {
                        return res.send('utente non esistente')
                    }
                } else {
                    return res.send('err: passami il parametro title nel body')
                }
            })
        } else {
            return res.send('solo se sei un servizio, no utenti')
        }
    })

}