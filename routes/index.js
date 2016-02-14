import express from 'express'
import auth from '../private/components/auth'
import service from '../private/services/index'
import User from '../private/models/User'
import Post from '../private/models/Post'
import Reply from '../private/models/Reply'
import Board from '../private/models/Board'
import AccessUser from '../private/models/AccessUser'
import Pagination from '../private/models/Pagination'
import SearchCondition from '../private/models/SearchCondition'

let router = express.Router()

function sequencePromise(sequencePromiseList, finalPromise){
  return new Promise(function(resolve, reject) {
    let pushValue = null
    function sequenceTasks(tasks){
      function recordValue(results, value){
        results.push(value)
        return results;
      }
      pushValue = recordValue.bind(null, [])
      return tasks.reduce(function(promise, task){
        return promise.then(task).then(pushValue)
      }, Promise.resolve())
    }

    const sequencePromise = sequenceTasks(sequencePromiseList);
    sequencePromise.then(function(results){
      finalPromise(resolve, results)
    })
  })
}

router.get('/', function(req, res, next) {
  res.render('index', {});
})

router.get('/duplicate/user/email/:userEmail', function(req, res, next) {
  const userEmail = req.params.userEmail

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      resolve({'req':req, 'res':res})
    })
  }

  const duplicateUserEmailSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      let promise  = service.duplicateUserEmail(userEmail)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,duplicateUserEmailSequence],function(resolve,results){
    const param = results[0]
    const duplicateUserEmailResult = results[1]
    if(duplicateUserEmailResult.status === 'notExist'){
      param.res.status(200).json({"duplicateState":true, "message":'존재하지 않는 이메일입니다.'})
    }else if(duplicateUserEmailResult.status === 'exist'){
      param.res.status(202).json({"duplicateState":false, 'message':'이미 존재하는 이메일입니다.'})
    }
  })
})

router.get('/duplicate/user/name/:userName', function(req, res, next) {
  const userName = req.params.userName

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      resolve({'req':req, 'res':res})
    })
  }

  const duplicateUserNameSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      let promise = service.duplicateUserName(userName)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,duplicateUserNameSequence],function(resolve,results){
    const param = results[0]
    const duplicateUserNameResult = results[1]
    if(duplicateUserNameResult.status === 'notExist'){
      param.res.status(200).json({"duplicateState":true, "message":'존재하지 않는 이름입니다.'})
    }else if(duplicateUserNameResult.status === 'exist'){
      param.res.status(200).json({"duplicateState":false, 'message':'이미 존재하는 이름입니다.'})
    }
  })
})

router.post('/signUp', function(req, res, next) {
  const userEmail = req.body.userEmail
  const userPassword = req.body.userPassword
  const userName = req.body.userName

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const user = User.getInstance({email:userEmail,password:userPassword,name:userName})
      resolve({'req':req, 'res':res, 'user':user})
    })
  }

  const signUpSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const user = prevResults[0].user
      let promise = service.signUp(user)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,signUpSequence],function(resolve,results){
    const param = results[0]
    const signUpResult = results[1]
    if(signUpResult.status === 'success'){
      param.res.status(200).json()
    }else {
      param.res.status(202).json()
    }
  })
})

router.put('/editProfile', auth.isAuthenticated(), function(req, res, next){
  const userEmail = req.body.userEmail
  const userPassword = req.body.userPassword
  const userName = req.body.userName

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const accessUser = req.accessUser
      const updateUserInfo = AccessUser.getInstance({email:userEmail, password:userPassword, name:userName})
      resolve({req:req, res:res, accessUser:accessUser, updateUserInfo:updateUserInfo})
    })
  }

  const editProfileSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const accessUser = prevResults[0].accessUser
      const updateUserInfo = prevResults[0].updateUserInfo
      let promise = service.editProfile(accessUser,updateUserInfo)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,editProfileSequence],function(resolve,results){
    const param = results[0]
    const editAccessUserResult = results[1]
    if(editAccessUserResult.status === 'success'){
      param.res.status(200).json()
    }else {
      param.res.status(202).json()
    }
  })
})

router.post('/signIn', function(req, res, next) {
  const userEmail = req.body.userEmail
  const userPassword = req.body.userPassword

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      resolve({req:req, res:res})
    })
  }

  const signInSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      let promise = service.signIn(userEmail, userPassword)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,signInSequence],function(resolve,results){
    const param = results[0]
    const signInResult = results[1]

    if(signInResult.status === 'success'){
      param.res.status(200).json({accessToken:signInResult.data.accessToken,user:signInResult.data.user})
    }else if(signInResult.status === 'differentPassword'){
      param.res.status(202).json({message:'비밀번호가 틀렸습니다.'})
    }else if(signInResult.status === 'notExistEmail'){
      param.res.status(202).json({message:'해당 이메일은 등록되어있지 않습니다.'})
    }
  })
})

router.post('/signOut', auth.isAuthenticated(), function(req, res, next) {
  res.status(200).json()
})

router.get('/boards', auth.isAuthenticated(), function(req, res, next){
  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      resolve({'req':req, 'res':res})
    })
  }

  const getBoardsSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      let promise = service.getBoards()
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,getBoardsSequence],function(resolve,results){
    const param = results[0]
    const boardsResults = results[1]
    param.res.status(200).json({"boards":boardsResults.data.boards})
  })
})

router.get('/board/:boardIdx', auth.isAuthenticated(), function(req, res, next){
  const boardIdx = req.params.boardIdx
  const page = req.query.page || 1
  const perPage = req.query.perPage || 2
  const searchName = req.query.searchName
  const searchValue = req.query.searchValue

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const pagination = Pagination.getInstance({page:page,perPage:perPage})
      const searchCondition = SearchCondition.getInstance({name:searchName, value:searchValue})
      const board = Board.getInstance({idx:boardIdx, pagination:pagination, searchCondition:searchCondition})
      resolve({req:req, res:res, board:board})
    })
  }

  const getBoardSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const board = prevResults[0].board
      let promise = service.getBoard(board)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,getBoardSequence],function(resolve,results){
    const param = results[0]
    const boardResults = results[1]
    param.res.status(200).json({"board":boardResults.data.board})
  })
})

router.post('/board/:boardIdx/post', auth.isAuthenticated(), function(req, res, next){
  const accessToken = req.accessToken
  const boardIdx = req.params.boardIdx
  const postSubject = req.body.postSubject
  const postContent = req.body.postContent

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const accessUser = AccessUser.getInstance({accessToken:accessToken})
      const post = Post.getInstance({subject:postSubject, content:postContent, user:accessUser})
      resolve({req:req, res:res, post:post})
    })
  }

  const insertPostSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const post = prevResults[0].post
      let promise = service.insertPost(boardIdx,post)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,insertPostSequence],function(resolve,results){
    const param = results[0]
    const postResult = results[1]
    param.res.status(200).json({})
  })
})

router.get('/board/post/:postIdx', auth.isAuthenticated(), function(req, res, next){
  const postIdx = req.params.postIdx
  const page = req.query.page || 1
  const perPage = req.query.perPage || 2

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const pagination = Pagination.getInstance({page:page, perPage:perPage})
      const post = Post.getInstance({idx:postIdx, pagination:pagination})
      resolve({req:req, res:res, post:post})
    })
  }

  const getPostSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const post = prevResults[0].post
      let promise = service.getPost(post)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,getPostSequence],function(resolve,results){
    const param = results[0]
    const postResults = results[1]

    param.res.status(200).json({"post":postResults.data.post})
  })
})

router.put('/board/post/:postIdx', auth.isAuthenticated(), function(req, res, next){
  const accessToken = req.accessToken
  const postIdx = req.params.postIdx
  const postSubject = req.body.postSubject
  const postContent = req.body.postContent

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const accessUser = AccessUser.getInstance({accessToken:accessToken})
      const post = Post.getInstance({idx:postIdx, subject:postSubject, content:postContent, user:accessUser})
      resolve({req:req, res:res, post:post})
    })
  }

  const updatePostSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const post = prevResults[0].post
      let promise = service.updatePost(post)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,updatePostSequence],function(resolve,results){
    const param = results[0]
    const postResult = results[1]
    param.res.status(200).json({})
  })
})

router.delete('/board/post/:postIdx', auth.isAuthenticated(), function(req, res, next){
  const accessToken = req.accessToken
  const postIdx = req.params.postIdx

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const accessUser = AccessUser.getInstance({accessToken:accessToken})
      const post = Post.getInstance({idx:postIdx, user:accessUser})
      resolve({req:req, res:res, post:post})
    })
  }

  const deletePostSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const post = prevResults[0].post
      let promise = service.deletePost(post)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,deletePostSequence],function(resolve,results){
    const param = results[0]
    const postResult = results[1]
    param.res.status(200).json({})
  })
})

router.post('/board/post/:postIdx/reply', auth.isAuthenticated(), function(req, res, next){
  const accessToken = req.accessToken
  const postIdx = req.params.postIdx
  const replyContent = req.body.replyContent

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const accessUser = AccessUser.getInstance({accessToken:accessToken})
      const reply = Reply.getInstance({content:replyContent, user:accessUser})
      resolve({req:req, res:res, reply:reply})
    })
  }

  const insertReplySequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const reply = prevResults[0].reply
      let promise = service.insertReply(postIdx, reply)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,insertReplySequence],function(resolve,results){
    const param = results[0]
    const replyResult = results[1]
    param.res.status(200).json({})
  })
})

router.put('/board/post/reply/:replyIdx', auth.isAuthenticated(), function(req, res, next){
  const accessToken = req.accessToken
  const replyIdx = req.params.replyIdx
  const replyContent = req.body.replyContent

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const accessUser = AccessUser.getInstance({accessToken:accessToken})
      const reply = Reply.getInstance({idx:replyIdx, content:replyContent, user:accessUser})
      resolve({req:req, res:res, reply:reply})
    })
  }

  const updateReplySequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const reply = prevResults[0].reply
      let promise = service.updateReply(reply)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,updateReplySequence],function(resolve,results){
    const param = results[0]
    const replyResult = results[1]
    param.res.status(200).json({})
  })
})

router.delete('/board/post/reply/:replyIdx', auth.isAuthenticated(), function(req, res, next){
  const accessToken = req.accessToken
  const replyIdx = req.params.replyIdx

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      const accessUser = AccessUser.getInstance({accessToken:accessToken})
      const reply = Reply.getInstance({idx:replyIdx, user:accessUser})
      resolve({req:req, res:res, reply:reply})
    })
  }

  const deleteReplySequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const reply = prevResults[0].reply
      let promise = service.deleteReply(reply)
      Promise.resolve(promise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,deleteReplySequence],function(resolve,results){
    const param = results[0]
    const replyResult = results[1]
    param.res.status(200).json({})
  })
})

module.exports = router