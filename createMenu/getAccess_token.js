//获取access_token值
const rp = require('request-promise-native');
const { writeFile, readFile } = require('fs');

async function getAccess_token() {
    const appId = 'wx25d0606874dc357c';
    const appSecret = '8be46dd4da2ac260f56f138c907fe94f';
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    const result = await rp({ nethod: 'GET', url, json: true });
    // console.log(result);

    //设置过期时间（尽量提前几分钟更新，避免过期）
    result.expires_in = Date.now() + 7200000 - 300000;

    //将数据保存下来（JSON.stringify()将数据转换成JSON数据）
    writeFile('./access_token.txt', JSON.stringify(result),(err)=>{
        if(!err) console.log('文件保存成功');
        else console.log(err);
    });

    //最后将数据返回出来
    return result;
}
module.exports = function fetchAccessToken (){
    return new Promise ((resolve,reject)=>{
        readFile('./access_token.txt',(err,data)=>{
            if(!err){
                //有文件，将Buff数据转成字符串再转成JS对象
                resolve(JSON.parse(data.toString()));
            }else {
                //没有文件
                reject(err);
            }
        })
    })
    .then((res)=>{
        //判断时间有无过期
        if(res.expires_in<Date.now()){
            //过期了就重新发请求保存数据
            return getAccess_token();
        }else {
            //没过期就直接用
            return res;
        }
    })
    .catch((err)=>{
        return getAccess_token();
    })
}