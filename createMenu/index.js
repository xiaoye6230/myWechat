const rp = require('request-promise-native');
const fetchAccessToken = require('./getAccess_token');

const urlStr = 'https://api.weixin.qq.com/cgi-bin/';
const menu = {
    "button": [
        {
            "type": "click",  // 单击菜单
            "name": "💻首页",
            "key": "home"
        },
        {
            "name": "✳选项",
            "sub_button": [
                {
                    "type": "view",  // 跳转到指定网址
                    "name": "官网",
                    "url": "http://www.baidu.com/"
                },
                {
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示",
                    "key": "扫码带提示"
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件",
                    "key": "扫码推事件"
                },
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "rselfmenu_1_0"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_1"
                },
            ]
        },
        {
            "name": "💎个人中心",
            "sub_button": [
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "rselfmenu_1_2"
                },
                {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }
            ]
        }
    ]
}

//微信在创建新菜单之前，必须将旧菜单删除
async function createMenu() {
    // 获取到access_token值
    const { access_token } = await fetchAccessToken();
    //定义请求地址
    const url = `${urlStr}menu/create?access_token=${access_token}`;
    //发送请求
    return await rp({ method: 'POST', url, json: true, body: menu });
}

async function deleteMenu() {
    const { access_token } = await fetchAccessToken();
    const url = `${urlStr}menu/delete?access_token=${access_token}`;
    return await rp({ method: 'GET', url, json: true });
}

//创建标签
async function createTag(name) {
    const { access_token } = await fetchAccessToken();
    const url = `${urlStr}tags/create?access_token=${access_token}`;
    return await rp({ method: 'POST', url, json: true, body: { tag: { name } } });
}
//获取标签下的所有粉丝列表
async function fansTag(tagid, next_openid = '') {
    const { access_token } = await fetchAccessToken();
    const url = `${urlStr}user/tag/get?access_token=${access_token}`;
    return await rp({ method: 'POST', url, json: true, body: { tagid, next_openid } });
}

//批量为多个用户打标签
async function batchUsersTag(openid_list, tagid) {
    const { access_token } = await fetchAccessToken();
    const url = `${urlStr}tags/members/batchtagging?access_token=${access_token}`;
    return await rp({ method: 'POST', url, json: true, body: { openid_list, tagid } });
}

async function sendMessage(body) {
    const { access_token } = await fetchAccessToken();
    const url = `${urlStr}message/mass/sendall?access_token=${access_token}`;
    return await rp({ method: 'POST', url, json: true, body });
}

(async () => {
    const body = {
        "filter": {
            "is_to_all": false,  // 是否添加进历史记录
            "tag_id": 139
        },
        "text": {
            "content": '测试群发消息~ \n点击复习相关课程 \n<a href="https://juejin.im/post/5c64d15d6fb9a049d37f9c20">中高级前端大厂面试秘籍</a>'
        },
        "msgtype": "text"
    }
    const result = await sendMessage(body);
    console.log(result);

})()
