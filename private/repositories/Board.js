import {userDao, boardDao, postDao, replyDao} from './define/defineSequelize'
import User from '../models/User'
import Board from '../models/Board'
import Post from '../models/Post'
import Pagination from '../models/Pagination'
import Reply from '../models/Reply'

exports.getBoards = function() {
    let boardPromise = boardDao.findAll({raw:true}).then(function(results) {
        return results
    }).catch(function(err){
        console.log(err)
    })
    return boardPromise
}

exports.getBoard = function(idx, pagination, searchCondition){
    postDao.belongsTo(userDao, {foreignKey: 'user_idx', as: 'user'})
    userDao.belongsTo(postDao, {foreignKey: 'idx'})
    let boardPromise = boardDao.findOne({where:{idx:idx}}).then(function(boardReults) {
        const limit = pagination.perPage
        const offset = (pagination.page-1)*pagination.perPage
        //searchCondition에 대한 처리는 없음
        return postDao.findAndCountAll({where:{board_idx:idx},limit: limit, offset: offset, include: [{model: userDao , as: 'user'}]}).then(function(postsReults) {
            const parseBoard = boardReults.dataValues
            const parsePosts = postsReults.rows.map(function (post) {
                post.dataValues.user = User.getInstance(post.dataValues.user.dataValues)
                return Post.getInstance(post.dataValues)
            })
            const instance = Board.getInstance({idx:parseBoard.idx, name:parseBoard.name
                , description:parseBoard.description, regDate:parseBoard.regDate
                , modDate:parseBoard.modDate,posts:parsePosts, searchCondition:searchCondition
                , pagination:Pagination.getInstance({page:pagination.page, perPage:pagination.perPage, totalCount:postsReults.count})})

            return instance
        }).catch(function(err){
            console.log(err)
        })
    })
    .catch(function(err){
        console.log(err)
    })

    return boardPromise
}

exports.getPosts = function() {
    let postPromise = userDao.findOne({where: {'email':email}}).then(function(results) {
        return results && results.dataValues
    }).catch(function(err){
        console.log(err)
    })
    return postPromise
}