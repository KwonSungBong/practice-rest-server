import {userDao, boardDao, postDao, replyDao} from './define/defineSequelize'
import User from '../models/User'
import Board from '../models/Board'
import Post from '../models/Post'
import Pagination from '../models/Pagination'
import Reply from '../models/Reply'

exports.getBoards = function() {
    return boardDao.findAll({raw:true}).then(function(results) {
        return results
    }).catch(function(err){
        console.log(err)
    })
}

exports.getBoard = function(board){
    postDao.belongsTo(userDao, {foreignKey: 'user_idx', as: 'user'})
    userDao.belongsTo(postDao, {foreignKey: 'idx'})

    return boardDao.findOne({where:{idx:board.idx}}).then(function(boardReults) {
        const limit = board.pagination.perPage
        const offset = (board.pagination.page-1)*board.pagination.perPage
        //board.searchCondition에 대한 처리는 없음
        return postDao.findAndCountAll({where:{board_idx:board.idx},limit: limit, offset: offset, include: [{model: userDao , as: 'user'}]}).then(function(postsReults) {
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
}

exports.getPosts = function() {
    return userDao.findOne({where: {'email':email}}).then(function(results) {
        return results && results.dataValues
    }).catch(function(err){
        console.log(err)
    })
}