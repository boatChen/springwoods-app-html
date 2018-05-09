<template>
  <div class="agri-loadmore-container"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="loadingDisabled"
    :infinite-scroll-distance="distance"    
    >
    <slot></slot>
     <p v-show="loading" class="page-infinite-loading">
        <mt-spinner type="snake"></mt-spinner>
        {{message}}
      </p>
  </div>
</template>

<script>
/** 下拉加载更多组件 依赖minu-ui Infinite scroll */
/**@augments distance 当其底部与被滚动元素底部的距离小于给定的阈值 */
/**@augments loadingDisabled 若为真，则无限滚动不会被触发 */
/**@augments total 总页数 */
/**@augments begin 开始页 */
/**@augments loading 展示加载提示 */
/**@augments pullMessage 下拉加载提示文字 */
import Vue from "vue";
import { InfiniteScroll, Spinner } from "mint-ui";
Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);
export default {
  props: {
    distance: {
      type: Number,
      default: 0
    },
    pullMessage: {
      type: String,
      default: "正在加载中..."
    },
    total: {
      type: Number,
      default: 0
    },
    begin: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      message: this.pullMessage,
      beginPage: this.begin,
      loadingDisabled: false,
      loading: false
    };
  },
  methods: {
    loadMore() {
      if (this.loadingDisabled) {
        return;
      }
      this.loading = true;
      if (this.beginPage <= this.total) {
        this.$emit("loadMore");
        this.beginPage++;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      } else {
        this.message = "我是有底线的...";
        this.loadingDisabled = true;
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      }
    }
  }
};
</script>

<style lang="scss">
.page-infinite-loading {
  text-align: center;
  div {
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }
}
</style>
