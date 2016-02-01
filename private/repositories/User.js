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

    //업데이트문작성
    /*return userDao.findOne({where: {'email':email}}).then(function(results) {
        return results && User.getInstance(results.dataValues)
    })
    .then(function(results){
        return User.getInstance(results)
    })
    .catch(function(err){
        console.log(err)
    })*/
}

exports.getAccessUser = function(accessToken){
    return sessionDao.hgetall(accessToken).then(function(results){
        return User.getInstance(results)
    }).catch(function(err){
        console.log(err)
    })
}

exports.insertUser = function(user){
    return userDao.create({'email':user.email, 'password':user.password, 'name':user.name}).then(function(results) {
        return true
    }).catch(function(err){
        console.log(err)
    })
}

exports.updateUser = function(user){

}

exports.getUser = function(email){
    return userDao.findOne({where: {'email':email}}).then(function(results) {
        return results && User.getInstance(results.dataValues)
    })
    .then(function(results){
        return User.getInstance(results)
    })
    .catch(function(err){
        console.log(err)
    })
}

exports.searchUser = function(searchItems){
    return userDao.findOne({where: {'email':'gsdfg'}}).then(function(results) {
        return results && results.dataValues
    }).catch(function(err){
        console.log(err)
    })
}