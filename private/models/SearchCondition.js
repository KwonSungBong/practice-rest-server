class SearchCondition{
    constructor({name, value}){
        this._name_ = name
        this._value_ = value
    }
    get name(){
        return this._name_
    }
    set name(name){
        this._name_ = name
    }
    get value(){
        return this._value_
    }
    set value(value){
        this._value_ = value
    }
}

exports.getInstance = function(param){
    let {name, value} = param
    return new SearchCondition({name:name, value:value})
}