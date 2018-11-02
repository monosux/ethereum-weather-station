'use strict';
const https = require('https');
const lexicon = require('./lexicon');

class WeatherStation {
    constructor() {
        this.urls = {
            basic: 'https://ethgasstation.info/json/ethgasAPI.json',
            statistic: 'https://ethgasstation.info/json/txDataLast10k.json'
        };
    }

    weatherBasic() {
        return new Promise((resolve, reject) => {
            this.askStation('basic').then((result) => {
                let weather = [
                    this.getWeatherType(result.average),
                    lexicon.basic[0].replace('{type}', lexicon.priceTypes[1]).replace('{value}', (result.average / 10).toFixed(2)),
                    lexicon.basic[1].replace('{type}', lexicon.priceTypes[1]).replace('{value}', result.avgWait),
                    lexicon.basic[2].replace('{type}', lexicon.priceTypes[1]).replace('{value}', result.block_time.toFixed(2)),
                    lexicon.basic[3].replace('{value}', result.blockNum)
                ];
                resolve(weather.join(' '));                
            }).catch(() => {
                reject(lexicon.error);
            });
        });
    }

    weatherFee() {
        return new Promise((resolve, reject) => {
            this.askStation('basic').then((result) => {
                let fee = [
                    lexicon.basic[0].replace('{type}', lexicon.priceTypes[0]).replace('{value}', (result.safeLow / 10).toFixed(2)),
                    lexicon.basic[1].replace('{type}', lexicon.priceTypes[0]).replace('{value}', result.safeLowWait),
                    lexicon.basic[0].replace('{type}', lexicon.priceTypes[1]).replace('{value}', (result.average / 10).toFixed(2)),
                    lexicon.basic[1].replace('{type}', lexicon.priceTypes[1]).replace('{value}', result.avgWait),
                    lexicon.basic[0].replace('{type}', lexicon.priceTypes[2]).replace('{value}', (result.fast / 10).toFixed(2)),
                    lexicon.basic[1].replace('{type}', lexicon.priceTypes[2]).replace('{value}', result.fastWait),
                    lexicon.basic[0].replace('{type}', lexicon.priceTypes[3]).replace('{value}', (result.fastest / 10).toFixed(2)),
                    lexicon.basic[1].replace('{type}', lexicon.priceTypes[3]).replace('{value}', result.fastestWait),
                ];
                resolve(fee.join(' '));                
            }).catch(() => {
                reject(lexicon.error);
            });
        });        
    }

    weatherStatistic() {
        return new Promise((resolve, reject) => {
            this.askStation('statistic').then((result) => {
                let statistic = [
                    lexicon.statistic[0].replace('{value}', result.totalTx),
                    lexicon.statistic[1].replace('{value}', result.fullBlocks),
                    lexicon.statistic[2].replace('{value}', result.emptyBlocks),
                    lexicon.statistic[3].replace('{value}', result.maxMinedGasPrice),
                    lexicon.statistic[4].replace('{value}', result.minMinedGasPrice)
                ];
                resolve(statistic.join(' '));               
            }).catch(() => {
                reject(lexicon.error);
            });
        });        
    }

    weatherPrice() {
        return new Promise((resolve, reject) => {
            this.askStation('statistic').then((result) => {
                let prices = [
                    lexicon.prices[0],
                    lexicon.prices[1].replace('{value}', result.ETHpriceUSD),
                    lexicon.prices[2].replace('{value}', result.ETHpriceEUR),
                    lexicon.prices[3].replace('{value}', result.ETHpriceCNY)
                ];
                resolve(prices.join(' '));
            }).catch(() => {
                reject(lexicon.error);
            });
        });        
    }

    getWeatherType(price) {
        let weather;
        switch (true) {
            case (price > 100):
                weather = lexicon.weatherTypes[3];
                break;
            case (price > 50):
                weather = lexicon.weatherTypes[2];
                break;
            case (price > 20):
                weather = lexicon.weatherTypes[1];
                break;
            default:
                weather = lexicon.weatherTypes[0];
        }
        return weather;
    }

    askStation(type) {
        return new Promise((resolve, reject) => {
            https.get(this.urls[type], (response) => {
                if (response.statusCode != 200) reject(new Error('Request failed, status code: ' + response.statusCode));
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => resolve(JSON.parse(data)));
            }).on('error', (error) => {
                reject(new Error('Request failed, error: ' + error.message));
            });
        });
    }    
}

module.exports = WeatherStation;