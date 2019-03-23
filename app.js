const express = require('express');
const sha1 = require('sha1');
const reply = require('./reply');
const fetchTicket = require('./createMenu/ticket');
const { url, appId } = require('./config');

const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

app.get('/search', async (req, res) => {
    const { ticket } = await fetchTicket();
    const noncestr = Math.random().toString().slice(2);
    const timestamp = Math.round(Date.now() / 1000);

    const arr = [
        `jsapi_ticket=${ticket}`,
        `url=${url}/search`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`
    ];

    const signature = sha1(arr.sort().join('&'));
    res.render('search', { noncestr, timestamp, signature, appId, url });
}),

    app.use(reply());
app.listen(3000, (err) => {
    if (!err) console.log('服务器启动成功');
    else console.log(err);
})