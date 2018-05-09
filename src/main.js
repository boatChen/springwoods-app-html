// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Es6Promise from 'es6-promise'

Es6Promise.polyfill();

Vue.config.productionTip = false;
// FastClick.attach(document.body);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
bingBackEvent();
/** 监听手机物理后退按键 */
function bingBackEvent() {
    document.addEventListener("plusready", function () {
        // 注册返回按键事件 
        plus.key.addEventListener('backbutton', function () {
            let index = document.toIndex || 1;
            // let path = location.href.split('#')[1];
            // if (path != '/') {
            //     history.back();
            // }
            if(index > 7 ){
                history.back();
            }
            else {
                // 事件处理 
                plus.nativeUI.confirm("要离开了吗？", function (event) {
                    console.log(event.index);
                    if (event.index == 0) {
                        plus.runtime.quit();
                    }
                }, null, ["取消", "确定"]);
            }
        }, false);
    });
}
