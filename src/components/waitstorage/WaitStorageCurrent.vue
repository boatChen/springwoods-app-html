<template>
  <div class="wait-storage-current">
    <div class="screen">
      <span class="type" @click="clickType">筛选</span>
    </div>
    <div class="resource-box">
      <div class="item-box">
         <div v-for="(key,time) in obj" :key="time">
           <time>{{time}}</time>
          <div class="item" v-for="(item,index) in key" :key="index" @click="itemClick(item)">
            <div class="item-top">
              <div class="item-plan">{{item.planName}}</div>
              <div class="item-num"><span class="num">采收框数量：</span>{{item.resourcecount}}</div>
                <div class="item-weight">{{item.weight}}kg</div>
            </div>
            <div class="item-center">
              <div class="item-user">操作人：{{item.createdby}}</div>            
            </div>
            <div class="item-remark">
              <div>原因：{{item.remarks}}</div>            
            </div>
          </div>
         </div>
      </div>
    </div>

    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
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
import Vue from "vue";
import { Toast, Actionsheet } from "mint-ui";
import { queryTodoEntry,queryPlace,queryPlacePlan } from "@/fetch/api";

import SelectItems from '@/components/common/SelectItems'

Vue.component(Actionsheet.name, Actionsheet);
export default {
  components:{
    SelectItems
  },
  data() {
    return {
      area: "",
      startTime: "",
      endTime: "",
      // batchno: "",
      beginPage: 1,
      pageSize: 10,
      dataList: [],
      obj: {},
      sheetVisible: false,
      actions: [
        {
          name: "报废",
          method: this.scrap
        },
        {
          name: "入库",
          method: this.storage
        }
      ],
      item: {},

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
      popupVisible:false,
      plans:[],
      // batchno:"",
      dataList:[],
      areaid:"",
      batchNo:"",
      regiondata:[]
    };
  },
  methods: {
    /** 查询当前待入库记录 */
    queryTodoEntry() {
      queryTodoEntry({
        area: this.area,
        startTime: this.startTime,
        endTime: this.endTime,
        batchno: this.batchNo,
        beginPage: this.beginPage,
        pageSize: this.pageSize,
        status: 0
      }).then(res => {
        if (res.data.resultCode == "1") {
          let datalist = res.data.basePageObj.dataList;
          let obj = {};
          console.log(datalist);
          datalist.forEach(item => {
            item.updationdate = item.updationdate.split(" ")[0];
            this.dataList.push(item);
            // if (this.plans.indexOf(item.planName) == -1) {
            //   this.plans.push(item.planName);
            // }
            // if (this.products.indexOf(item.productname) == -1) {
            //   this.products.push(item.productname);
            // }

            if (obj[item.updationdate]) {
              obj[item.updationdate].push(item);
            } else {
              obj[item.updationdate] = [item];
            }
          });
          this.$nextTick(() => {
            this.obj = obj;
          });
        } else {
          Toast(res.data.resultMsg);
        }
      });
    },
    itemClick(item) {
      this.sheetVisible = true;
      this.item = item;
    },
    scrap() {
      console.log("scrap", this.item);
      this.$router.push({
        path: "/scrapapp",
        query: {
          action: "wait",
          item: this.item
        }
      });
    },
    storage() {
      console.log("storage", this.item);
      this.$router.push({
        path: "/Apply",
        query: {
          action: "wait",
          item: this.item
        }
      });
    },
    clickType() {
      this.popupVisible = true;
      this.selectPlace();
    },
    selectPlace() {
      queryPlace().then(data => {
        if (data.data.resultCode == 1) {
          let datalist = data.data.resultObj;
          this.regiondata = datalist;
          let obj = [];
          console.log(datalist);
          datalist.forEach(items => {
            obj.push(items.names);
          });
          this.slots[0].values = obj;
        } else {
          Toast(data.data.resultMsg);
        }
      });
    },
    handleChange(obj) {
        let value = obj[0];
        let dapenval = obj[1];
        if(obj.length>2){
            let plan = obj[2];
            console.log(this.plans);
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
      handleCancel() {
        this.popupVisible = false;
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
      this.queryTodoEntry();
      this.isActive=true;
      this.popupVisible = false;
    },
  },
  mounted() {
    this.queryTodoEntry();
  }
};
</script>

<style lang="scss" scoped>
@import "../../css/var.scss";
.resource-box {
  padding: 5px;
  box-sizing: border-box;
  .item-box {
    time {
      color: $themeColor;
      font-size: 14px;
    }
    .item {
      margin-bottom: 5px;
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: $radius;
      font-size: 14px;
      background-color: $whiteColor;
    }
    .item-top {
      padding: 10px 0;
      display: flex;
      > div {
        flex: 1;
      }
      > div:nth-child(2) {
        flex: 2;
      }
      .num {
        display: inline;
        color: $orangeColor;
      }
    }
    .item-center {
      padding: 10px 0;
      padding-top: 0;
      border-bottom: 1px solid $grayColor;
    }
    .item-remark {
      padding-top: 10px;
    }
  }
}
.screen {
    width: 97%;
    height: 25px;
    padding-top: 9px;
    padding-left: 7px;
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
  }
</style>
<style>
.wait-storage-current .resource-box .item-box .item{
  box-shadow: 2px 2px 0px 0px #ccc;
}
</style>

