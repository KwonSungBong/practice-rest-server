import express from 'express'
import passport from '../private/components/passport'

let router = express.Router()

// 페이스북, 카카오톡 로그인 후처리 방법에 대해서 고민.
router.get('/facebook', passport.passport.authenticate('facebook'))
router.get('/facebook/callback', passport.passport.authenticate('facebook'), function(req, res, next) {
    console.log("facebook/callback")
    res.json()
})


router.get('/kakao', passport.passport.authenticate('kakao'))
router.get('/kakao/callback', passport.passport.authenticate('kakao'), function(req, res, next) {
    console.log("kakao/callback")
    //res.json()
    res.send("state :" + req.query.state);
})

module.exports = router