<template>
  <div id="restock"> 
      <section class="main">
        <div class="resource-box">
          <card-item v-for="(item,key) in resources" :key="key" 
          :topLeft="item.resourceName" 
          :topRight="item.weight+'kg'" 
          :bLeft="item.planName" 
          :bRight="(item.level == '1'? '好果':'B级果')" 
          :bRightClass="item.level==1? '': 'b-level'"
          ></card-item>
        </div> 
        
        <section class="btn-box">
          <agri-button @click="restock" type="green">转半成品再入库申请单</agri-button>
          <!-- <button @click="restock" class="btn-primary">
            转半成品再入库申请单
          </button> -->
        </section>
      </section>
       <mt-popup :closeOnClickModal="closeOnClickModal" class="pop" v-model="popupVisible" position="bottom">
            <mt-picker  @change="onChange" :show-toolbar="showToolbar" ref="planPicker" :slots="slots">
                <section class="toolbar">
                  <button @click="handleCancel">取消</button>
                    <span>选择批次和果级别</span>            
                  <button @click="handleClick">确定</button>
                </section>
            </mt-picker>
        </mt-popup>         
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, Field, Badge, Picker, Popup } from "mint-ui";
Vue.component(Picker.name, Picker);
Vue.component(Badge.name, Badge);
Vue.component(Popup.name, Popup);
Vue.component(Field.name, Field);
import FHeader from "@/components/Header";
import CardItem from "@/components/CardItem";
import AgriButton from "@/components/common/AgriButton";
import {
  queryReEntrySemiFinishedStockDetail,
  calculateGrossweight
} from "../fetch/api";
export default {
  components: {
    FHeader,
    CardItem,
    AgriButton
  },
  data() {
    return {
      showToolbar: true,
      popupVisible: false,
      closeOnClickModal: false,
      picis: {},
      levels: [],
      weight: "",
      resources: []
    };
  },
  computed: {
    slots() {
      return [
        {
          flex: 1,
          values: Object.keys(this.picis),
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center"
        }
      ];
    },
    item() {
      let plan = this.$refs.planPicker.getSlotValue(0);
      for (let index = 0; index < this.resources.length; index++) {
        const element = this.resources[index];
        if (element.planName == plan) {
          return element;
        }
      }
      return {};
    },
    level() {
      let level = this.$refs.planPicker.getSlotValue(1);
      return level == "好果" ? 1 : 2;
    }
  },
  methods: {
    onChange(picker, values) {
      picker.setSlotValues(1, this.picis[values[0]]);
    },
    restock() {
      console.log(this.picis);
      if (this.resources.length == 0) {
        Toast("当前没有采收框需要再次入库");
        return;
      }
      if (
        Object.keys(this.picis).length > 1 ||
        Object.values(this.picis).length
      ) {
        //入库批次是否有多个
        this.popupVisible = true;
      } else {
        this.calculateGrossweight(() => {
          this.$router.push({
            path: "/restockapp",
            query: {
              level: this.level,
              item: this.item,
              weight: this.weight
            }
          });
        });
      }
    },
    handleClick(leval) {
      this.popupVisible = false;
      this.calculateGrossweight(() => {
        this.$router.push({
          path: "/restockapp",
          query: {
            level: this.level,
            item: this.item,
            weight: this.weight
          }
        });
      });
    },
    handleCancel() {
      this.popupVisible2 = false;
      this.popupVisible = false;
    },
    /** 查看再入库详情 */
    queryReEntrySemiFinishedStockDetail() {
      queryReEntrySemiFinishedStockDetail({
        isReentry: 1
      }).then(res => {
        let data = res.data;
        if (data.resultCode === "1") {
          let datalist = data.resultObj;
          let picis = {};
          datalist.forEach(item => {
            let keys = Object.keys(picis);
            if (keys.indexOf(item.planName) == -1) {
              picis[item.planName] = [];
            }
            let level = item.level == 1 ? "好果" : "B级果";
            if (picis[item.planName].indexOf(level) == -1) {
              picis[item.planName].push(level);
            }
            this.resources.push(item);
          });
          this.picis = picis;
          this.$nextTick(() => {
            console.log(picis[Object.keys(picis)[0]]);
            this.$refs.planPicker.setSlotValues(
              1,
              picis[Object.keys(picis)[0]]
            );
          });
        } else {
          Toast({
            message: data.resultMsg
          });
        }
      });
    },
    /** 总计总重量 */
    calculateGrossweight(cb) {
      calculateGrossweight({
        batchNo: this.item.batchno,
        level: this.level,
        entryType: 1  //再入库
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let weight = result.resultObj.weight;
          this.weight = weight;
          cb();
        } else {
          Toast(result.resultMsg);
        }
      });
    }
  },
  mounted() {
    this.queryReEntrySemiFinishedStockDetail();
  }
};
</script>

<style lang="scss">
@import "../css/var.scss";
#restock {
  .main {
    .resource-box {
      padding: 10px 5px;
      text-align: center;
    }
    .level.b-level {
      color: #4caf50 !important;
    }
    .btn-box {
      padding: 5px;
    }
  }
  .pop {
    width: 100%;
    text-align: center;
    .toolbar {
      line-height: 40px;
      text-align: center;
      span {
        display: inline-block;
        font-size: 14px;
      }
      button {
        height: 40px;
        width: 100px;
        background-color: #fff;
        color: #333;
        border: 0;
        font-size: 14px;
      }
      button:last-child,
      button:first-child {
        position: absolute;
        top: 0;
        right: 5px;
      }
      button:first-child {
        left: 0;
      }
    }
  }
}
</style>
