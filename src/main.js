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
    document.addEventListener("plusready", function() {
        // 注册返回按键事件 
        plus.key.addEventListener('backbutton', function() {
            let index = document.toIndex || 1;
            // let path = location.href.split('#')[1];
            // if (path != '/') {
            //     history.back();
            // }
            if (index > 7) {
                history.back();
            } else {
                // 事件处理 
                plus.nativeUI.confirm("要离开了吗？", function(event) {
                    console.log(event.index);
                    if (event.index == 0) {
                        plus.runtime.quit();
                    }
                }, null, ["取消", "确定"]);
            }
        }, false);
    });
}
function formatComponentName(vm)
{
  if (vm.$root === vm) return 'root';

  var name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name;
  return (name ? 'component <' + name + '>' : 'anonymous component') + (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '');

}
var fundebug = require("fundebug-javascript");
fundebug.apikey = "39d0e66c45ab2115b87a8b1a38bebf1e7eb41d265e34690ad346e366b011c34d"

Vue.config.errorHandler = function(err, vm, info) {
    var componentName = formatComponentName(vm);
    var propsData = vm.$options && vm.$options.propsData;

    fundebug.notifyError(err, {
        metaData: {
            componentName: componentName,
            propsData: propsData,
            info: info
        }
    });
}