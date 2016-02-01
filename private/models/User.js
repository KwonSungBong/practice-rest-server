import {emailFactory} from './Email'
class User {
    constructor({idx, email, password, name, regDate, modDate})
    {
        this._idx_ = idx
        this._email_ = email
        this._password_ = password
        this._name_ = name
        this._regDate_ = regDate
        this._modDate_ = modDate
    }
    get idx(){
        return this._idx_
    }
    set idx(idx){
        this._idx_ = idx
    }
    get email(){
        return this._email_
    }
    set email(email){
        this._email_ = email
    }
    get password(){
        return this._password_
    }
    set password(password){
        this._password_ = password
    }
    get name(){
        return this._name_
    }
    set name(name){
        this._name_ = name
    }
    get regDate(){
        return this._regDate_
    }
    set regDate(regDate){
        this.regDate = regDate
    }
    get modDate(){
        return this._modDate_
    }
    set modDate(modDate){
        this._modDate_ = modDate
    }
}

exports.getInstance = function(param){
    let {idx, email, password, name, regDate, modDate} = param
    //let  validIdx = idx && Number.isInteger(idx)
    //let  validEmail = email && Number.isInteger(validEmail)
    //let  validPassword = password && Number.isInteger(validPassword)
    //let  validName = name && Number.isInteger(validName)
    //let  validRegDate = regDate && Number.isInteger(validRegDate)
    //let  validModDate = modDate && Number.isInteger(validModDate)
    //throw new Error('ffffffff');
    return new User({idx:idx, email:email, password:password, name:name, regDate:regDate, modDate:modDate})
}