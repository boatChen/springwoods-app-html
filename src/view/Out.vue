<template>
    <div class="out">
      <FHeader :title="title" :back="false" :showLogo="true"  />
        <div class="center">
          <div class="input-box">
            <i @click="showScan" class="icon icon-qrcode tubiao"></i>
            <input ref="input" class="search" v-autofocus type="text" v-model="num" placeholder="请扫描二维码">
          </div>            
            <h4 class="tou">*请确认采收框已出库，才能再进行此操作</h4>
            <span class="sub">采收框解绑信息</span>
            <div class="sub-box">
                <p v-cloak class="untie" v-for="item in outData">{{item}}</p>
            </div>
          <section class="footer">
            <agri-button type="green" @click="handleSubmit">完成</agri-button>            
          </section>
        </div>
         <modal @close="close" @scanQRCode="scanQRCode" v-if="scan"></modal>
    </div>  
</template>
<script>
import {
  querySemiFinishedOutScan,
  semiFinishedOut,
  semiFinishedOutScan,
  selectSemiFinishedStockDetail
} from "@/fetch/api";
import { Toast } from "mint-ui";
import FHeader from "@/components/Header";
import Modal from "@/components/Modal";
import AgriButton from "@/components/common/AgriButton";
export default {
  components: {
    FHeader,
    Modal,
    AgriButton
  },
  data() {
    return {
      outData: [],
      num: "",
      scan: false,
      title: sessionStorage.getItem('username')
    };
  },
  mounted() {
    this.eventBing();
    this.request();
  },
  methods: {
    showScan() {
      this.scan = true;
    },
    close() {
      this.scan = false;
    },
    scanQRCode(value) {
      this.SemiFinishedOutScan1(value.split(":")[1]);
      this.scan = false;
    },
    SemiFinishedOutScan1(resId) {
      semiFinishedOutScan({
        resourceId: resId
      }).then(
        function(data) {
          let _data = data.data;
          if (_data.resultCode == "1") {
            this.outData.push(_data.resultMsg);
          } else {
            Toast({
              message: _data.resultMsg
            });
          }
          this.num = "";
        }.bind(this)
      );
    },
    /* 查询扫描出库列表 */
    request() {
      querySemiFinishedOutScan().then(
        function(data) {
          let _data = data.data;
          if (_data.resultCode === "1") {
            let obj = _data.resultObj;

            for (const key in obj) {
              this.outData.push(obj[key]);
            }
          } else {
            Toast({
              message: _data.resultMsg,
              iconClass: "mintui mintui-error"
            });
          }
        }.bind(this)
      );
    },

    handleSubmit() {
      semiFinishedOut().then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          Toast({
            message: _data.resultMsg,
            iconClass: "mintui mintui-success"
          });
          this.outData = [];
        } else {
          Toast({
            message: _data.resultMsg,
            iconClass: "mintui mintui-error"
          });
        }
      });
    },
    eventBing() {
      let $this = this;
      document.onkeydown = function(e) {
        $this.$refs.input.focus();
      };
    }
  },
  directives: {
    /* 自动获取焦点 */
    autofocus: {
      inserted: function(el, pra, vnode) {
        let $this = vnode.context;
        let timeoutEvent = 0;
        el.onkeydown = function() {
          el.focus();
        };
        el.onkeyup = function() {
          clearTimeout(timeoutEvent);
          timeoutEvent = setTimeout(() => {
            let value = this.value.trim();
            let reg = /^id:(\d{1,})$/;
            let result = value.match(reg);
            if (result != null) {
              let num = result[1];
              this.value = value;
              console.log($this);
              $this.SemiFinishedOutScan1(num);
            }
            this.blur();
          }, 100);
        };
        el.onfocus = function(even) {
          even.currentTarget.select();
        };
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../css/var.scss";

.tou {
  color: $redColor;
}
.center {
  width: 100%;
  text-align: center;
  margin-bottom: 55px;
  background-color: $whiteColor;
}

.sub {
  text-align: center;
  font-size: 18px;
  margin: 5px 0 5px 0;
}

.sub-box {
  width: 99%;
  height: 300px;
  border: 2px solid #ccc;
  overflow: auto;
}

.footer {
  padding: 0 5px;
  box-sizing: border-box;
}
.untie {
  font-size: 16px;
  padding: 2px;
  padding-left: 10px;
}
</style>