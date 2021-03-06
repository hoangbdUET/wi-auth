let captchapng = require('captchapng');
let express = require('express');
let router = express.Router();
let md5 = require('md5');


function captchas() {
    this.lenght = 0;
}

captchas.prototype.put = function (captcha, value) {
    this.lenght++;
    this[captcha] = value;
}

captchas.prototype.get = function (captcha) {
    return this[captcha];
}

captchas.prototype.delete = function (captcha) {
    this.lenght--;
    delete this[captcha];
}

let captchaList = new captchas();

setInterval(function () {
    // console.log(captchaList.lenght);
    Object.keys(captchaList).forEach(function (captcha) {
        if (Date.now() - captchaList.get(captcha).timestamp > 1000 * 60 * 60 * 3) {
            captchaList.delete(captcha);
        }
    });
}, 100000);

router.get("/captcha.png", function (req, res) {
    let randNumber = parseInt(Math.random() * 90000 + 10000);
    let captchaValue = {
        timestamp: Date.now()
    }
    captchaList.put(randNumber, captchaValue);
    // console.log(captchaList.lenght);
    if (captchaList.lenght > 1000) captchaList = new captchas();
    let p = new captchapng(80, 30, randNumber); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    let img = p.getBase64();
    let imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
});

module.exports.captchaList = captchaList;
module.exports.router = router;