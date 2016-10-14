# ttshangxiang
ttshangxiang's new website!

# 参考
http://www.open-open.com/lib/view/open1473132733688.html  
https://github.com/zkaip/gen-koa2/blob/master/app.js  
https://github.com/rusty1s/koa2-rest-api

# babel支持
$ npm install babel-register babel-plugin-transform-async-to-generator --save

# cnpm安装
$ npm install -g cnpm --registry=https://registry.npm.taobao.org

# 两个工具
## 管理工具
$ npm install pm2 -g  
常用指令：  
start app.js  
restart all  
stop all  
delete all  

## 自动重启  
$ npm install supervisor -g
设置监听文件夹为server：  
supervisor -w ./server start.js
