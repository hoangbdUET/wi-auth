var Sequelize = require('sequelize');
var config = require('config').Database;


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
var models = [
    'User',
    'RefreshToken'
];
models.forEach(function (model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function (m) {
    m.User.hasMany(m.RefreshToken, {foreignKey: {name: 'idUser', allowNull: false}, onDelete: 'CASCADE'});
    // m.FamilyCondition.belongsTo(m.Family, {foreignKey: 'idFamily'});
})(module.exports);
module.exports.sequelize = sequelize;
