<template>
  <div>
    <div class="screen">
      <span class="time" @click="time('start')">{{sDateText}}</span><i>&nbsp;-&nbsp;</i>
      <span class="time" @click="time('end')">{{eDateText}}</span>
      <span class="type" :class="{pitchOn:isActive}" @click="clickType">筛选</span>
    </div>
    <div v-for="(values,indexs) in storageData">
        <span class="data-box-span">
            {{indexs}}
        </span>
        <div class="data-box-box" v-for="(value,index) in values">
            <ul class="ul-data">
                <li>
                    <i style="font-weight: bold;">{{value.planName}}</i>
                    <i>采收框数量：{{value.resourceCount}}</i>
                </li>
                <li>
                    <i>{{value.weight}}kg</i>
                    <i>操作人：{{value.submitter}}</i>
                </li>
            </ul>
            <span class="box-span"><i class="green">原因：</i>{{value.remark}}</span>
        </div>
    </div>
    <footer @click="selectWeight">
        总重：{{TotalWeight}}kg
    </footer>
    <WeightPopup :TotalWeight="TotalWeight" :batchWeight="batchWeight" :WeightPopup="WeightPopup" ref="weightpopup" :weightheader="weightheader"></WeightPopup>
    <mt-datetime-picker
      ref="picker"
      v-model="pickerVisible"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      :startDate="startDate"
      :endDate="endDate"
      @confirm="handleConfirm">
    </mt-datetime-picker>
    <SelectItems
        ref="selectitems"
        :slots="slots" 
        :popupVisible="popupVisible"
        @click="handleClick"
        @cancel="handleCancel"
        @change="handleChange">
    </SelectItems>
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
  queryPlace,
  queryPlacePlan
} from "@/fetch/api";

import SelectItems from '@/components/common/SelectItems'
import WeightPopup from '@/components/WeightPopup';

Vue.component(Picker.name, Picker);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);

var cDate = new Date();
var NowDate = moment(cDate).format("YYYY-MM-DD");
export default {
  components:{
    SelectItems,
    WeightPopup
  },
  data(){
    return {
      sDateText:'开始时间',
      eDateText:'结束时间',
      isActive:false,
      popupVisible:false,
      WeightPopup:false,
      pickerVisible:cDate,
      type:"",
      startDate:new Date(new Date().getFullYear() - 2, 0, 1),
      endDate:cDate,
      storageData:[],
      TotalWeight:0,
      batchWeight:"",
      plans:[],
      regiondata:[],
      batchno:"",

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
        }
      ],
      NowStartTime:"",
      NowEndTime:"",
      batchWeight:[],
      weightheader:[
        "批次","重量"
      ],
      dataList:[],
      areaid:"",
      batchNo:""
    }
  },
  computed: {
    opt: {
      get() {
          let area = '';
          if(this.areaid != ''){
              area += this.areaid
          }
        return {
          value: '4',
          batchno: this.batchNo,
          // batchno: "",
          startTime: this.NowStartTime,
          endTime: this.NowEndTime,
          area: area
        };
      },
      set() {}
    }
  },
  methods:{
    clickType() {
      this.popupVisible = true;
      this.selectPlace();
    },
    time(type) {
      this.type = type;
      this.$refs.picker.open();
    },
    selectIn() {
      this.storageData = {};
      this.TotalWeight = 0;
      this.batchWeight = [];
      console.log(this.opt);
      querySemiWarehouseRecord(this.opt).then(data => {
        if (data.data.resultCode == 1) {
          let datalist = data.data.basePageObj.dataList;
          let weightList = data.data.dataList;
          // console.log(datalist);
          this.TotalWeight = weightList.pop().total;
          let obj = {};
          datalist.forEach(item => {
            item.updationDate = item.updationDate.split(" ")[0];
            if (obj[item.updationDate]) {
              obj[item.updationDate].push(item);
            } else {
              obj[item.updationDate] = [item];
            }
          });
          weightList.forEach(item => {
            this.batchWeight.push(item);
          });
          // console.log(obj);
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
    //关闭重量详情弹窗
    clearWeight() {
        this.$refs.weightpopup.clearWeight();
    }, 
    handleClick() {
      // this.areaid = this.$refs.selectitems.getSlotValue(0);
      let plan = this.$refs.selectitems.getSlotValue(1);
      // console.log(this.dataList);
      for (let i = 0; i < this.dataList.length; i++) {
        const item = this.dataList[i];
        if (item.jihuamc == plan) {
          this.batchNo = item.picibianh;
        }
      }
      this.selectIn();
      this.isActive=true;
      this.popupVisible = false;
    },
    handleChange(obj) {
        let value = obj[0];
        let dapenval = obj[1];
        if(obj.length>2){
            let plan = obj[2];
            this.plans.forEach(p => {
                if(p.jihuamc==plan){
                    this.batchNo = p.picibianh;
                }
            });
        }
        let dapen = [];
        this.areaid = "";
        this.dapenid = "";
        this.regiondata.forEach(item => {
          if (item.names == value) {
            this.areaid = item.id;
          }
        });
        // this.$refs.selectitems.setSlotValues(1, dapen);
        queryPlacePlan({
          guishud: `${this.areaid}`
        }).then(res => {
          let result = res.data;
          if (result.resultCode == "1") {
            let datalist = result.basePageObj.dataList;
            this.dataList = datalist;
            this.plans = datalist;
            let plans = [];
            datalist.forEach(plan => {
              plans.push(plan.jihuamc);
            });
            this.$nextTick(() => {
              this.$refs.selectitems.setSlotValues(1, plans);
            });
          } else {
            Toast(result.resultMsg);
          }
        });
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
            this.selectIn(this.opt);
        }
      },
      handleCancel() {
        this.popupVisible = false;
      },
  },
  mounted(){
    this.selectIn();
  }
}
</script>
<style lang="scss" scoped>
  .screen {
    width: 97%;
    height: 34px;
    padding-top: 9px;
    padding-left: 7px;
    i {
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
  }
  .data-box-span{
    margin-bottom: 3px;
    color: #139993;
    font-weight: bold;
    margin-left:10px 
  }
  .data-box-box{
    padding-top: 5px;
    border-radius: 10px;
    background-color: #fff;
    font-size: 13px;
    overflow: auto;
    margin:10px 0;
    width: 96%;
    margin: 0 auto;
    margin-bottom: 10px;
  }
  .ul-data{
    width: 90%;
    margin: 0 auto;
    border-bottom: 1px #eee solid;
    li{
      height: 36px;
      line-height: 36px;
      i{
        width: 45%;
        display: block;
        float: left;
        padding-left: 8px;
        font-style: normal;
      }
    }
  }
  .box-span{
    width: 150px;
    height: 35px;
    line-height: 35px;
    float: right;
    text-align: center;
  }
  .green{
    color:#03a49a;
    font-style:normal;
    font-size: 13px;
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
    i {
      font-style: normal;
    }
    ul {
      li {
        width: 100%;
        /* height: 30px; */
        font-size: 14px;
        line-height: 30px;
        font-style: normal;
      }
    }
    .clear {
      text-align: right;
      i {
        margin-right: 10px;
      }
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
    .rightList{
      i {
        float: right;
        margin-right: 10px;
        margin-bottom: 20px;
      }
    }
  }
  // .pitchOn{
  //   background-color: #02bcae;
  //   color: #fff
  // }
  
</style>

