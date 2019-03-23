//获取access_token值
const rp = require('request-promise-native');
const { writeFileAsync, readFileAsync } = require('../utils/tools');
const {appId,appSecret} = require('../config');

async function getAccess_token() {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    const result = await rp({ nethod: 'GET', url, json: true });
    // console.log(result);

    //设置过期时间（尽量提前几分钟更新，避免过期）
    result.expires_in = Date.now() + 7200000 - 300000;

    //将数据保存下来（JSON.stringify()将数据转换成JSON数据）

    await writeFileAsync('./access_token.txt', result);

    //最后将数据返回出来
    return result;
}
module.exports = function fetchAccessToken() {
    return readFileAsync('./access_token.txt')
        .then((res) => {
            //判断时间有无过期
            if (res.expires_in < Date.now()) {
                //过期了就重新发请求保存数据
                return getAccess_token();
            } else {
                //没过期就直接用
                return res;
            }
        })
        .catch((err) => {
            return getAccess_token();
        })
}