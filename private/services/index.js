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

exports.duplicateUserEmail = function(userEmail){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getUserByEmailSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.getUserByEmail(userEmail)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const statusSequence = function(prevResults){
        return new Promise(function (resolve, reject){
            const user = prevResults[1]
            if (user) {
                resolve('exist')
            } else {
                resolve('notExist')
            }
        })
    }

    const finalSequence = sequencePromise([firstSequence, getUserByEmailSequence, statusSequence],function(resolve, results){
        const status = results[2]
        resolve({'status':status})
    })

    return finalSequence
}

exports.duplicateUserName = function(userName){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getUserByNameSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.getUserByName(userName)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const statusSequence = function(prevResults){
        return new Promise(function (resolve, reject){
            const user = prevResults[1]
            if (user) {
                resolve('exist')
            } else {
                resolve('notExist')
            }
        })
    }

    const finalSequence = sequencePromise([firstSequence, getUserByNameSequence, statusSequence],function(resolve, results){
        const status = results[2]
        resolve({'status':status})
    })

    return finalSequence
}

exports.signUp = function(user){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const signUpSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.insertUser(user)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, signUpSequence],function(resolve, results){
        const status = 'success'
        resolve({'status':status})
    })

    return finalSequence
}

exports.signIn = function(email, password){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const userSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.getUserByEmail(email)
            Promise.resolve(promise).then(function(results){
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

exports.signOut = function(accessToken){

}


exports.updateAccessUser = function(accessUser, updateUserInfo){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const updateAccessUserSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            updateUserInfo.accessToken = accessUser.accessToken
            let promise = userRepository.updateAccessUser(updateUserInfo)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const updateUserSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.updateUser(updateUserInfo)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, updateAccessUserSequence, updateUserSequence],function(resolve, results){
        const status = 'success'
        resolve({'status':status})
    })

    return finalSequence
}

exports.getBoards = function(){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getBoardsSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.getBoards()
            Promise.resolve(promise).then(function(results){
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
exports.getBoard = function(board){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getBoardSequence = function() {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.getBoard(board)
            Promise.resolve(promise).then(function(results){
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
exports.getPost = function(post){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getPostSequence = function() {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.getPost(post)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, getPostSequence],function(resolve,results){
        const status = 'success'
        const post = results[1]

        resolve({'status':status, 'data': {'post': post}})
    })

    return finalSequence
}

exports.insertPost = function(boardIdx, post){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getAccessUserSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.getAccessUser(post.user.accessToken)
            Promise.resolve(promise).then(function(results){
                post.user = results
                resolve(results)
            })
        })
    }

    const insertPostSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.insertPost(boardIdx, post)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, getAccessUserSequence, insertPostSequence],function(resolve, results){
        const status = 'success'
        const post = results[2]
        console.log(results)
        resolve({'status':status, 'data': {'post': post}})
    })

    return finalSequence
}
exports.updatePost = function(post){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getAccessUserSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.getAccessUser(post.user.accessToken)
            Promise.resolve(promise).then(function(results){
                post.user = results
                resolve(results)
            })
        })
    }

    const updatePostSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.updatePost(post)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, getAccessUserSequence, updatePostSequence],function(resolve, results){
        const status = 'success'
        resolve({'status':status})
    })

    return finalSequence
}
exports.deletePost = function(post){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const deletePostSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.deletePost(post)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, deletePostSequence],function(resolve, results){
        const status = 'success'
        resolve({'status':status})
    })

    return finalSequence
}
exports.insertReply = function(postIdx, reply){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getAccessUserSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.getAccessUser(reply.user.accessToken)
            Promise.resolve(promise).then(function(results){
                reply.user = results
                resolve(results)
            })
        })
    }

    const insertReplySequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.insertReply(postIdx, reply)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, getAccessUserSequence, insertReplySequence],function(resolve, results){
        const status = 'success'
        resolve({'status':status})
    })

    return finalSequence
}
exports.updateReply = function(reply){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const getAccessUserSequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = userRepository.getAccessUser(post.user.accessToken)
            Promise.resolve(promise).then(function(results){
                reply.user = results
                resolve(results)
            })
        })
    }

    const updateReplySequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.updateReply(reply)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, getAccessUserSequence, updateReplySequence],function(resolve, results){
        const status = 'success'
        resolve({'status':status})
    })

    return finalSequence
}
exports.deleteReply = function(reply){
    const firstSequence = function(){
        return new Promise(function (resolve, reject){
            resolve()
        })
    }

    const deleteReplySequence = function(prevResults) {
        return new Promise(function (resolve, reject){
            let promise = boardRepository.deleteReply(reply)
            Promise.resolve(promise).then(function(results){
                resolve(results)
            })
        })
    }

    const finalSequence = sequencePromise([firstSequence, deleteReplySequence],function(resolve, results){
        const status = 'success'
        resolve({'status':status})
    })

    return finalSequence
}