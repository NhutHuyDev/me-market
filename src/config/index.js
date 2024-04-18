"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = require("./default");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var dev = {
    app: {
        port: Number(process.env.DEV_PORT) || default_1.default.DEV.PORT,
        access_token_expiration: process.env.ACCESS_TOKEN_EXPIRATION || default_1.default.DEV.ACCESS_TOKEN_EXPIRATION,
        refresh_token_expiration: process.env.REFESH_TOKEN_EXPIRATION || default_1.default.DEV.REFESH_TOKEN_EXPIRATION
    },
    db: {
        mongo: {
            connection_str: process.env.MONGO_CONNECTION_STR || default_1.default.DEV.DB.MONGO.CONNECTION_STR
        }
    },
    smtp: {
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN
    }
};
var pro = {
    app: {
        port: Number(process.env.PRO_PORT) || default_1.default.PRO.PORT,
        access_token_expiration: process.env.ACCESS_TOKEN_EXPIRATION || default_1.default.DEV.ACCESS_TOKEN_EXPIRATION,
        refresh_token_expiration: process.env.REFESH_TOKEN_EXPIRATION || default_1.default.DEV.REFESH_TOKEN_EXPIRATION
    },
    db: {
        mongo: {
            connection_str: process.env.MONGO_CONNECTION_STR || default_1.default.DEV.DB.MONGO.CONNECTION_STR
        }
    },
    smtp: {
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN
    }
};
var env = process.env.NODE_ENV || 'dev';
var config = env === 'dev' ? dev : pro;
exports.default = config;
