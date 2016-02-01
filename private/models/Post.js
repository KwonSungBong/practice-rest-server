class Post{
    constructor({idx, subject, content, regDate, modDate, user, pagination}){
        this._idx_ = idx
        this._subject_ = subject
        this._content_ = content
        this._regDate_ = regDate
        this._modDate_ = modDate
        this._user_ = user
        this._pagination_ = pagination
    }

    get idx(){
        return this._idx_
    }
    set idx(idx){
        this._idx_ = idx
    }
    get subject(){
        return this._subject_
    }
    set subject(subject){
        this._subject_ = subject
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
    get pagination(){
        return this._pagination_
    }
    set pagination(pagination){
        this._pagination_ = pagination
    }
}

exports.getInstance = function(param){
    let {idx, subject, content, regDate, modDate, user, pagination} = param
    return new Post({idx:idx, subject:subject, content:content, regDate:regDate, modDate:modDate, user:user, pagination:pagination})
}