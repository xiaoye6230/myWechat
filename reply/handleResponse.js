const { url } = require('../config');

module.exports = (userData) => {
    //实现自动回复功能
    let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        creatTime: Date.now(),
        type: 'text',
    };

    if (userData.MsgType === 'text') {
        //用户输入的是文本
        if (userData.Content === '1') {
            options.content = '好好学习，天天向上';
        } else if (userData.Content.indexOf('2') !== -1) {
            options.content = '你叫什么？ \n我叫小度';
        } else if (userData.Content === '3') {
            options.content = `<a href="${url}/search">语音识别页面</a>`
            
        } else {
            options.content = '你在说什么？我听不明白';
        }
    } else if (userData.MsgType === 'image') {
        //用户输入的是图片，将用户发的图片返回给用户
        options.mediaId = userData.MediaId;
        options.type = 'image';
    } else if (userData.MsgType === 'voice') {
        //将用户发的语音识别后返回给用户
        options.content = userData.Recognition;
    } else if (userData.MsgType === 'location') {
        //用户发送的是地理位置消息
        options.content = `地理位置纬度：${userData.Location_X}
        \n地理位置经度：${userData.Location_Y}
        \n地图缩放大小： ${userData.Scale}
        \n地理位置信息： ${userData.Label}`;
    } else if (userData.MsgType === 'event') {
        if (userData.Event === 'subscribe') {
            options.content = '欢迎您关注公众号';
            if (userData.EventKey) {
                options.content = '欢迎扫描带参数二维码，关注公众号';
            }
        } else if (userData.Event === 'unsubscribe') {
            //需将值设成空，不然微信服务器会请求三次
            options.content = '';
        } else if (userData.Event === 'CLICK') {
            options.content = '用户点击了菜单';
        }
    }
    return options;
}


