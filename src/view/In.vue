<template>
    <div id="In"> 
      <FHeader :title="title" :back="false" :showLogo="true" />
      <ag-navbar>
        <ag-navbar-item to="/In/semistock">半成品入库</ag-navbar-item>
        <ag-navbar-item to="/In/restock">半成品再入库</ag-navbar-item>
        <ag-navbar-item to="/In/FinishedProIn">成品入库</ag-navbar-item>
      </ag-navbar>
        <div class="nav-content">
          <transition :name="transitionName" mode="out-in">
            <router-view class="child-view"></router-view>
          </transition>
        </div>
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
      title:sessionStorage.getItem('username')
    };
  },
  watch: {
    $route(to, from) {
      // const toDepth = to.path.split("/")[1].length;
      // const fromDepth = from.path.split("/")[1].length;
      // console.log(toDepth, fromDepth);
      // this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      this.transitionName = animation(to,from);
      // this.transitionName = toIndex > fromIndex ? "slide-right" : "slide-left";
    }
  }
};
</script>
<style scoped lang="scss">
@import "../css/var.scss";

#In {
  background-color: $bgColor;
}
.nav {
  display: flex;
  text-align: center;
  font-size: 14px;
  box-sizing: border-box;
  background-color: $whiteColor;

  .nav-item {
    flex: 1;
    a {
      box-sizing: border-box;
      color: #333;
      display: block;
      padding: 10px 5px;
      width: 100%;
    }
  }
  .nav-item a.router-link-active {
    color: $themeColor;

    border-bottom: 2px solid $themeColor;
  }
}
.nav-content {
  background-color: $bgColor;
  margin-bottom: 55px;
}
</style>