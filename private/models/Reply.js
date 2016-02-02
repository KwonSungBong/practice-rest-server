class Reply{
    constructor({idx, content, regDate, modDate, user}){
        this._idx_ = idx
        this._content_ = content
        this._regDate_ = regDate
        this._modDate_ = modDate
        this._user_ = user
    }
    get idx(){
        return this._idx_
    }
    set idx(idx){
        this._idx_ = idx
    }
    get content(){
        return this._content_
    }
    set content(content){
        this._content_ = content
    }
    get regDate(){
        return this._regDate_
    }
    set regDate(regDate){
        this._regDate_ = regDate
    }
    get modDate(){
        return this._modDate_
    }
    set modDate(modDate){
        this._idx_ = modDate
    }
    get user(){
        return this._user_
    }
    set user(user){
        this._user_ = user
    }
}

exports.getInstance = function(param){
    let {idx, content, regDate, modDate, user} = param
    return new Reply({idx:idx, content:content, regDate:regDate, modDate:modDate, user:user})
}