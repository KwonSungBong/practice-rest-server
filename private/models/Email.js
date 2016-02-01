// value object
//System.Text.RegularExpressions.Regex.IsMatch(value, @"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"))
class Email {
    constructor(email)
    {
        this._email_ = email
    }
    get email(){
        return this._email_
    }
    set email(email){
        this._email_ = email
    }
}

exports.getInstance = function(paramEmail){
    /*    idx: { type : Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
     email: Sequelize.STRING,
     password: Sequelize.STRING,
     name: Sequelize.STRING,
     regDate: Sequelize.DATE,
     modDate: Sequelize.DATE*/

    const email = new Email()
    return email
}