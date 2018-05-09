<template>
    <div class="wait-storage">
        <FHeader :title="'待入库'" />
        <ag-navbar>
            <ag-navbar-item to="data">待入库数据</ag-navbar-item>
            <ag-navbar-item to="record">待入库记录</ag-navbar-item>
            <ag-navbar-item to="current">当前待入库</ag-navbar-item>
        </ag-navbar>
       <transition :name="transitionName" mode="out-in">
         <router-view></router-view>
       </transition>
    </div>
</template>
<script>

import FHeader from "@/components/Header";
import AgNavbar from "@/components/common/AgriNavbar";
import AgNavbarItem from "@/components/common/AgriNavbarItem";
import {animation} from "@/utils/routerAnima";
export default {
  components: {
    FHeader,
    AgNavbar,
    AgNavbarItem
  },
  data() {
    return {
      transitionName: "",
      selected: 1
    };
  },
  methods: {
    getResource(id){
      console.log(id);
    }
  },
  watch: {
    $route(to, from) {
      // const toDepth = to.path.length;
      // const fromDepth = from.path.length;
      this.transitionName = animation(to,from);
      // this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    }
  }
 
};
</script>
<style lang="scss" scoped>
@import "../css/var.scss";
.wait-storage {
  background-color: $bgColor;
}
</style>

