class Board{
    constructor({idx, name, description, regDate, modDate, posts, pagination, searchCondition}){
        this._idx_ = idx
        this._name_ = name
        this._description_ = description
        this._regDate_ = regDate
        this._modDate_ = modDate
        this._posts_ = posts
        this._pagination_ = pagination
        this._searchCondition_ = searchCondition
    }

    get idx(){
        return this._idx_
    }
    set idx(idx){
        this._idx_ = idx
    }
    get name(){
        return this._name_
    }
    set name(name){
        this._name_ = name
    }
    get description(){
        return this._description_
    }
    set description(description){
        this._description_ = description
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
        this._modDate_ = modDate
    }
    get posts(){
        return this._posts_
    }
    set posts(posts){
        this._posts_ = posts
    }
    get pagination(){
        return this._pagination_
    }
    set pagination(pagination){
        this._pagination_ = pagination
    }
    get searchCondition(){
        return this._searchCondition_
    }
    set searchCondition(searchCondition){
        this._searchCondition_ = searchCondition
    }
}

exports.getInstance = function(param){
    let {idx, name, description, regDate, modDate, posts, pagination, searchCondition} = param
    return new Board({idx:idx, name:name, description:description, regDate:regDate, modDate:modDate, posts:posts, pagination:pagination, searchCondition:searchCondition})
}