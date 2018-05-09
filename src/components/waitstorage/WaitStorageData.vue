<template>
  <div class="wait-storage-data">
     <div class="input-box">
      <i @click="showScan" class="icon icon-qrcode tubiao"></i>
      <input ref="input" v-model="search" v-autofocus type="text" class="search" placeholder="搜索">
    </div>
    <section class="resource-box">
      <section v-cloak class="resource-item" v-for="(item,index) in dataList" :key="index">
        <section class="resource resource-name">
          {{item.resourceName}}
        </section>
        <section class="resource resource-pici">{{item.planName}}</section>
        <section class="resource resource-weight">{{item.weight}}kg</section>
      </section>
       
    </section>
    <ag-button type="green" @click="submit">确定</ag-button>
    <select-items
     :slots="slots" 
     :popupVisible="planShow"
     @cancel="cancel"
     @click="confirm"
     ref="picker"
     >

    </select-items>
    <modal @close="close" @scanQRCode="scanQRCode" v-if="scan"></modal>
    <div class="model"  v-show="formShow">      
    </div>
    <div class="form-model" v-show="formShow">
      <div class="form">
        <div class="title">{{calc.planName}}</div>
        <div class="form-item">
          <div class="item">采收框数量：{{calc.resourceCount}}</div>
          <div class="item">重量：{{calc.weight}}kg</div>
        </div>
        <div class="form-item">
          <div class="item">操作人：{{user}}</div>
          <div class="item">日期：{{date}}</div>
          </div>
        <div class="form-item">
          <div class="item">待入库原因：<textarea v-model="remark" style="vertical-align: top;" rows="8" cols="20"></textarea></div>
        </div>
         <div class="form-item">
          <div class="item" style="margin-right: 10px;"><ag-button type="green" @click="formClick">确定</ag-button></div>
          <div class="item"><ag-button @click="formCancel" type="gray">取消</ag-button></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import {
  queryReEntrySemiFinishedStockDetail,
  fetchResource,
  calculateGrossweight,
  addTodoEntry
} from "@/fetch/api.js";
import AgButton from "@/components/common/AgriButton";
import SelectItems from "@/components/common/SelectItems";
import modal from "@/components/Modal";
export default {
  components: {
    AgButton,
    SelectItems,
    modal
  },
  data() {
    return {
      scan: false,
      search: "",
      dataList: [],
      plans: [],
      planShow: false,
      calc: {},
      formShow: false,
      user: sessionStorage.getItem("username"),
      date: "",
      remark: ""
    };
  },
  methods: {
    eventBing() {
      let $this = this;
      document.onkeydown = function(e) {
        $this.$refs.input.focus();
      };
    },
    eventUnBing() {
      document.onkeydown = null;
    },
    getResource(resourceid) {
      this.fetchResource(resourceid);
      console.log(this.dataList);
    },
    scanQRCode(result) {
      this.getResource(result.split(":")[1]);
      this.close();
    },
    showScan() {
      this.scan = true;
    },
    close() {
      this.scan = false;
    },
    formCancel() {
      this.formShow = false;
      this.eventBing();
    },
    formClick() {
      this.addTodoEntry();
      this.remark = '';
    },

    /** 查询待入库数据 */
    queryReEntrySemiFinishedStockDetail() {
      queryReEntrySemiFinishedStockDetail({
        isReentry: -1
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let datalist = result.resultObj;
          this.dataList = datalist;
          this.plans = [];
          datalist.forEach(item => {
            if (this.plans.indexOf(item.planName) == -1) {
              this.plans.push(item.planName);
            }
          });
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    /** 扫描待入库数据 */
    fetchResource(id) {
      fetchResource({
        resourceid: id,
        entryType: -1
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let obj = result.resultObj;
          obj.weight = obj.harvest;
          obj.batchno = obj.planCode;
          this.dataList.unshift(obj);
          if (this.plans.indexOf(obj.planName) == -1) {
            this.plans.push(obj.planName);
          }
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    /**统计总重 */
    calculateGrossweight() {
      calculateGrossweight({
        level: 0,
        entryType: -1,
        batchNo: this.batchNo
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let obj = result.resultObj;
          this.calc = obj;
          this.formShow = true;
          this.eventUnBing();
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    /** 新增待入库 */
    addTodoEntry() {
      addTodoEntry({
        batchno: this.batchNo,
        resourcecount: this.calc.resourceCount,
        weight: this.calc.weight,
        remarks: this.remark
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          Toast(result.resultMsg);
          this.formShow = false;
          this.queryReEntrySemiFinishedStockDetail();
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    /** 确定 */
    submit() {
      if (this.dataList.length == 0) {
        Toast("当前没有扫描采收框");
        return;
      }
      if (this.plans.length > 1) {
        this.planShow = true;
      } else {
        this.calculateGrossweight();
      }
    },
    cancel() {
      this.planShow = false;
    },
    confirm() {
      this.cancel();
      this.calculateGrossweight();
    }
  },
  computed: {
    slots() {
      return [
        {
          flex: 1,
          values: this.plans,
          className: "slot1",
          textAlign: "center"
        }
      ];
    },
    batchNo() {
      let plan = this.$refs.picker.getSlotValue(0);
      for (let i = 0; i < this.dataList.length; i++) {
        const item = this.dataList[i];
        if (item.planName == plan) {
          return item.batchno;
        }
      }
      return "";
    },
    plan() {
      return this.$refs.picker.getSlotValue(0);
    }
  },
  directives: {
    /* 自动获取焦点 */
    autofocus: {
      inserted: function(el, pra, vnode) {
        let timeoutEvent = 0;
        let index = 0;
        let $this = vnode.context;
        el.onkeydown = function() {
          el.focus();
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
    this.queryReEntrySemiFinishedStockDetail();
    let date = new Date();
    this.date = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}`;
  },
  beforeDestroy() {
    this.eventUnBing();
  }
};
</script>

<style lang="scss" scoped>
@import "../../css/var.scss";
.input-box {
  .search {
    background-color: $bgColor;
  }
}
section {
  box-sizing: border-box;
}
.resource-box {
  display: flex;
  flex-direction: column;
  padding: 5px;
  text-align: center;
  font-size: 12px;
  .resource-item {
    display: flex;
    align-items: center;
    background-color: $whiteColor;
    border-radius: $radius;
    margin-bottom: 5px;
    line-height: 45px;
  }
  .resource {
    flex: 1;
  }
}
.model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.8;
  z-index: 999;
}
.form-model {
  position: absolute;
  top: 10%;
  display: flex;
  flex-direction: column;
  // align-items: center;
  z-index: 1000;
  box-sizing: border-box;
  padding: 0 10px;
  width: 100%;
  .form {
    width: 100%;
    flex: 1;
    background: $whiteColor;
    .title {
      position: relative;
      padding: 5px 10px;
      font-size: 18px;
      &::before {
        content: "";
        display: block;
        height: 32px;
        width: 5px;
        background-color: $themeColor;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .form-item {
      flex: 1;
      margin-top: 10px;
      padding: 10px;
      display: flex;
      font-size: 16px;
      .item {
        flex: 1;
      }
      textarea {
        padding-left: 5px;
        padding-top: 5px;
        font-size: 16px;
      }
    }
  }
}
</style>
