//工具函数模块
const {parseString} = require('xml2js');
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
    }
}