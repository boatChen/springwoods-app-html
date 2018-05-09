<template>
  <div class="scrap-data">
    <div class="input-box">
      <i @click="showScan" class="icon icon-qrcode tubiao"></i>
      <input ref="input" v-model="search" v-autofocus type="text" class="search" placeholder="搜索">
    </div>
    <section class="resource-box">
      <section class="resource-item" v-for="(item,index) in dataList" :key="index">
        <section class="resource resource-name">
          {{item.resourceName}}
        </section>
        <section class="resource resource-pici">{{item.planName}}</section>
        <section class="resource resource-weight">{{item.harvest}}kg</section>
      </section>      
    </section>
    <section class="btn-box">
        <agri-button @click="handleClick" type="green">转报废申请单</agri-button>
      </section>
    <select-items
     :slots="slots" 
     :popupVisible="planShow"
     @cancel="cancel"
     @click="confirm"
     ref="picker"
     >
    </select-items>
    <modal @close="close" @scanQRCode="scanQRCode" v-if="scan"></modal>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import Modal from "@/components/Modal";
import AgriButton from "@/components/common/AgriButton";
import SelectItems from "@/components/common/SelectItems";
import {
  fetchResource,
  fetchCount,
  calculateGrossweight,
  queryReEntrySemiFinishedStockDetail
} from "@/fetch/api";
export default {
  components: {
    Modal,
    AgriButton,
    SelectItems
  },
  data() {
    return {
      scan: false,
      search: "",
      plans: [],
      dataList: [],
      planShow: false
    };
  },
  methods: {
    eventBing() {
      let $this = this;
      document.onkeydown = function(e) {
        $this.$refs.input.focus();
      };
    },
    /** 扫描待入库数据 */
    fetchResource(id) {
      fetchResource({
        resourceid: id,
        entryType: 2
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let obj = result.resultObj;
          obj.weight = obj.harvest;
          obj.piCiBianH = obj.planCode;
          this.dataList.unshift(obj);
          if (this.plans.indexOf(obj.planName) == -1) {
            this.plans.push(obj.planName);
          }
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    handleClick() {
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
    confirm() {
      this.calculateGrossweight();
    },
    /**统计总重 */
    calculateGrossweight() {
      calculateGrossweight({
        level: 0,
        entryType: 2,
        batchNo: this.batchNo
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let obj = result.resultObj;
          this.$router.push({
            path: "/scrapapp",
            query: {
              item: obj
            }
          });
          this.eventUnBing();
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    request() {
      queryReEntrySemiFinishedStockDetail({
        isReentry: 2
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          let obj = _data.resultObj;
          if (obj != null) {
            this.dataList = [];
            obj.forEach((item, index) => {
              this.dataList.push({
                id: item.id,
                resourceid: item.resourceId,
                piCiBianH: item.batchno,
                productName: item.productname,
                planName: item.planName,
                harvest: item.weight,
                resourceName: item.resourceName,
                liablePerson: item.collectman,
                opername: item.submitter,
                storageTime: item.entrytime,
                taskId: item.subtaskid
              });
              if (this.plans.indexOf(item.planName) == -1) {
                this.plans.push(item.planName);
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
    },
    cancel() {
      this.planShow = false;
    },
    scanQRCode(result) {
      this.fetchResource(result.split(":")[1]);
      this.close();
    },
    showScan() {
      this.scan = true;
    },
    close() {
      this.scan = false;
    },
    eventUnBing() {
      document.onkeydown = null;
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
              $this.fetchResource(suff);
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
          return item.piCiBianH;
        }
      }
      return "";
    }
  },
  mounted() {
    this.eventBing();
    this.request();
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
  font-size: 14px;
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
</style>
