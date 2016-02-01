import Sequelize from 'sequelize'
var sequelize = new Sequelize('mariadb://root:3714@localhost:3306/primitive')
var User = sequelize.define('user', {
    idx: {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        field: 'email'
    },
    password: {
        type: Sequelize.STRING,
        field: 'password'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    regDate: {
        type: Sequelize.DATE,
        field: 'reg_date'
    },
    modDate: {
        type: Sequelize.DATE,
        field: 'mod_date'
    }
}, {
    tableName: 'users',
    freezeTableName: true,
    underscored: true,
    timestamps: false
});

var Board = sequelize.define('board', {
    idx: { type : Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    description: {
        type: Sequelize.STRING,
        field: 'description'
    },
    regDate: {
        type: Sequelize.DATE,
        field: 'reg_date'
    },
    modDate: {
        type: Sequelize.DATE,
        field: 'mod_date'
    }
}, {
    tableName: 'boards',
    freezeTableName: true,
    underscored: true,
    timestamps: false
});

var Post = sequelize.define('post', {
    idx: { type : Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    boardIdx: {
        type: Sequelize.INTEGER,
        field: 'board_idx',
        references: {model: Board, key: 'idx'}
    },
    userIdx: {
        type: Sequelize.INTEGER,
        field: 'user_idx',
        references: {model: User, key: 'idx'}
    },
    subject: {
        type: Sequelize.STRING,
        field: 'subject'
    },
    content: {
        type: Sequelize.STRING,
        field: 'content'
    },
    regDate: {
        type: Sequelize.DATE,
        field: 'reg_date'
    },
    modDate: {
        type: Sequelize.DATE,
        field: 'mod_date'
    }
}, {
    tableName: 'posts',
    freezeTableName: true,
    underscored: true,
    timestamps: false
});

var Reply = sequelize.define('reply', {
    idx: { type : Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    postIdx: {
        type: Sequelize.INTEGER,
        field: 'post_idx',
        references: {model: Post, key: 'idx'}
    },
    userIdx: {
        type: Sequelize.INTEGER,
        field: 'user_idx',
        references: {model: User, key: 'idx'}
    },
    content: {
        type: Sequelize.STRING,
        field: 'content'
    },
    regDate: {
        type: Sequelize.DATE,
        field: 'reg_date'
    },
    modDate: {
        type: Sequelize.DATE,
        field: 'mod_date'
    }
}, {
    tableName: 'replies',
    freezeTableName: true,
    underscored: true,
    timestamps: false
});


sequelize.sync()
exports.userDao = User
exports.boardDao = Board
exports.postDao = Post
exports.replyDao = Reply
