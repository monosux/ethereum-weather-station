'use strict';
const Alexa = require('alexa-sdk');
const WeatherStation = require('./weatherStation');

const weather = new WeatherStation();

const handlers = {
    LaunchRequest: function () {
        weather.weatherBasic().then((result) => {
            this.emit(':tell', result);
        }).catch((error) => {
            this.emit(':tell', error);
        });
    },
    FeeIntent: function () {
        weather.weatherFee().then((result) => {
            this.emit(':tell', result);
        }).catch((error) => {
            this.emit(':tell', error);
        });        
    },
    StatisticIntent: function () {
        weather.weatherStatistic().then((result) => {
            this.emit(':tell', result);
        }).catch((error) => {
            this.emit(':tell', error);
        });        
    },
    PriceIntent: function () {
        weather.weatherPrice().then((result) => {
            this.emit(':tell', result);
        }).catch((error) => {
            this.emit(':tell', error);
        });        
    }
};

exports.handler = (event, context, callback) => {
    let alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};