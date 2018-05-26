import { fetchLogin } from '@/fetch/api';
import * as types from '../mutations-types';

const state = {
    loginData: null
}

const actions = {
    async login({ state, commit }, opt) {
        let res = await fetchLogin(opt);
        console.log(typeof [types.SET_LOGIN])
        console.log([types.SET_LOGIN])
        commit(types.SET_LOGIN, res.data);
    }
}
const mutations = {
    [types.SET_LOGIN](state, data) {
        state.loginData = data;
    }
}
const getters = {
    loginData(){
        return state.loginData;
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}