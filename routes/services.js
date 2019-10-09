const jwt = require('jsonwebtoken')
const mongodb = require('mongodb')

module.exports = ({db, app, _PRIVATE_KEY}) => {

    app.delete('/services/my', function (req, res) {
        if (req.user.type==='service') {
            db.collection('services').deleteOne({_id: new mongodb.ObjectID(req.user.id)});
            return res.send('ok')
        } else {
            return res.send('You are not a service')
        }
    })

    app.put('/services/my', function (req, res) {
        if (req.user.type==='service') {
            if (req.body.pwd) {
                db.collection('services').updateOne({_id: new mongodb.ObjectID(req.user.id)}, { 
                    $set: {
                        pwd: req.body.pwd
                    }
                })
                return res.send('ok')
            } else {
                return res.send('err: passami il parametro pwd nel body')
            }
        } else {
            return res.send('You are not a service')
        }
    })

    app.post('/services/register', function (req, res) {
        if (req.body.name) {
            db.collection('services').insert({
                name: req.body.name,
                pwd: req.body.pwd
            })
            return res.send('ok')
        } else {
            return res.send('err: passami il parametro name nel body')
        }
    })

    app.post('/services/login', (req,res) => {
        if (req.body.name && req.body.pwd) {
            db.collection('services').findOne({
                name: req.body.name,
                pwd: req.body.pwd,
            }, (err, result) => {
                if (err || !result) {
                    return res.send('pwd sbagliata')
                }
                const token = jwt.sign({ name: result.name, id: result._id, type: 'service' }, _PRIVATE_KEY);
                return res.send(token)
            });
        } else {
            return res.send('err: inviami name e pwd')
        }
    })
}