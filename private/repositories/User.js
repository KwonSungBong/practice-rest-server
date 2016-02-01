import {userDao} from './define/defineSequelize'
import {sessionDao} from './define/defineSession'
import User from '../models/User'
import crypto from "crypto"

exports.insertAccessUser = function(user){
    let md5sum = crypto.createHash('md5')
    md5sum.update(user.email)
    const accessToken = md5sum.digest('hex')
    sessionDao.hmset(accessToken,'idx', user.idx, 'email', user.email, 'name', user.name, 'regDate', user.regDate, 'modDate', user.modDate)
    return accessToken
}

exports.updateAccessUser = function(accessToken, user){
    sessionDao.hmset(accessToken,'idx', user.idx, 'email', user.email, 'name', user.name, 'regDate', user.regDate, 'modDate', user.modDate)
}

exports.getAccessUser = function(accessToken){
    let storePromise = sessionDao.hgetall(accessToken).then(function(results){
        return User.getInstance(results)
    }).catch(function(err){
        console.log(err)
    })
    return storePromise
}

exports.insertUser = function(email, password, name){
    let userPromise = userDao.create({'email':email, 'password':password, 'name':name}).then(function(results) {
        return results && results.dataValues
    }).catch(function(err){
        console.log(err)
    })
    return userPromise
}

exports.updateUser = function(user){

}

exports.getUser = function(email){
    let userPromise = userDao.findOne({where: {'email':email}}).then(function(results) {
        return results && User.getInstance(results.dataValues)
    })
    .then(function(results){
        return User.getInstance(results)
    })
    .catch(function(err){
        console.log(err)
    })
    return userPromise
}

exports.searchUser = function(searchItems){
    let userPromise = userDao.findOne({where: {'email':'gsdfg'}}).then(function(results) {
        return results && results.dataValues
    }).catch(function(err){
        console.log(err)
    })
    return userPromise
}