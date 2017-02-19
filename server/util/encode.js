let Crypto = require('./Crypto');

module.exports = function (param) {
        param.csrf_token = '';
        var code = Crypto.aesRsaEncrypt(JSON.stringify(param));
        return 'params=' + encodeURIComponent(code.params) + '&encSecKey=' + encodeURIComponent(code.encSecKey);
};