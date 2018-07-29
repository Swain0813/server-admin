module.exports.connections = {
    /*******************   本地测试    *********************/
    mongo_url: "mongodb://192.168.1.178:27017/msip",

    someRedisServer: {
        host: "192.168.1.178",
        //host: 'localhost',
        port: 6379,
        db: "0",
        resave: false,
        saveUninitialized: true,
        // showFriendlyErrorStack:true,
        secret: 'keyboard cat',
        ttl: 1000,// 存放的数据的过期时间
        cookie: {maxAge: 100000}
    }


    /*******************   现网测试    *********************/
    /* mongo_url: "mongodb://10.150.1.34:27017/msip",

     someRedisServer: {
     host: "10.150.1.34",
     //host: 'localhost',
     port: 6379,
     db: "0",
     resave: false,
     saveUninitialized: true,
     secret: 'keyboard cat',
     ttl: 1000,// 存放的数据的过期时间
     cookie: {maxAge: 100000}
     }*/

    /*******************   生产    *********************/
   /* mongo_url: "mongodb://10.150.244.40:27017/msip",

     someRedisServer: {
     host: "192.168.11.8",
     port: 6001,
     db: "0",
     resave: false,
     saveUninitialized: true,
     secret: 'keyboard cat',
     ttl: 1000,// 存放的数据的过期时间
     cookie: {maxAge: 100000}
     }*/

};

