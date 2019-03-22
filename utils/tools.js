//工具函数模块
const { parseString } = require('xml2js');
const { writeFile, readFile } = require('fs');
const {resolve} =require('path');
module.exports = {
    //获取用户发的消息
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            req
                .on('data', (data) => {
                    xmlData += data.toString();
                })
                .on('end', () => {
                    //数据接收完成
                    resolve(xmlData);
                })
        })
    },

    //将XML数据解析为JS对象
    parseXMLData(xmlData) {
        let jsData = null;
        parseString(xmlData, { trim: true }, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        })
        return jsData;
    },

    //格式化JS对象
    formatJsData(jsData) {
        const { xml } = jsData;
        let userData = {};
        for (let key in xml) {

            //获取到属性值
            const value = xml[key];

            //去掉数组返回一个JS对象
            userData[key] = value[0];
        }
        return userData;
    },

    //写入方法
    writeFileAsync(filePath, data) {
        filePath = resolve(__dirname, '../createMenu', filePath);
        return new Promise((resolve, reject) => {
            writeFile(filePath, JSON.stringify(data), (err) => {
                if (!err) resolve();
                else reject(err);
            })
        })
    },

    //读出方法
    readFileAsync(filePath) {
        filePath = resolve(__dirname, '../createMenu', filePath);
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if (!err) {
                    //有文件，将Buff数据转成字符串再转成JS对象
                    resolve(JSON.parse(data.toString()));
                } else {
                    //没有文件
                    reject(err);
                }
            })
        })
    }
}