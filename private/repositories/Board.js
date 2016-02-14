import {userDao, boardDao, postDao, replyDao} from './define/defineSequelize'
import User from '../models/User'
import Board from '../models/Board'
import Post from '../models/Post'
import Pagination from '../models/Pagination'
import Reply from '../models/Reply'

exports.getBoards = function() {
    return boardDao.findAll({raw:true}).then(function(results) {
        const parseBoards = results.map(function (board) {
            return Board.getInstance(board)
        })
        return parseBoards
    }).catch(function(err){
        console.log(err)
    })
}

exports.getBoard = function(board){
    postDao.belongsTo(userDao, {foreignKey: 'user_idx', as: 'user'})
    userDao.belongsTo(postDao, {foreignKey: 'idx'})

    return boardDao.findOne({where:{idx:board.idx}}).then(function(boardReults) {
        const limit = Number(board.pagination.perPage)
        const offset = Number((board.pagination.page-1)*board.pagination.perPage)
        //board.searchCondition에 대한 처리는 없음
        return postDao.findAndCountAll({where:{board_idx:board.idx},limit: limit, offset: offset, include: [{model: userDao , as: 'user'}]}).then(function(postsReults) {
            const parseBoard = boardReults.dataValues
            const parsePosts = postsReults.rows.map(function (post) {
                post.dataValues.user = User.getInstance(post.dataValues.user.dataValues)
                return Post.getInstance(post.dataValues)
            })
            const instance = Board.getInstance({idx:parseBoard.idx, name:parseBoard.name
                , description:parseBoard.description, regDate:parseBoard.regDate
                , modDate:parseBoard.modDate,posts:parsePosts, searchCondition:board.searchCondition
                , pagination:Pagination.getInstance({page:board.pagination.page, perPage:board.pagination.perPage, totalCount:postsReults.count})})

            return instance
        }).catch(function(err){
            console.log(err)
        })
    })
    .catch(function(err){
        console.log(err)
    })
}

exports.insertPost = function(boardIdx, post) {
    return postDao.create({'subject':post.subject, 'content':post.content, 'boardIdx': boardIdx,'userIdx':post.user.idx}).then(function(results) {
        return results.idx
    }).catch(function(err){
        console.log(err)
    })
}

exports.getPost = function(post) {
    postDao.belongsTo(userDao, {foreignKey: 'user_idx', as: 'user'})
    userDao.belongsTo(postDao, {foreignKey: 'idx'})
    replyDao.belongsTo(userDao, {foreignKey: 'user_idx', as: 'user'})
    userDao.belongsTo(postDao, {foreignKey: 'idx'})

    return postDao.findOne({where:{idx:post.idx}, include: [{model: userDao , as: 'user'}]}).then(function(postReults) {
        const limit = Number(post.pagination.perPage)
        const offset = Number((post.pagination.page-1)*post.pagination.perPage)
        return replyDao.findAndCountAll({where:{post_idx:post.idx},limit: limit, offset: offset, include: [{model: userDao , as: 'user'}]}).then(function(repliesReults) {
            const parsePost = postReults.dataValues
            parsePost.user = postReults.dataValues.user.dataValues
            const parseReplies = repliesReults.rows.map(function (reply) {
                reply.dataValues.user = User.getInstance(reply.dataValues.user.dataValues)
                return Reply.getInstance(reply.dataValues)
            })
            const instance = Post.getInstance({idx:parsePost.idx, subject:parsePost.subject
                , content:parsePost.content, regDate:parsePost.regDate
                , modDate:parsePost.modDate, user:parsePost.user, replies:parseReplies
                , pagination:Pagination.getInstance({page:post.pagination.page, perPage:post.pagination.perPage, totalCount:parseReplies.count})})

            return instance
        }).catch(function(err){
            console.log(err)
        })
    })
    .catch(function(err){
        console.log(err)
    })
}

exports.updatePost = function(post) {
    return postDao.update({'subject':post.subject, 'content':post.content}, {where: {idx: post.idx}}).then(function(results){
        return post
    }).catch(function(err){
        console.log(err)
    })
}

exports.deletePost = function(post) {
    return postDao.destroy({where: {'idx':post.idx}}).then(function(results) {
        return post
    }).catch(function(err){
        console.log(err)
    })
}

exports.insertReply = function(postIdx, reply) {
    return replyDao.create({'content':reply.content, 'postIdx': postIdx,'userIdx':reply.user.idx}).then(function(results) {
        return results.idx
    }).catch(function(err){
        console.log(err)
    })
}

exports.updateReply = function(reply) {
    return replyDao.update({'content':reply.content}, {where: {idx: reply.idx}}).then(function(results){
        return reply
    }).catch(function(err){
        console.log(err)
    })
}

exports.deleteReply = function(reply) {
    return replyDao.destroy({where: {'idx':reply.idx}}).then(function(results) {
        return reply
    }).catch(function(err){
        console.log(err)
    })
}