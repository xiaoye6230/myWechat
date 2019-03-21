const sha1 = require('sha1');
const { getUserDataAsync, parseXMLData, formatJsData } = require('../utils/tools');
const template = require('./template');
const handleResponse = require('./handleResponse');

module.exports = () => {
    return async (req, res) => {
        //获取到微信服务器发送的请求参数
        const { signature, echostr, timestamp, nonce } = req.query;

        //设置好的token值
        const token = 'todayis190319';

        //将三者字典排序
        const arr = [token, timestamp, nonce].sort();

        //将数据拼接成一个字符串并sha1加密
        const sha1Str = sha1(arr.join(''));

        if (req.method === 'GET') {
            // 判断数据是否来自于微信服务器
            if (sha1Str === signature) {
                res.end(echostr);
            } else {
                res.end('error');
            }
        } else if (req.method === 'POST') {
            if (sha1Str !== signature) {
                res.end('error');
                return;
            }

            //获取到用户发来的消息
            const xmlData = await getUserDataAsync(req);

            //将XML数据转化为JS对象
            const jsData = parseXMLData(xmlData);

            //格式化jsData数据
            const userData = formatJsData(jsData);

            //实现自动回复消息         
            const options = handleResponse(userData);
            const replyMessage = template(options);

            res.send(replyMessage);
        } else {
            res.end('error');
        }
    }
}