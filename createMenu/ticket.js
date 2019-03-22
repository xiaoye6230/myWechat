//获取access_token值
const rp = require('request-promise-native');
const fetchAccessToken =require('./getAccess_token');
const { writeFileAsync, readFileAsync } = require('../utils/tools');

async function getTicket() {
    const { access_token } = await fetchAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;

    const result = await rp({ nethod: 'GET', url, json: true });
    // console.log(result);

    //设置过期时间（尽量提前几分钟更新，避免过期）
    result.expires_in = Date.now() + 7200000 - 300000;
    const ticket = {
        ticket: result.ticket,
        expires_in: result.expires_in
    }

    //将数据保存下来（JSON.stringify()将数据转换成JSON数据）
    await writeFileAsync('./ticket.txt', ticket);

    //最后将数据返回出来
    return ticket;
}
function fetchTicket() {
    return readFileAsync('./ticket.txt')
        .then((res) => {
            //判断时间有无过期
            if (res.expires_in < Date.now()) {
                //过期了就重新发请求保存数据
                return getTicket();
            } else {
                //没过期就直接用
                return res;
            }
        })
        .catch((err) => {
            return getTicket();
        })
}

(async () => {
    const result = await fetchTicket();
    console.log(result);
  })()
  
  module.exports = fetchTicket;