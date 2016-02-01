class Reply{
    constructor({idx, content, regDate, modDate, user}){
        this._idx_ = idx
        this._content_ = content
        this._regDate_ = regDate
        this._modDate_ = modDate
        this._user_ = user
    }
}

exports.getInstance = function(param){
    let {idx, content, regDate, modDate, user} = param
    return new Reply({idx:idx, content:content, regDate:regDate, modDate:modDate, user:user})
}