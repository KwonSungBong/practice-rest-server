import userRepository from '../repositories/User'
import boardRepository from '../repositories/Board'

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

exports.login = function(email, password){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve({'email':email, 'password':password})
        })
    }

    const userSequence = function() {
        return new Promise(function (resolve, reject){
            let getUserPromise = userRepository.getUser(email)
            Promise.resolve(getUserPromise).then(function(results){
                resolve(results)
            })
        })
    }

    const statusSequence = function(prevResults){
        return new Promise(function (resolve, reject){
            const user = prevResults[1]
            if (user) {
                if (user.password === password) {
                    resolve('success')
                } else {
                    resolve('differentPassword')
                }
            } else {
                resolve('notExistEmail')
            }
        })
    }

    const accessTokenSequence = function(prevResults){
        return new Promise(function (resolve, reject){
            const user = prevResults[1]
            const status = prevResults[2]
            if(status === 'success'){
                const accessToken = userRepository.insertAccessUser(user)
                resolve(accessToken)
            } else {
                resolve('')
            }
        })
    }

    const finalSequence = sequencePromise([firstSequence, userSequence, statusSequence, accessTokenSequence],function(resolve,results){
        const user = results[1]
        const status = results[2]
        const accessToken = results[3]
        resolve({'status':status, 'data': {'accessToken': accessToken, 'user': user}})
    })

    return finalSequence
}

exports.logout = function(accessToken){

}

exports.checkDuplicationEmail = function(email){

}

exports.checkDuplicationName = function(name){

}

exports.signup = function(email, password, name){

}

exports.signout = function(user, email, password){

}

exports.editProfile = function(user, name){

}

exports.getBoards = function(){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getBoardsSequence = function() {
        return new Promise(function (resolve, reject){
            let getBoardsPromise = boardRepository.getBoards()
            Promise.resolve(getBoardsPromise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, getBoardsSequence],function(resolve,results){
        const status = 'success'
        const boards = results[1]
        resolve({'status':status, 'data': {'boards': boards}})
    })

    return finalSequence
}
exports.getBoard = function(idx, pagination, searchCondition){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getBoardSequence = function() {
        return new Promise(function (resolve, reject){
            let getBoardPromise = boardRepository.getBoard(idx, pagination, searchCondition)
            Promise.resolve(getBoardPromise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, getBoardSequence],function(resolve,results){
        const status = 'success'
        const board = results[1]
        resolve({'status':status, 'data': {'board': board}})
    })

    return finalSequence
}
exports.getPosts = function(){

}
exports.getPost = function(){

}
exports.updatePost = function(){

}
exports.deletePost = function(){

}
exports.getReplies = function(){

}
exports.getReply = function(){

}
exports.updateReply = function(){

}
exports.deleteReply = function(){

}