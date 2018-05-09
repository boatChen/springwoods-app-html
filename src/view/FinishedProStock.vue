<template>
  <div class="finished-pro">
    <FHeader title="成品当前库存"/>
    <div class="filter-box">
      <agri-input @focus="planFocus" placeholder="选择批次" v-model="plan" :readonly="true"/>
      <agri-input @focus="proFocus" placeholder="选择产品名称" v-model="proName" :readonly="true"/>
    </div>
    <div class="item-box">
      <agri-load-more
        :total="total"
        :begin="beginPage"

        @loadMore="loadMore"
      >
        <card-item v-for="(item,index) in dataList" :key="index"
          :value="item.id"
          :topLeft="item.planName"
          topLeftClass="bold"
          :cLeft="item.packingType"
          :cRight="item.materialCode"
          :bLeft="item.specifications"
          :bRight="'数量：'+item.currentQuantity"
          :checked="true"
          @stepperChange="stepperChange"
          @change="change"
        ></card-item>
      </agri-load-more>
    </div>
    <footer @click="selectOut" class="footer">
      确认出库
    </footer>
     <select-items 
          ref="selectItems"
          :slots="slots" 
          :popupVisible="popupVisible"
          @cancel="handleCancel"
          @click="handleClick"
          >
        </select-items>
        <select-items 
          ref="proSelectItems"
          :slots="proSlots" 
          :popupVisible="proPopupVisible"
          @cancel="handleCancel"
          @click="proHandleClick"
          >
        </select-items>
  </div>
</template>

<script>
import { Toast } from "mint-ui";

import FHeader from "@/components/Header";
import selectItems from "@/components/common/SelectItems";
import CardItem from "@/components/CardItem";
import AgriInput from "@/components/common/AgriInput";
import AgriLoadMore from "@/components/common/AgriLoadMore";
import { queryFinishedStockInfoList, finishedOut } from "@/fetch/api.js";
export default {
  components: {
    FHeader,
    selectItems,
    CardItem,
    AgriInput,
    AgriLoadMore
  },
  data() {
    return {
      dataList: [],
      beginPage: 1,
      pageSize: 10,
      plans: [],
      plan: "",
      products: [],
      proName: "",
      popupVisible: false,
      proPopupVisible: false,
      total: 1,
      param: {},

      loadingDisabled: false
    };
  },
  methods: {
    fetchDataList(clear) {
      console.log(this.batchno);
      queryFinishedStockInfoList({
        beginPage: this.beginPage,
        pageSize: this.pageSize,
        packingtype: this.proName,
        batchno: this.batchno
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let datalist = result.basePageObj.dataList;
          this.total = result.basePageObj.totalPages;
          if (clear) {
            this.dataList = [];
          }
          datalist.forEach(item => {
            this.dataList.push(item);
            if (this.plans.indexOf(item.planName) == -1) {
              this.plans.push(item.planName);
            }
            if (this.products.indexOf(item.packingType) == -1) {
              this.products.push(item.packingType);
            }
          });
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    handleClick(val) {
      this.plan = val;
      this.popupVisible = false;
      this.fetchDataList(true);
    },
    proHandleClick(val) {
      this.proName = val;
      this.proPopupVisible = false;
      this.fetchDataList(true);
    },
    handleCancel() {
      this.popupVisible = false;
      this.proPopupVisible = false;
    },
    planFocus() {
      this.$refs.selectItems.setSlotValue(0, this.plan);
      this.popupVisible = true;
    },
    proFocus() {
      this.$refs.proSelectItems.setSlotValue(0, this.proName);
      this.proPopupVisible = true;
    },
    /**计步器数值改变 */
    stepperChange(id, val) {
      this.param[id].outQuantity = parseInt(val);
    },
    /** 选择出库 */
    selectOut() {
      let param = [];
      for (const key in this.param) {
        if (this.param.hasOwnProperty(key)) {
          const item = this.param[key];
          param.push(item);
        }
      }
      let str = JSON.stringify(param);

      finishedOut({
        param: str
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          Toast(result.resultMsg);
          this.dataList = [];
          this.fetchDataList();
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    /** 选择切换 */
    change(check, id) {
      if (check) {
        let num = this.getNum(id);
        this.param[id] = { id: id, outQuantity: num };
      } else {
        delete this.param[id];
      }
      console.log(this.param);
    },
    getNum(id) {
      for (let i = 0; i < this.dataList.length; i++) {
        const item = this.dataList[i];
        if (item.id == id) {
          return item.currentQuantity;
        }
      }
    },
    loadMore() {
      this.fetchDataList();
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
    proSlots() {
      return [
        {
          flex: 1,
          values: this.products,
          className: "slot1",
          textAlign: "center"
        }
      ];
    },
    batchno() {
      for (let i = 0; i < this.dataList.length; i++) {
        const item = this.dataList[i];
        console.log(item);
        if (item.planName == this.plan) {
          return item.batchNo;
        }
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/var.scss";
.finished-pro {
  height: 100%;
  background-color: $bgColor;
  .item-box {
    background-color: $bgColor;
    margin-bottom: $navHeight;
  }

  .footer {
    width: 100%;
    height: $navHeight;
    background-color: $themeColor;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    line-height: $navHeight;
    font-size: $navFontSize;
    color: $whiteColor;
  }
}
.filter-box {
  margin-top: 5px;
  display: flex;
  > input:first-child {
    margin-right: 2px;
  }
}
.item-box {
  padding-top: 5px;
}
</style>
<style lang="scss">
.bold {
  font-weight: bold;
}
</style>

