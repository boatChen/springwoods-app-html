<template>
   <header class="top">
      <div v-if="showLogo" class="img-logo">
          <img class="logo" src="@/assets/logo.png" alt="春沐源" v-distribution>
      </div>
      <div class="back" v-if="back">
        <img @click="clickBack" src="@/assets/left.png">
      </div>
      <div v-if="title!=null" class="title-box">
        <div class="title">{{title}}</div>
      </div>
       <div class="back toggle">
        <img @click="clickToggle" src="@/assets/toggle.png">
      </div>
  </header>
</template>
<script>
import { Toast,MessageBox } from "mint-ui";
import Vue from "vue";
export default {
  props: {
    showLogo: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: true,
    },
    title: String
  },
  data() {
    return {};
  },
  methods: {
    clickBack() {
      this.$router.back();
    },
    clickToggle(){
      MessageBox({
        title: '提示',
        message: '你是要更换账号吗？',
        showCancelButton: true
      }).then((result)=>{
        console.log(result);
        if(result=='cancel'){
          return;
        }
        this.$router.replace('/');
      })
    }
  },
  directives: {
    distribution: {
      inserted: function(el, pra, a) {
        let env = sessionStorage.getItem("env");
        if (env == null) {
          env = "pro";
        }
        let timeoutEvent = 0;
        let $this = a.context;
        el.ontouchstart = function() {
          timeoutEvent = setTimeout(() => {
            if (env == "dev") {
              console.log(Vue.axios.defaults.baseURL);
              Vue.axios.defaults.baseURL =
                "http://agri.springwoods.com/ctower-mall-c/";
              env = "pro";
              Toast("已切换到正式环境");
            } else {
              console.log(Vue.axios.defaults.baseURL);
              Vue.axios.defaults.baseURL = "http://10.1.2.151/ctower-mall-c/";
              env = "dev";
              Toast("已切换到测试环境");
            }
            sessionStorage.setItem("env", env);
          }, 500);
        };
        el.ontouchmove = function() {
          clearTimeout(timeoutEvent);
        };
        el.ontouchend = function() {
          clearTimeout(timeoutEvent);
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../css/var.scss";
.top {
  background-color: $themeColor;
  position: relative;
  line-height: 50px;
  padding-top: 20px;
  width: 100%;
  height: 50px;
  background-color: #02bcae;
}
.title-box {
  position: absolute;
  text-align: center;
  display: inline-block;
  width: 100%;
  top: 20px;
  left: 0;
  color: #fff;
  .title {
    font-size: 20px;
    line-height: 55px;
  }
}
.img-logo {
  position: absolute;
}
.logo {
  width: 80%;
  vertical-align: middle;
}
.back {
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
.back img,.toggle img {
  width: 24px;
  height: 24px;
  padding: 10px;
  /* left: 10px; */
  top: 5px;
  position: absolute;
  z-index: 999;
}
.toggle img{
  right: 2%;
}
</style>
