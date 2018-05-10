<template>
    <div>
        <FHeader title="成品出入库记录"/>
        <div>
            <mt-navbar v-model="selected">
            <mt-tab-item id="1">入库</mt-tab-item>
            <mt-tab-item id="2">出库</mt-tab-item>
            </mt-navbar>
        </div>
        <div class="center">
            <div class="screen">
                <span class="time" @click="time('start')">{{sDateText}}</span><i>&nbsp;-&nbsp;</i>
                <span class="time" @click="time('end')">{{eDateText}}</span>
                <span class="type" @click="clickType" :class="{pitchOn:isActive}">筛选</span>
            </div>
            <!-- tab-container -->
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                  <agri-load-more
                    :begin="beginPage"
                    :total="totalPage"
                    :pullMessage="pullMessage"
                    @loadMore="loadMore"
                    >
                    <WareHouseItem class="data-box" 
                        v-for="(items,indexs) in storageData" 
                        :key="indexs" 
                        :date.sync="indexs" 
                        :data.sync="items"
                        :status="status" 
                        :zhuangtai="zhuangtai"
                        :people="people"
                        :hour="hour"></WareHouseItem>
                  </agri-load-more>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                  <agri-load-more
                    :begin="beginPage"
                    :total="totalPage"
                    :pullMessage="pullMessage"
                    @loadMore="loadMore1"
                    >
                    <WareHouseItem class="data-box" 
                        v-for="(items,indexs) in storageData" 
                        :key="indexs" 
                        :date.sync="indexs" 
                        :data.sync="items" 
                        :status="status" 
                        :zhuangtai="zhuangtai"
                        :people="people"
                        :hour="hour"></WareHouseItem>
                  </agri-load-more>
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
            @cancel="handleCancel">
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
  queryWarehouseRecord,
  queryPlace,
  queryPlacePlan
} from "../fetch/api";

import FHeader from "@/components/Header";
import WareHouseItem from "@/components/WareHouseItem1";
import SelectItems from "@/components/common/SelectItems";
import weightpopup from "@/components/WeightPopup"
import AgriLoadMore from "@/components/common/AgriLoadMore"
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
    weightpopup,
    AgriLoadMore
  },
  data() {
    return {
      WeightPopup: false,//重量弹窗开启状态判断
      popupVisible: false,//批次选择控件弹窗开启状态判断
      isActive:false,//筛选按钮显示判断
      selected: "1",//"顶部选项卡"判断处于哪个选项卡
      type: "",//判断点击了开始时间按钮还是结束时间按钮

      TotalWeight: "0",//总重
      batchWeight: [],//批次重量详情
      pickerVisible: cDate,//时间控件默认显示当前日期
      startDate: new Date(new Date().getFullYear() - 2, 0, 1),//时间控件最小值显示两年前
      endDate: cDate,//时间控件最大值显示当前日期
      sDateText: "开始时间",//开始时间按钮显示文本
      eDateText: "结束时间",//结束时间按钮显示文本
      dataList: [],//出入库数据
      storageData: {},//出入库数据
      status: "入库",//数据标识
      zhuangtai: "入库：",//数据标识
      people: "入库人",//数据标识
      hour: "入库时间：",//数据标识
      plans: [],//批次选择组件的批次名
      packtypes: [],//批次选择组件的包装类型
      record: 0,//入库为0，出库为1
      packingtype:"",
      batchNo:"",
      beginPage: 1,
      pageSize: 10,
      totalPage: 1,
      pullMessage: "正在加载中",

      NowStartTime:"",//开始时间
      NowEndTime:"",//结束时间

      weightheader:[
        "产品名称","规格","数量","重量"
      ]
    };
  },
  computed: {
    opt: {
      get() {
        return {
          value:this.record,
          batchno: this.batchNo||"",
          startTime: this.NowStartTime,
          endTime: this.NowEndTime,
          packingtype:  this.packingtype,
          beginPage: this.beginPage,
          pageSize: this.pageSize
        };
      },
      set() {}
    },
    slots() {
      return [
        {
          flex: 1,
          values: this.plans,
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
          values: this.packtypes,
          className: "slot3",
          textAlign: "center"
        }
      ];
    },
  },
  watch: {
    //顶部选项卡变化时触发
    selected: function() {
      this.isActive=false;
      if (this.selected == "1") {
        this.status = "入库";
        this.zhuangtai = "入库：";
        this.people = "入库人";
        this.hour = "入库时间：";
        this.record = 0;
        this.batchno = "";
        this.packingtype = "";
        this.selectIn();
      } else if (this.selected == "2") {
        this.status = "出库";
        this.zhuangtai = "出库：";
        this.people = "出库人";
        this.hour = "出库时间：";
        this.record = 1;
        this.batchno = "";
        this.packingtype = "";
        this.selectIn();
      }
    }
  },
  methods: {
    //批次选择组件中点击确定后查询
    handleClick() {
      this.packingtype = this.$refs.selectitems.getSlotValue(1);
      let plan = this.$refs.selectitems.getSlotValue(0);
      for (let i = 0; i < this.dataList.length; i++) {
        const item = this.dataList[i];
        if (item.planName == plan) {
          this.batchNo = item.batchNo;
          console.log(this.batchNo);
        }
      }
      this.beginPage = 1;
      this.selectIn();
      this.beginPage++;
      this.isActive=true;
      this.popupVisible = false;
    },
    //关闭批次选择组件
    handleCancel() {
      this.popupVisible = false;
    },
    //打开批次选择组件
    clickType() {
      this.popupVisible = true;
      //this.selectPlace();
    },
    //点击时间按钮触发，调出时间选择控件
    time(type) {
      this.type = type;
      this.$refs.picker.open();
    },
    //选择时间段后执行判断
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
            // console.log('选择了开始时间，开始时间是'+this.opt.startTime);
            this.sDateText = date;
          }
        } else {
          this.NowStartTime = date;
          // console.log('选择了开始时间2，开始时间是'+this.opt.startTime);
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
        this.beginPage = 1;
        this.selectIn();
        this.beginPage++;
      }
    },
    //查询方法
    selectIn(clear) {
      if (clear != "t") {
        this.storageData = {};
      }
      this.TotalWeight = 0;
      this.batchWeight = [];
      queryWarehouseRecord(this.opt).then(data => {
        if (data.data.resultCode == 1) {
          this.$nextTick(()=>{
            let datalist = data.data.basePageObj.dataList;
            //console.log(datalist);
            let weightList = data.data.dataList; 
            this.totalPage = data.data.basePageObj.totalPages;
            console.log(this.totalPage);
            let obj = {};
            let weightobj = [];

            this.TotalWeight = weightList.pop().total;
            this.dataList = datalist;
            this.plans = [];
            this.packtypes = [];
            datalist.forEach(item => {
              item.updationDate = item.updationDate.split(" ")[0];
              if (this.plans.indexOf(item.planName) == -1) {
                this.plans.push(item.planName);
              }
              if (this.packtypes.indexOf(item.packingType) == -1) {
                this.packtypes.push(item.packingType);
              }
              if (this.storageData[item.updationDate]) {
                this.storageData[item.updationDate].push(item);
              } else {
                this.storageData[item.updationDate] = [item];
              }
            });
            console.log('上面');
            console.log(this.storageData);
            weightList.forEach(item => {
                weightobj = [];
                weightobj.push(item.packingType);
                weightobj.push(item.specifications);
                weightobj.push(item.packingTypeTotal);
                weightobj.push(item.packingTypeWeight);
                this.batchWeight.push(weightobj);
            });
          });
        } else {
          Toast(this.opt.startTime+" "+data.data.resultMsg);
        }
      });
    },
    //点击重量按钮触发
    selectWeight() {
      this.$refs.weightpopup.selectWeight();
    },
    clearWeight() {
        this.$refs.weightpopup.clearWeight();
    },
    loadMore() {
      if(this.selected==1){
        this.selectIn("t");
        this.beginPage++;
      }
      
    },
    loadMore1() {
      if(this.selected==2){
        this.selectIn("t");
        this.beginPage++;
      }
      
    }
  },
  mounted() {

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
  max-height: 70%;
  overflow: auto;
  background-color: #fff;
  position: fixed;
  top: 20%;
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
  width: 25%;
  display: block;
  float: left;
  text-align: center;
}
.green {
  color: #02bcae;
}

.rightList > i {
  float: right;
  margin-right: 10px;
  margin-bottom: 20px;
}
.pitchOn{
  background-color: #02bcae;
  color: #fff
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
