<template>
    <div class="scrap">
        <ag-header title="报废"></ag-header>
        <ag-navbar>
            <ag-navbar-item to="/Scrap/scrapdata">报废数据</ag-navbar-item>
            <ag-navbar-item to="/Scrap/scraprecord">报废记录</ag-navbar-item>
        </ag-navbar>
        <div class="nav-content">
          <transition :name="transitionName" mode="out-in">
            <router-view class="child-view"></router-view>
          </transition>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import { Toast } from "mint-ui";
import AgHeader from "@/components/Header";
import AgNavbar from "@/components/common/AgriNavbar";
import AgNavbarItem from "@/components/common/AgriNavbarItem";

export default {
  components: {
    AgHeader,
    AgNavbar,
    AgNavbarItem
  },
  data() {
    return {
      selected: "scrapdata",
      transitionName: ""
    };
  },
  methods: {
    navhandle(val) {
      if (val === "scrapdata") {
        this.$route.replace("/Scrap");
      } else if (val === "scraprecord") {
        this.$route.replace("/Scrap/scraprecord");
      }
    }
  },
  watch: {
    $route(to, from) {
      // const toDepth = to.path.split("/")[1].length;
      // const fromDepth = from.path.split("/")[1].length;
      // this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      this.transitionName = toIndex > fromIndex ? "slide-right" : "slide-left";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../css/var.scss";
.scrap {
  background-color: $bgColor;
  .child-view {
  }
}
</style>
<style lang="scss">
@import "../css/var.scss";
.mint-navbar .mint-tab-item.is-selected {
  color: $themeColor;
  border-bottom-color: $themeColor;
}
</style>
