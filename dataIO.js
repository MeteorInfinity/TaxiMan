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

var optAreaAns = function (areaTaxiAns) {
    var promise = new Promise(async function(resolve, reject){
        
        var cityAreaCalc = sequelize.define('cityAreaCalc', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            areaName: Sequelize.STRING(50),
            areaID: Sequelize.INTEGER,
            calcTime: Sequelize.DATE,
            areaEva: Sequelize.DOUBLE,
            taxiNum: Sequelize.INTEGER,
            upNum: Sequelize.INTEGER,
            normNum: Sequelize.DOUBLE
        }, {
                timestamps: false,
                freezeTableName: true
            });

        try{
            var ans = await cityAreaCalc.bulkCreate(areaTaxiAns,{
                fields: ["areaName","areaID","calcTime","areaEva","taxiNum","upNum","normNum"]
            });
            resolve(JSON.stringify(ans));

        }catch(error){
            reject(console.error(error));
        }
    });
    return promise;
}

var getAreaAns = function (timeA, timeN) {
    var promise = new Promise(async function(resolve, reject){
        
        var cityAreaCalc = sequelize.define('cityAreaCalc', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            areaName: Sequelize.STRING(50),
            areaID: Sequelize.INTEGER,
            calcTime: Sequelize.DATE,
            areaEva: Sequelize.DOUBLE,
            taxiNum: Sequelize.INTEGER,
            upNum: Sequelize.INTEGER,
            normNum: Sequelize.DOUBLE
        }, {
                timestamps: false,
                freezeTableName: true
            });

        try{
            var areaClacAns = await cityAreaCalc.findAll({
                where: {
                    calcTime:{
                       '$between': [timeA, timeN] 
                   }
                }
            });
            resolve(JSON.stringify(areaClacAns));

        }catch(error){
            reject(console.error(error));
        }
    });
    return promise;
}

var getAreaAnsO = function (areaID, timeA, timeN) {
    var promise = new Promise(async function(resolve, reject){
        
        var cityAreaCalc = sequelize.define('cityAreaCalc', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            areaName: Sequelize.STRING(50),
            areaID: Sequelize.INTEGER,
            calcTime: Sequelize.DATE,
            areaEva: Sequelize.DOUBLE,
            taxiNum: Sequelize.INTEGER,
            upNum: Sequelize.INTEGER,
            normNum: Sequelize.DOUBLE
        }, {
                timestamps: false,
                freezeTableName: true
            });

        try{
            var areaClacAns = await cityAreaCalc.findAll({
                where: {
                    areaID: areaID,
                    calcTime: {
                       '$between': [timeA, timeN] 
                   }
                }
            });
            resolve(JSON.stringify(areaClacAns));

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
            lng: Sequelize.STRING(255),
            lat: Sequelize.STRING(255),
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
exports.optAreaAns = optAreaAns;
exports.getAreaAns = getAreaAns;
exports.getAreaAnsO = getAreaAnsO;