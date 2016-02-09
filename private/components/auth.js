import userRepository from '../repositories/User'
import jwt from 'jsonwebtoken'
import compose from 'composable-middleware'
const SECRET = 'token_secret'

function signToken(id) {
    return jwt.sign({id: id}, SECRET)
}

function isAuthenticated() {
    return compose()
    .use(function(req, res, next) {
        const accessToken = req.headers['authorization'].replace('Bearer ', '')

        try {
            const decoded = jwt.verify(accessToken, SECRET)
            Promise.resolve(userRepository.getAccessUser(accessToken)).then(function(results){
                req.accessUser = results
                next()
            })
        } catch(err) {
            console.log(err)
        }
    })
}

exports.signToken = signToken
exports.isAuthenticated = isAuthenticated
