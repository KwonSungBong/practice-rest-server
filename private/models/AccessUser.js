import User from './User'
class AccessUser extends User{
    constructor({accessToken, idx, email, password, name, regDate, modDate})
    {
        super({idx:idx, email:email, password:password, name:name, regDate:regDate, modDate:modDate})
        this._accessToken_ = accessToken
    }
    get accessToken(){
        return this._accessToken_
    }
    set accessToken(accessToken){
        this._accessToken_ = accessToken
    }
}

exports.getInstance = function(param){
    let {accessToken, idx, email, password, name, regDate, modDate} = param
    return new AccessUser({accessToken:accessToken, idx:idx, email:email, password:password, name:name, regDate:regDate, modDate:modDate})
}