<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive include="audit">
        <router-view class="child-view" name='Home' style="position: absolute;"></router-view>      
       </keep-alive>      
    </transition>
  </div>
</template>

<script>
import {animation} from "@/utils/routerAnima";
var viewport = document.getElementById("viewport");
if (parseInt(getViewportSize().height) < 430) {
  viewport.content = "width=device-width,initial-scale=0.8,user-scalable=0";
} else {
  viewport.content = "width=device-width,initial-scale=1.0,user-scalable=0";
}

function getViewportSize() {
  return {
    width:
      window.innerWidth ||
      document.documentElement.clientWidth ||
      screen.width ||
      document.body.clientWidth,
    height: screen.height
  };
}
export default {
  name: "App",
  data() {
    return {
      transitionName: ""
    };
  },
  mounted() {},
  watch: {
    $route(to, from) {
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;      
      this.transitionName = animation(to, from);
      // console.log(
      //   "现在路由:",
      //   toIndex,
      //   "来自路由:",
      //   fromIndex,
      //   "现在的动画:",
      //   this.transitionName
      // );
    }
  }
};
</script>

<style lang="scss">
$tran: 60px;
@import "css/currency.css";
#app {
  height: 100%;
}
.child-view {
  width: 100%;
  height: 100%;
  transition: all 0.4s ease-out;
}
.slide-left-enter,
.slide-right-leave-active {
  // opacity: 1;
  // -webkit-transform: translate(100%, 0);
  // transform: translate(100%, 0);
  -webkit-transform:translate3d(100%,0,0);
  transform:translate3d(100%,0,0)
}
.slide-left-leave-active,
.slide-right-enter {
  // opacity: 1;
  // // -webkit-transform: translate(-$tran, 0);
  // -webkit-transform: translate(-100%, 0);
  // // transform: translate(-$tran, 0);
  // transform: translate(-100%, 0);
  -webkit-transform:translate3d(-100%,0,0);
  transform:translate3d(-100%,0,0)
}
$scale: 1.1;
.scale-left-enter,
.scale-right-leave-active {
  opacity: 0;
  transform: scale($scale);
}
.scale-left-leave-active,
.scale-right-enter {
  // opacity: 0;
  transform: scale($scale);
}
</style>
