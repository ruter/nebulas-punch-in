import env from '../config/env';

let util = {

};

util.getContractAddress = function () {
    return '';
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

export default util;