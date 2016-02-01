import express from 'express';
import service from '../private/services/index'
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

router.get('/checkDuplicationEmail', function(req, res, next) {
  const email = "ksb"
})

router.get('/checkDuplicationName', function(req, res, next) {
  const name = "ksb"
})

router.post('/signup', function(req, res, next) {
  const email = ""
  const password = ""
  const name = ""
})

router.put('/editProfile', function(req, res, next){
  const accessToken = req.accessToken
  const name = ""
})

router.delete('/signout', function(req, res, next) {
  const accessToken = req.accessToken
  const email = ""
  const password = ""
})


router.post('/login', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const firstSequence = function(){
    return new Promise(function (resolve, reject){

      //밸리데이터 및 객체화 가능한 데이터는 객체화 진행

      resolve({'req':req, 'res':res, 'next':next})
    })
  }

  const loginSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      let loginPromise = service.login(email,password)
      Promise.resolve(loginPromise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,loginSequence],function(resolve,results){
    const param = results[0]
    const loginResult = results[1]
    if(loginResult.status === 'success'){
      param.res.header('access-token', loginResult.data.accessToken)
      param.res.status(200).json({"user":loginResult.data.user})
    }else if(loginResult.status === 'differentPassword'){
      param.res.status(202).json({'message':'비밀번호가 틀렸습니다.'})
    }else if(loginResult.status === 'notExistEmail'){
      param.res.status(202).json({'message':'해당 이메일은 존재하지 않습니다.'})
    }
  })
})

router.post('/logout', function(req, res, next) {
  const accessToken = req.accessToken
})

router.get('/boards', function(req, res, next){
  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      //밸리데이터 및 객체화 가능한 데이터는 객체화 진행
      resolve({'req':req, 'res':res, 'next':next})
    })
  }

  const getBoardsSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      let getBoardsPromise = service.getBoards()
      Promise.resolve(getBoardsPromise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,getBoardsSequence],function(resolve,results){
    const param = results[0]
    const boards = results[1]
    console.log(boards)
    param.res.status(200).json({})
  })
})

router.get('/board/:idx', function(req, res, next){
  const idx = req.params.idx
  const page = req.query.page || 1
  const perPage = req.query.perPage || 2
  const searchName = req.query.searchName
  const searchValue = req.query.searchValue

  const firstSequence = function(){
    return new Promise(function (resolve, reject){
      //밸리데이터 및 객체화 가능한 데이터는 객체화 진행
      const pagination = Pagination.getInstance({page:page,perPage:perPage})
      const searchCondition = SearchCondition.getInstance({name:searchName,value:searchValue})

      resolve({req:req, res:res, pagination:pagination, searchCondition:searchCondition})
    })
  }

  const getBoardSequence = function(prevResults) {
    return new Promise(function (resolve, reject){
      const pagination = prevResults[0].pagination
      const searchCondition = prevResults[0].searchCondition
      let getBoardsPromise = service.getBoard(idx, pagination, searchCondition)
      Promise.resolve(getBoardsPromise).then(function(results){
        resolve(results)
      })
    })
  }

  const finalSequence = sequencePromise([firstSequence,getBoardSequence],function(resolve,results){
    const param = results[0]
    const getBoardResult = results[1]

    //console.log(getBoardResult.data.board.posts)
    param.res.status(200).json({})
  })
})

router.get('/board/:Idx/post/:idx', function(req, res, next){

})

router.post('/board/:idx/post', function(req, res, next){

})

router.put('/board/:idx/post:idx', function(req, res, next){

})

router.delete('/board/:idx/post:idx', function(req, res, next){

})

router.get('/board/:idx/post:idx/replies', function(req, res, next){

})

router.get('/board/:idx/post:idx/reply/:idx', function(req, res, next){

})

router.post('/board/:idx/post:idx/reply', function(req, res, next){

})

router.put('/board/:idx/post:idx/reply/:idx', function(req, res, next){

})

router.delete('/board/:idx/post:idx/reply/:idx', function(req, res, next){

})

module.exports = router