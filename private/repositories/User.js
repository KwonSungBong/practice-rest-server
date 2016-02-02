import {userDao} from './define/defineSequelize'
import {sessionDao} from './define/defineSession'
import User from '../models/User'
import AccessUser from '../models/AccessUser'
import crypto from "crypto"

exports.insertAccessUser = function(user){
    let md5sum = crypto.createHash('md5')
    md5sum.update(user.email)
    const accessToken = md5sum.digest('hex')
    sessionDao.hmset(accessToken,'idx', user.idx, 'email', user.email, 'name', user.name, 'regDate', user.regDate, 'modDate', user.modDate)
    return accessToken
}

exports.updateAccessUser = function(accessUser){
    return sessionDao.hmset(accessUser.accessToken,'idx', accessUser.idx, 'email', accessUser.email, 'name', accessUser.name, 'regDate', accessUser.regDate, 'modDate', accessUser.modDate).then(function(results){
        return accessUser
    }).catch(function(err){
        console.log(err)
    })
}

exports.getAccessUser = function(accessToken){
    return sessionDao.hgetall(accessToken).then(function(results){
        return AccessUser.getInstance({idx:results.idx,email:results.email,password:results.password,name:results.name,regDate:results.regDate,modDate:results.modDate,accessToken:accessToken})
    }).catch(function(err){
        console.log(err)
    })
}

exports.insertUser = function(user){
    return userDao.create({'email':user.email, 'password':user.password, 'name':user.name}).then(function(results) {
        return results && User.getInstance(results.dataValues)
    }).catch(function(err){
        console.log(err)
    })
}

exports.updateUser = function(user){
    return userDao.update({'email':user.email, 'password':user.password, 'name':user.name}, {where: {idx: user.idx}}).then(function(results){
        return user
    }).catch(function(err){
        console.log(err)
    })
}

exports.getUserByEmail = function(email){
    return userDao.findOne({where: {'email':email}}).then(function(results) {
        return results && User.getInstance(results.dataValues)
    })
    .catch(function(err){
        console.log(err)
    })
}

exports.getUserByName = function(name){
    return userDao.findOne({where: {'name':name}}).then(function(results) {
        return results && User.getInstance(results.dataValues)
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