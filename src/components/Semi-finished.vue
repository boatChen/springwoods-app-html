<template>
  <div class="semi">
    <div class="center">
      <div class="input-box">
          <i @click="showScan" class="icon icon-qrcode tubiao"></i>
          <input ref="semiInput" v-model="search" v-autofocus type="text" class="search" placeholder="搜索">
      </div>
      <div class="semi-finished-box">
        <card-item v-for="(item,key) in tableData" :key="key" :topLeft="item.resourceName" :topRight="item.harvest+'kg'" :bLeft="item.picibianhName" :bRight="item.storageTime | dateFormatter" :showDelete="true" @delete="handleDelete" :value="item"></card-item>
      </div>
    </div>
      <section class="btn-box">
        <agri-button @click="handleClick" type="green">{{btn}}</agri-button>
        <!-- <button  class="btn-primary">
          {{btn}}
        </button> -->
      </section>
    <mt-popup v-cloak class="pop" v-model="popupVisible" popup-transition="popup-fade">
        <div>
            <div class="title">
                请选择批次
            </div>
            <ul>
                <li class="pop-item" v-for="(pici,index) in batchNoList" @click="selectPiCi(pici)">{{pici.picibianhName}}</li>
            </ul>
        </div>
    </mt-popup>
    <modal @close="close" @scanQRCode="scanQRCode" v-if="scan"></modal>
  </div>
</template>

<script>
import {
  fetchResource,
  fetchCount,
  queryReEntrySemiFinishedStockDetail,
  deleteStockDetail
} from "@/fetch/api";
import Vue from "vue";
import { Toast, Navbar, TabItem } from "mint-ui";

import CardItem from "@/components/CardItem";
import Modal from "@/components/Modal";
import AgriButton from "@/components/common/AgriButton";
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
export default {
  components: {
    CardItem,
    Modal,
    AgriButton
  },
  filters: {
    dateFormatter(val) {
      return val.substring(5);
    }
  },
  data() {
    return {
      tableData: [],
      search: "",
      popupVisible: false,
      batchNoList: [],
      btn: "转半成品入库申请单",
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
      this.getResource(value.split(":")[1]);
      this.scan = false;
    },
    handleDelete(item) {
      deleteStockDetail({
        id: item.id
      }).then((res)=>{        
        if(res.data.resultCode == '1'){
            this.request();
        }else{
          Toast(res.data.resultMsg);
        }
      })
    },
    getResource(code) {
      if (!this.duplicateCheck(code)) {
        Toast("采收框重复扫描...", 3000);
        this.search = "";
        this.$refs.input.blur();
        return;
      }
      fetchResource({
        resourceid: code,
        entryType: 0 //首入库
      }).then(data => {
        let obj = data.data;
        let json = obj.resultObj;
        if (obj.resultCode == "1") {
          let picibh = json.planCode;
          if (this.checkPiCiBH(picibh)) {
            this.batchNoList.push({
              picibianhName: json.planName,
              batchNo: picibh
            });
          }
          this.tableData.unshift({
            resourceid: json.resourceId,
            piCiBianH: picibh,
            productName: json.produceName,
            picibianhName: json.planName,
            resourceName: json.resourceName,
            harvest: json.harvest,
            liablePerson: json.liablePerson,
            opername: json.submitter,
            storageTime: json.entryTime,
            taskId: json.subtaskId
          });
        } else {
          Toast({
            message: obj.resultMsg,
            iconClass: "mintui mintui-error"
          });
        }
      });
    },
    /** 检测采收框编号是否重复扫描 */
    duplicateCheck(code) {
      let flag = true;
      this.tableData.forEach(item => {
        if (item.resourceid == code) {
          flag = false;
        }
      });
      return flag;
    },
    /** 检查批次编号是否相同 */
    checkPiCiBH(picibh) {
      let flag = true;
      this.batchNoList.forEach(item => {
        if (item.batchNo == picibh) {
          flag = false;
        }
      });
      return flag;
    },
    handleClick() {
      if (this.batchNoList.length > 1) {
        this.popupVisible = true;
      } else if (this.batchNoList.length == 1) {
        let pici = this.batchNoList[0];
        this.summaryData(pici);
      } else {
        Toast("当前没有扫描采收框...");
      }
    },
    selectPiCi(pici) {
      this.popupVisible = false;
      this.summaryData(pici);
    },
    /** 获取汇总数据 */
    summaryData(pici) {
      console.log(pici);
      fetchCount({
        batchNo: pici.batchNo,
        entryType: 0
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          let obj = _data.resultObj;
          let json = {
            picibianh: obj.batchNo,
            picibianhName: obj.planName,
            totalWeight: obj.weight,
            productName: obj.productName,
            storageTime: obj.entryTime
          };
          sessionStorage.setItem("stock", JSON.stringify(json));
          // window.location = './shenqingdan.html';
          this.$router.push({ path: "/Apply" });
        } else {
          Toast(_data.resultMsg, 3000);
        }
      });
    },
    eventBing() {
      let $this = this;      
      setTimeout(() => {
        document.onkeydown = function(e) {          
          $this.$refs.semiInput.focus();
        };
      }, 1000);
    },
    request() {
      queryReEntrySemiFinishedStockDetail({
        isReentry: 0
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          let obj = _data.resultObj;
          if (obj != null) {
            this.tableData = [];
            obj.forEach((item, index) => {
              this.tableData.push({
                id: item.id,
                resourceid: item.resourceId,
                piCiBianH: item.batchno,
                productName: item.productname,
                picibianhName: item.planName,
                harvest: item.weight,
                resourceName: item.resourceName,
                liablePerson: item.collectman,
                opername: item.submitter,
                storageTime: item.entrytime,
                taskId: item.subtaskid
              });
              if (this.checkPiCiBH(item.batchno)) {
                this.batchNoList.push({
                  picibianhName: item.planName,
                  batchNo: item.batchno
                });
              }
            });
          }
        } else {
          Toast({
            message: _data.resultMsg,
            iconClass: "mintui mintui-error"
          });
        }
      });
    }
  },
  directives: {
    /* 自动获取焦点 */
    autofocus: {
      inserted: function(el, pra, vnode) {
        let timeoutEvent = 0;
        let index = 0;
        let $this = vnode.context;
        el.onkeydown = function(e) {
          console.log("input", e.which);
          clearTimeout(timeoutEvent);
        };
        el.onkeyup = function() {
          clearTimeout(timeoutEvent);
          timeoutEvent = setTimeout(() => {
            let value = this.value.trim();
            let reg = /^id:(\d+)$/;
            let result = value.match(reg);
            if (result != null) {
              let suff = result[1];
              this.value = suff;
              $this.getResource(suff);
            }
            this.value = "";
          }, 200);
          this.blur();
        };
        el.onfocus = function(even) {
          even.currentTarget.select();
          clearTimeout(timeoutEvent);
        };
      }
    }
  },
  mounted() {
    this.eventBing();
    this.request();
  },
  beforeDestroy() {
    document.onkeydown = null;
  }
};
</script>

<style scoped lang="scss">
@import "../css/var.scss";
.tubiao {
  left: 0;
  top: 5px;
  width: 24px;
  height: 24px;
}

.input-box {
  .search {
    background-color: $bgColor;
  }
}
.semi-finished-box {
  padding: 5px;
}

.pop-item {
  width: 100%;
  height: 30px;
}

.pop {
  width: 60%;
  border-radius: 6px;
}

.pop .title {
  height: 35px;
  font-size: 18px;
  color: #fff;
  background-color: #02a498;
  text-align: center;
  line-height: 35px;
}

.pop .pop-item {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #ccc;
}

.pop .pop-item:hover {
  background-color: #ccc;
}

.btn-box {
  padding: 5px;
}
</style>
