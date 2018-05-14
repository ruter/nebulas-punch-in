import env from '../config/env';

let util = {

};

util.ChainHost = 'https://testnet.nebulas.io';

util.noWallet = typeof(webExtensionWallet) === "undefined";

util.getAccount = function (self) {
    if(typeof(webExtensionWallet) === "undefined"){
        return;
    }

    window.postMessage({
        "target": "contentscript",
        "data":{},
        "method": "getAccount",
    }, "*");

    window.addEventListener('message', function(e) {
        if(e.data && e.data.data && e.data.data.account){
            const address = e.data.data.account;
            self.address = address;
            localStorage.setItem('nasAddress', address);
        }
    });
};

util.getContractAddress = function () {
    return 'n1rTEqaXFaqSLs7eZg2qY5Ap6iWraTbRPYc';
};

util.parse = function (data) {
    return JSON.parse(data);
};

util.toSting = function (data) {
    return JSON.stringify(data);
};

util.dateFmt = function (dateString) {
    let date = typeof dateString !== 'object' ? new Date(dateString) : dateString;
    const tmpDate = {
        year: date.getFullYear(),
        month: (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        day: (date.getDate() < 10) ? '0' + date.getDate() : date.getDate(),
        hour: (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
        min: (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
        sec: (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
    };
    return `${tmpDate.year}.${tmpDate.month}.${tmpDate.day} ${tmpDate.hour}:${tmpDate.min}:${tmpDate.sec}`;
};

util.dateDelta = function (dateString) {
    let date = typeof dateString !== 'object' ? new Date(dateString) : dateString;
    let now =  new Date();
    let start = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
        end = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
    return (new Date(end) - new Date(start)) / 86400000 + 1;
};

util.dateSep = function (date) {
    return {
        year: date.getFullYear(),
        month: (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        day: (date.getDate() < 10) ? '0' + date.getDate() : date.getDate(),
        hour: (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
        min: (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
        sec: (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
    }
};

util.title = function(title) {
    title = title ? title + ' - 星云打卡' : '星云打卡';
    window.document.title = title;
};

util.PocketErr = {
    title: '请先安装浏览器钱包插件',
    content: `<p>检测到你还没安装浏览器钱包插件，请先<a href="https://github.com/ChengOrangeJu/WebExtensionWallet" target="_blank">安装 NAS 钱包插件</a></p><br>
              <p>如果你还没有创建 NAS 钱包，可以参考官方教程进行创建「<a href="https://blog.nebulas.io/2018/04/12/creating-a-nas-wallet/" target="_blank">星云Web钱包教程1：创建NAS钱包</a>」</p><br>
              <p>确认导入钱包并解锁后，请刷新页面重新进行操作 :)</p>`
};

util.WalletWarning = {
    title: '请先解锁钱包',
    content: `<p>检测到你已安装浏览器钱包插件但未解锁，如果你还没有创建 NAS 钱包，可以参考官方教程进行创建「<a href="https://blog.nebulas.io/2018/04/12/creating-a-nas-wallet/" target="_blank">星云Web钱包教程1：创建NAS钱包</a>」</p><br>
              <p>确认导入钱包并解锁后，请刷新页面重新进行操作 :)</p>`
};

export default util;