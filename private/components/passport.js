var passport = require('passport'),
    facebook = require('passport-facebook').Strategy,
    kakao = require('passport-kakao').Strategy,
    local = require('passport-local').Strategy;

passport.use(new facebook({
        clientID: "947364928657500",
        clientSecret: "064dff91442a5da607d337df43748e9d",
        callbackURL: "/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done){
        console.log(profile._json)
        done(null, profile);
    }
));

passport.use(new kakao({
        clientID: '5d75a4388972e1b104df7e4aa0e5da17',
        callbackURL : '/kakao/callback'
    },
    function(accessToken, refreshToken, profile, done){
        console.log(profile)
        done(null, profile);
    }
))

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


exports.passport = passport;
