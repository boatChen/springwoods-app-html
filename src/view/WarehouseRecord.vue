<template>
    <div>
        <FHeader title="半成品出入库记录"/>
        <div>
            <mt-navbar v-model="selected">
            <mt-tab-item id="1">首入库</mt-tab-item>
            <mt-tab-item id="2">再入库</mt-tab-item>
            <mt-tab-item id="3">出库</mt-tab-item>
            </mt-navbar>
        </div>
        <div class="center">
            <div class="screen">
                <span class="time" @click="time('start')">{{sDateText}}</span><i>&nbsp;-&nbsp;</i>
                <span class="time" @click="time('end')">{{eDateText}}</span>
                <span class="type" :class="{pitchOn:isActive}" @click="clickType">筛选</span>
            </div>
            <!-- tab-container -->
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <WareHouseItem class="data-box" 
                        v-for="(items,indexs) in storageData" 
                        :key="indexs" 
                        :date="indexs" 
                        :data="items" 
                        :status="status" 
                        :zhuangtai="zhuangtai"
                        :people="people"
                        :hour="hour"></WareHouseItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <WareHouseItem class="data-box" 
                        v-for="(items,indexs) in storageData" 
                        :key="indexs" 
                        :date="indexs" 
                        :data="items" 
                        :status="status" 
                        :zhuangtai="zhuangtai"
                        :people="people"
                        :hour="hour"></WareHouseItem>
                </mt-tab-container-item>
                <mt-tab-container-item id="3">
                    <WareHouseItem class="data-box" 
                        v-for="(items,indexs) in storageData" 
                        :key="indexs" 
                        :date="indexs" 
                        :data="items" 
                        :status="status" 
                        :zhuangtai="zhuangtai"
                        :people="people"
                        :hour="hour"></WareHouseItem>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <footer @click="selectWeight">
            总重：{{TotalWeight}}kg
        </footer>
        <weightpopup :TotalWeight="TotalWeight" :batchWeight="batchWeight" :WeightPopup="WeightPopup" ref="weightpopup" :weightheader="weightheader"></weightpopup>
        <mt-datetime-picker
            ref="picker"
            v-model="pickerVisible"
            type="date"
            year-format="{value}年"
            month-format="{value}月"
            date-format="{value}日"
            @confirm="handleConfirm"
            :startDate="startDate"
            :endDate="endDate">
        </mt-datetime-picker>
        <SelectItems
            ref="selectitems"
            :slots="slots" 
            :popupVisible="popupVisible"
            @click="handleClick"
            @cancel="handleCancel"
            @change="handleChange">
        </SelectItems>
        <mt-picker :slots="slots" @change="onValuesChange" class="picker" v-if="batchPopup"></mt-picker>
    </div>
</template>
<script>
import moment from "moment";
import Vue from "vue";
import {
  Toast,
  Picker,
  DatetimePicker,
  Actionsheet,
  Navbar,
  TabItem
} from "mint-ui";
import {
  querySemiWarehouseRecord,
  queryWarehouseRecord,
  queryPlace,
  queryPlacePlan
} from "../fetch/api";

import FHeader from "@/components/Header";
import WareHouseItem from "@/components/WareHouseItem";
import SelectItems from "@/components/common/SelectItems";
import weightpopup from "@/components/WeightPopup"
Vue.component(Picker.name, Picker);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);

var cDate = new Date();
var NowDate = moment(cDate).format("YYYY-MM-DD");
export default {
  components: {
    FHeader,
    Picker,
    WareHouseItem,
    SelectItems,
    weightpopup
  },
  data() {
    return {
      WeightPopup: false,
      batchPopup: false,
      popupVisible: false,
      isActive:false,
      selected: "1",
      regiondata: [],
      slots: [
        {
          flex: 1,
          values: [],
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
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: [],
          className: "slot5",
          textAlign: "center"
        }
      ],
      sheetVisible: false,
      type: "",
      TotalWeight: 0,
      batchWeight: [],
      pickerVisible: cDate,
      startDate: new Date(new Date().getFullYear() - 2, 0, 1),
      endDate: cDate,
      sDateText: "开始时间",
      eDateText: "结束时间",

      storageData: {},
      status: "首入库",
      zhuangtai: "入库：",
      people: "入库人",
      hour: "入库时间：",
      showToolbar: true,
      areaid: "",
      dapenid: "",
      batchno: '',
      plans: [],
      NowStartTime:'',
      NowEndTime:'',
      record:0,

      weightheader:[
        "批次","重量"
      ]
    };
  },
  computed: {
    opt: {
      get() {
          let area = '';
          if(this.areaid != ''){
              area += this.areaid
          }
          if(this.dapenid!= ''){
              area+='/'+this.dapenid
          }
        return {
          value: this.record,
          batchno: this.batchno,
          startTime: this.NowStartTime,
          endTime: this.NowEndTime,
          area: area
        };
      },
      set() {}
    }
  },
  watch: {
    selected: function() {
      this.isActive=false;
      if (this.selected == "1") {
        this.status = "首入库";
        this.zhuangtai = "入库：";
        this.people = "入库人";
        this.hour = "入库时间：";
        this.record = 0;
        this.selectIn();
      } else if (this.selected == "2") {
        this.status = "再入库";
        this.zhuangtai = "入库：";
        this.people = "入库人";
        this.hour = "入库时间：";
        this.record = 1;
        this.selectIn();
      } else if (this.selected == "3") {
        this.status = "出库";
        this.zhuangtai = "出库：";
        this.people = "出库人";
        this.hour = "出库时间：";
        this.record = 2;
        this.selectIn();
      }
    }
  },
  methods: {
    handleChange(obj) {
      let value = obj[0];
      let dapenval = obj[1];
      if(obj.length>2){
          let plan = obj[2];
          this.plans.forEach(p => {
              if(p.jihuamc==plan){
                  this.batchno = p.picibianh;
              }
          });
      }
      let dapen = [];
      this.areaid = "";
      this.dapenid = "";
      this.regiondata.forEach(item => {
        if (item.names == value) {
          this.areaid = item.id;
          item.subItem.forEach(dp => {
            if (dp.names == dapenval) {
              this.dapenid = dp.id;
            }
            dapen.push(dp.names);
          });
        }
      });
      this.$refs.selectitems.setSlotValues(1, dapen);
      queryPlacePlan({
        guishud: `${this.areaid}/${this.dapenid}`
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let datalist = result.basePageObj.dataList;
          this.plans = datalist;
          let plans = [];
          datalist.forEach(plan => {
            plans.push(plan.jihuamc);
          });
          this.$nextTick(() => {
            this.$refs.selectitems.setSlotValues(2, plans);
          });
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    handleClick() {
      this.selectIn();
      this.isActive=true;
    //   querySemiWarehouseRecord(this.opt.value).then(res => {
    //     let result = res.data;
    //     if (result.resultCode == "1") {

    //     } else {
    //       Toast(result.resultMsg);
    //     }
    //   });
      this.popupVisible = false;
    },
    handleCancel() {
      this.popupVisible = false;
    },
    clickType() {
      this.popupVisible = true;
      this.selectPlace();
    },
    time(type) {
      this.type = type;
      this.$refs.picker.open();
    },
    handleConfirm(data) {
      let date = moment(data).format("YYYY-MM-DD");
      if (this.type == "start") {
        if (this.eDateText != "结束时间") {
          let d = new Date(Date.parse(this.eDateText.replace(/-/g, "/")));
          if (data > d) {
            Toast("开始日期不能超过结束日期");
            // console.log('开始日期不能大于结束日期');
          } else {
            this.NowStartTime = date;
            this.sDateText = date;
          }
        } else {
          this.NowStartTime = date;
          this.sDateText = date;
        }
      } else if (this.type == "end") {
        if (this.sDateText != "开始时间") {
          let d = new Date(Date.parse(this.sDateText.replace(/-/g, "/")));
          if (data < d) {
            Toast("结束日期不能在开始日期前");
            // console.log('开始日期不能大于结束日期');
          } else {
            this.NowEndTime = date;
            this.eDateText = date;
          }
        } else {
          this.NowEndTime = date;
          this.eDateText = date;
        }
      }
      if (this.sDateText != "开始时间" && this.eDateText != "结束时间") {
        // if (this.opt.value == 0) {
          this.selectIn(this.opt);
        // } else if (this.opt.value == 1) {
          // this.selectOut(this.opt);
        // }
      }
    },
    selectIn() {
      this.storageData = {};
      this.TotalWeight = 0;
      this.batchWeight = [];
      let weightobj = [];
      querySemiWarehouseRecord(this.opt).then(data => {
        if (data.data.resultCode == 1) {
          let datalist = data.data.basePageObj.dataList;
          let weightList = data.data.dataList;
          this.TotalWeight = weightList.pop().total;
          let obj = {};
          datalist.forEach(item => {
            item.updationDate = item.updationDate.split(" ")[0];
            if (item.level == 1) {
              item["levelString"] = "好果";
            } else if (item.level == 2) {
              item["levelString"] = "B级果";
            }
            if (obj[item.updationDate]) {
              obj[item.updationDate].push(item);
            } else {
              obj[item.updationDate] = [item];
            }
          });
          weightList.forEach(item => {
              weightobj = [];
              weightobj.push(item.planName);
              weightobj.push(item.planNameTotal);
              this.batchWeight.push(weightobj);
          });
          this.$nextTick(() => {
            this.storageData = obj;
          });
        } else {
          Toast(this.opt.startTime+"-"+this.opt.endTime+" "+data.data.resultMsg);
        }
      });
    },
    selectWeight() {
      this.$refs.weightpopup.selectWeight();
    },
    clearWeight() {
      this.$refs.weightpopup.clearWeight();
    },
    selectPlace() {
      queryPlace().then(data => {
        if (data.data.resultCode == 1) {
          let datalist = data.data.resultObj;
          this.regiondata = datalist;
          let obj = [];
          datalist.forEach(items => {
            obj.push(items.names);
          });
          this.slots[0].values = obj;
        } else {
          Toast(data.data.resultMsg);
        }
      });
    }
  },
  mounted() {
    this.selectIn();
  }
};
</script>
<style scoped>
.child-view {
  background-color: #f2f2f2;
}
header {
  width: 100%;
  height: 55px;
  background-color: #03a49a;
  font-size: 20px;
  color: #fff;
  line-height: 55px;
  /* position: fixed;
			z-index: 100; */
}
header > span {
  /* width: 95%; */
  height: 100%;
  line-height: 55px;
  text-align: center;
}

.center {
  width: 100%;
  background-color: #f2f2f2;
  margin-bottom: 50px;
  /* position: relative;
			top: 60px; */
}

.screen {
  width: 97%;
  height: 34px;
  padding-top: 9px;
  padding-left: 7px;
}
.screen > i {
  float: left;
}
.type {
  width: 50px;
  display: block;
  height: 20px;
  line-height: 20px;
  border-radius: 5px;
  text-align: center;
  line-height: 20px;
  background-color: #fff;
  color: #9a9791;
  float: right;
  margin-right: 10px;
}

.time {
  float: left;
  display: block;
  width: 90px;
  height: 20px;
  border-radius: 5px;
  background-color: #fff;
  color: #9a9791;
  text-align: center;
  line-height: 20px;
  font-weight: bold;
}

.data {
  width: 100%;
}
.data-box {
  padding: 0 7px;
}

footer {
  width: 100%;
  height: 50px;
  color: #fff;
  background-color: #02bcae;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  position: fixed;
  bottom: 0;
}

.customPopup-box {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #000;
  filter: alpha(opacity=50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}
.customPopup {
  width: 90%;
  max-height: 50%;
  overflow: auto;
  background-color: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  margin: auto 0;
  left: 5%;
  z-index: 1000;
}
.customPopup > ul > li {
  width: 100%;
  /* height: 30px; */
  font-size: 14px;
  line-height: 30px;
  font-style: normal;
}
.customPopup i {
  font-style: normal;
}
.clear {
  text-align: right;
}
.clear > i {
  margin-right: 10px;
}
.centerList {
  overflow: hidden;
}
.centerList > i {
  width: 50%;
  display: block;
  float: left;
  text-align: center;
}
.green {
  color: #02bcae;
}
.pitchOn{
  background-color: #02bcae;
  color: #fff
}
.rightList{

}
.rightList > i {
  float: right;
  margin-right: 10px;
  margin-bottom: 20px;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 3px solid #02bcae;
  color: #02bcae;
  margin-bottom: -3px;
}
.picker {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
}
</style>

<style>
.picker-item {
  font-size: 14px;
}
</style>
