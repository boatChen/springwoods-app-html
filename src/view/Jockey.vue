<template>
    <div id="jockey">
        <!-- <FHeader :showLogo="true" />
        <div class="center-top">
            <div class="info">
                <span class="label">个人信息</span>
                <div class="list">
                    <div class="form-item">
                        <label class="from-label" for="">用户名：</label>
                        <label v-cloak for="">{{username}}</label>
                        <button class="toggle-btn" @click="exit">用户切换</button>
                    </div>
                    <p class="bb1"></p>
                    <div class="form-item">
                        <label class="from-label" for="">用户ID：</label>
                        <input ref="userinput" v-autofocus type="text" @focus.prevent="handleFocus" contenteditable placeholder="请扫描用户IC卡" class="input text" v-model="userid" />
                        <i @click="showScan" style="left: 82%;width: 24px;height: 24px;top: 22px;" class="icon icon-qrcode"></i>
                    </div>                    
                </div>
            </div>
        </div>
        <div style="height:250px;margin-top:20px">
            <span class="label">个人操作</span>
            <div class="list" v-if="isLogin">
                <router-link to="/In">
                    <div class="item">
                        <img width="48" src="../assets/in.png" alt="">
                        <p>入库</p>
                    </div>
                </router-link>
                <router-link to="/Out">
                    <div class="item">
                        <img width="48" src="../assets/out.png" alt="">
                        <p>出库</p>
                    </div>
                </router-link>
                <router-link to="/Packing">
                    <div class="item">
                        <img width="48" src="../assets/packing.png" alt="">
                        <p>装盒</p>
                    </div>
                </router-link>
                <router-link to="/AuditTable">
                
                    <div class="item">
                        <img width="48" src="../assets/review.png" alt="">
                        <p>审核</p>
                    </div>
                </router-link>
                <router-link to="/product">
                    <div class="item">
                        <img width="48" src="../assets/stock.png" alt="">
                        <p>产品管理</p>
                    </div>
                </router-link>
            </div>
            <div class="no-login" v-if="!isLogin">
                <p class="no-login-tip">请扫二维码登录!</p>
            </div>
        </div>
        <modal @close="close" @scanQRCode="scanQRCode" v-if="scan"></modal> -->
        <transition :name="transitionName" >
          <keep-alive include="audit">
            <router-view class="child-view" name='Home' style="position: absolute;"></router-view>      
          </keep-alive>      
        </transition>
        <mt-tabbar :fixed="true" v-model="selected">
          <router-link class="tab-item" to="/In/semistock">
            <mt-tab-item id="入库">
              <img slot="icon" src="../assets/in.png">
              入库
            </mt-tab-item>            
          </router-link>
          <router-link class="tab-item" to="/Out">
            <mt-tab-item id="出库">
              <img slot="icon" src="../assets/out.png">
                出库
            </mt-tab-item>
          </router-link>
          <router-link class="tab-item" to="/Packing">
            <mt-tab-item id="装盒">
              <img slot="icon" src="../assets/packing.png">
              装盒
            </mt-tab-item>
          </router-link>
          <router-link class="tab-item" to="/AuditTable">
          <mt-tab-item id="审核">
            <img slot="icon" src="../assets/review.png">
            审核
          </mt-tab-item>
          </router-link>
          <router-link class="tab-item" to="/Product">
          <mt-tab-item id="产品管理">
            <img slot="icon" src="../assets/stock.png">
            产品管理
          </mt-tab-item>
          </router-link>
        </mt-tabbar>
    </div>
</template>

<script>
import Vue from "vue";
import { fetchLogin } from "../fetch/api";
import { animation } from "@/utils/routerAnima";
import { Toast, Tabbar, TabItem } from "mint-ui";
import axios from "axios";
import FHeader from "@/components/Header";
import Modal from "@/components/Modal";
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
export default {
  components: {
    FHeader,
    Modal
  },
  data() {
    return {
      transitionName: "scale-left",
      username: "",
      userid: "",
      selected: "入库",
      isLogin: false,
      role: "",
      showLogo: true,
      scan: false
    };
  },
  methods: {
    showScan() {
      this.scan = true;
    },
    close() {
      this.scan = false;
    },
    scanQRCode(value) {
      this.handleInput(value.split(":")[1]);
      this.scan = false;
    },
    handleInput(code) {
      fetchLogin({
        id: code
      }).then(data => {
        let obj = data.data;
        if (obj.resultCode == "1") {
          sessionStorage.setItem("token", obj.resultObj.loginedtoken);
          this.username = obj.resultObj.opername;
          sessionStorage.setItem("id", code);
          sessionStorage.setItem("username", this.username);
          this.isLogin = true;
          this.userid = code;
        } else {
          Toast(obj.resultMsg);
          this.userid = "";
          this.username = "";
          this.isLogin = false;
        }
        this.$refs.userinput.blur();
        // Indicator.close();
      });
    },
    handleFocus(even) {
      even.currentTarget.select();
    },
    exit() {
      this.userid = "";
      this.username = "";
      this.isLogin = false;
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("token");
      this.$refs.userinput.focus();
    },
    documentBind() {
      let _this = this;
      // 按了扫描枪
      document.onkeydown = function(even) {
        if (even.which == "0") {
          _this.$refs.userinput.focus();
        }
      };
    }
  },
  directives: {
    autofocus: {
      inserted: function(el, pra, vnode) {
        let $this = vnode.context;
        let input = el;
        let timeoutEvent = 0;
        input.onkeyup = function(even) {
          clearTimeout(timeoutEvent);
          timeoutEvent = setTimeout(() => {
            let reg = /^user:(\d{1,}$)/; // 正则 以user: 开头 数字结尾
            let result = this.value.trim().match(reg);
            if (result != null) {
              let value = result[1];
              console.log(value);
              value = value;
              this.value = value;
              //储存id，给后面页面判断
              sessionStorage.setItem("id", value);
              $this.handleInput(value);
            }
            this.blur();
          }, 100);
        };
        input.onkeydown = function() {
          el.focus();
        };
        input.onfocus = function(even) {
          even.currentTarget.select();
        };
      }
    }
  },
  mounted() {
    this.documentBind();
    let userid = sessionStorage.getItem("id");
    if (userid == "" || userid == null) {
      this.isLogin = false;
    } else {
      this.userid = userid;
      this.isLogin = true;
    }
    this.username = sessionStorage.getItem("username");
    sessionStorage.removeItem("role");
  },
  watch: {
    $route(to, from) {
      // const toDepth = to.path.split("/")[1].length;
      // const fromDepth = from.path.split("/")[1].length;
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      this.transitionName = animation(to, from);
      // this.transitionName = toIndex > fromIndex ? "slide-right" : "slide-left";
      // this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
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
<style lang="scss" scoped>
@import "../css/var.scss";

.child-view {
  min-height: 100%;
  margin-bottom: 55px;
}
.tab-item {
  flex: 1;
}
.router-link-active {
  background-color: #eaeaea;
  color: $themeColor;
}
</style>