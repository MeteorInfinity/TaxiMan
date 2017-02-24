const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var getTaxiMes = function () {
    var promise = new Promise(async function(resolve, reject){
        
        var taxiMes = sequelize.define('taxiMes', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            deviceID: Sequelize.STRING(50),
            plateNum: Sequelize.STRING(50),
            phoneNum: Sequelize.STRING(50),
            diver: Sequelize.STRING(20),
            company: Sequelize.STRING(20)
        }, {
                timestamps: false,
                freezeTableName: true
            });

        try{
            var taxiMesAns = await taxtMes.findAll();
            resolve(JSON.stringify(taxiMesAns));

        }catch(error){
            reject(console.error(error));
        }
    });
    return promise;
}

var getTkPnts = function (date, timeA, timeN) {
    var promise = new Promise(async function(resolve, reject){
        var tkPnts = sequelize.define('trkpnt_'+date, {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            plateNum: Sequelize.STRING(50),
            phoneNum: Sequelize.STRING(50),
            time: Sequelize.DATE,
            lon: Sequelize.STRING(255),
            speed: Sequelize.DOUBLE,
            direction: Sequelize.STRING(9),
            state: Sequelize.STRING(9)
        },{
                timestamps: false,
                freezeTableName: true
            });

        try{
            var tkPntsAns = await tkPnts.findAll({
                where: {
                    time:{
                       '$between': [timeA, timeN] 
                   }
                }
            });
            resolve(JSON.stringify(tkPntsAns));
        }catch(error){
            reject(console.error(error));
        }
    });
    return promise;
}

exports.getTaxiMes = getTaxiMes;
exports.getTkPnts = getTkPnts;