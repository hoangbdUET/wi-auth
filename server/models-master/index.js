let Sequelize = require('sequelize');
let config = require('config').Database;


const sequelize = new Sequelize(config.dbName, config.user, config.password, {
    define: {
        freezeTableName: true
    },
    dialect: config.dialect,
    port: config.port,
    logging: config.logging,
    pool: {
        max: 20,
        min: 0,
        idle: 200
    },
    storage: config.storage,
    operatorsAliases: Sequelize.Op
});
sequelize.sync()
    .catch(function (err) {
        console.log(err);
    });
let models = [
    'Group',
    'RefreshToken',
    'SharedProject',
    'SharedProjectGroup',
    'User',
    'UserGroupPermission',
];
models.forEach(function (model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function (m) {
    m.User.hasMany(m.RefreshToken, {foreignKey: {name: 'idUser', allowNull: false}, onDelete: 'CASCADE'});
    m.User.hasMany(m.SharedProject, {foreignKey: {name: 'idOwner', allowNull: false}, onDelete: 'CASCADE'});
    m.User.belongsToMany(m.Group, {
        through: m.UserGroupPermission,
        foreignKey: 'idUser'
    });
    m.Group.belongsToMany(m.User, {
        through: m.UserGroupPermission,
        foreignKey: 'idGroup'
    });
    m.SharedProject.belongsToMany(m.Group, {
        through: 'shared_project_group',
        foreignKey: 'idSharedProject'
    });
    m.Group.belongsToMany(m.SharedProject, {
        through: 'shared_project_group',
        foreignKey: 'idGroup'
    });
    ///user.addGroup(group, {through: {permission: 5});
})(module.exports);
module.exports.sequelize = sequelize;
