
import Vue from 'vue';
import Vuex from 'vuex';
import login from './modules/index'

Vue.use(Vuex);

export default new Vuex.Store({
    actions: {},
    mutations: {},
    modules: {
        login
    }
})