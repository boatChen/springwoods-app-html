<template>
  <main class="login">
    <div class="login-logo">
      <img src="../assets/icon.png" alt="春沐源" v-distribution>
    </div>
    <div class="form">
      <div class="form-control">
        <div class="form-label"><img class="icon-user" src="../assets/user.png" width="32" height="32"></div>
        <div ref="inputbox" class="form-input"><input type="text" ref="userinput" v-model="userid" v-autofocus placeholder="请扫描二维码登录"></div>
        <i @click="showScan" style="right: 0;width: 24px;height: 24px;" class="icon icon-scan"></i>
      </div>
        <agri-button @click="login">登录</agri-button>
    </div>
    <modal @close="close" @scanQRCode="scanQRCode" v-if="scan"></modal>
    <footer class="footer">出入库管理系统{{version}} <br>&copy;春沐源农业有限公司</footer>

  </main>
</template>

<script>
import Vue from "vue";
import { Toast } from "mint-ui";
import { fetchLogin } from "../fetch/api";
import AgriButton from "@/components/common/AgriButton";
import Modal from "@/components/Modal";
export default {
  components: {
    AgriButton,
    Modal
  },
  data() {
    return {
      scan: false,
      username: "",
      userid: "",
      version: ""
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
    login() {
      this.handleInput(this.userid);
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
          this.$router.push("/In/semistock");
        } else {
          Toast(obj.resultMsg);
          this.userid = "";
          this.username = "";
          this.isLogin = false;
        }
        this.$refs.userinput.blur();
      });
    },
    documentBind() {
      let _this = this;
      // 按了扫描枪
      document.onkeydown = function(even) {
        if (even.which == "0") {
          _this.$refs.userinput.focus();
        }
      };
    },
    beforeDestroy() {
      document.onkeydown = null;
    }
  },
  mounted() {
    this.documentBind();
    setTimeout(() => {
      try {
        let version = plus.runtime.version;
        this.version = "v" + version;
      } catch (error) {
        this.version = "";
      }
    }, 500);
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
              this.blur();
            }
          }, 100);
        };
        input.onkeydown = function() {
          el.focus();
        };
        input.onfocus = function(even) {
          setTimeout(() => {
            $this.$refs.inputbox.scrollIntoView(false);
          }, 200);

          even.currentTarget.select();
        };
      }
    },
    distribution: {
      inserted: function(el, pra, a) {
        let timeoutEvent = 0;
        let $this = a.context;
        el.ontouchstart = function() {
          timeoutEvent = setTimeout(() => {
            console.log(Vue.axios.defaults.baseURL);
            let baseUrl = Vue.axios.defaults.baseURL;
            if ("http://10.1.2.151/ctower-mall-c/" === baseUrl) {
              Vue.axios.defaults.baseURL =
                "http://agri.springwoods.com/ctower-mall-c/";
              sessionStorage.setItem("env", "pro");
              Toast("已切换到正式环境");
            } else {
              Vue.axios.defaults.baseURL = "http://10.1.2.151/ctower-mall-c/";
              Toast("已切换到测试环境");
              sessionStorage.setItem("env", "dev");
            }
          }, 5000);
        };
        el.ontouchend = function() {
          clearTimeout(timeoutEvent);
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/var.scss";
.login {
  height: 100%;
  min-height: 400px;
  background-color: $themeColor;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: $whiteColor;
  .login-logo,
  .form,
  .footer {
    flex: 1;
  }
  .login-logo {
    display: flex;
    align-items: center;
    flex: 2;
    img {
      border: 1px solid $whiteColor;
      border-radius: 50%;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    .form-control {
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid #ffffff;
      margin: 10px 0;
      position: relative;
      .form-label,
      .form-input {
        float: 1;
        input {
          vertical-align: middle;
          height: 32px;
          font-size: 16px;
          background-color: $themeColor;
          border: 0;
          outline: none;
          padding-left: 1rem;
          color: $whiteColor;
          caret-color: $whiteColor;
          &::-webkit-input-placeholder {
            color: $whiteColor;
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: column-reverse;
  }
}
</style>
<style>
.form .agri-button {
  border: 1px solid #fff;
}
</style>
