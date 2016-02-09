import {userDao} from './define/defineSequelize'
import {sessionDao} from './define/defineSession'
import User from '../models/User'
import AccessUser from '../models/AccessUser'
import auth from '../components/auth'
import util from 'util'

const tokenKey = "tokens:%s"

exports.insertAccessUser = function(user){
    const accessToken = auth.signToken(user.idx)
    sessionDao.hmset(util.format(tokenKey, accessToken), {
        'accessToken': accessToken,
        'idx': user.idx,
        'email': user.email,
        'name': user.name
    })
    return accessToken
}

exports.updateAccessUser = function(accessUser){
    return sessionDao.hmset(util.format(tokenKey, accessUser.accessToken), 'email', accessUser.email, 'name', accessUser.name).then(function(results){
        return accessUser
    }).catch(function(err){
        console.log(err)
    })
}

exports.getAccessUser = function(accessToken){
    return sessionDao.hgetall(util.format(tokenKey, accessToken)).then(function(results){
        return AccessUser.getInstance({idx:results.idx,email:results.email,password:results.password,name:results.name,accessToken:accessToken})
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

exports.getUserByIdx = function(idx){
    return userDao.findOne({where: {'idx':idx}}).then(function(results) {
        return results && User.getInstance(results.dataValues)
    })
    .catch(function(err){
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