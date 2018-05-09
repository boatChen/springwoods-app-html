<template>
    <div id="stock">
        <FHeader :title="'半成品在库表'" />

        <div class="center">          
          <div class="filter-container">            
            <agri-input @focus="piciFocus" placeholder="选择批次" v-model="planName" :readonly="true"/>
            <agri-input @focus="proFocus" placeholder="选择产品名称" v-model="proName" :readonly="true"/>
          </div>          
          <div class="item-container">
            <agri-load-more
            :begin="beginPage"
            :total="totalPage"
            :pullMessage="pullMessage"
            @loadMore="loadMore"
            >
              <div class="item-box" v-for="(value,time) in obj" :key="time">
              <time>{{time}}</time>
                <card-item 
                  v-for="(item,index) in value" :key="index" 
                  topLeftClass="level"
                  :value="item.id"
                  :bLeft="item.productname" 
                  :topRight="item.weight + 'kg'" 
                  :topLeft="item.planName"
                  >
                </card-item>   
              </div>     
          </agri-load-more>
          </div>
        </div>
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
import Vue from "vue";
import { InfiniteScroll, Spinner } from "mint-ui";
import { querySemiFinishedStockInfoList } from "../fetch/api";
import { Toast } from "mint-ui";
import FHeader from "@/components/Header";
import CardItem from "@/components/CardItem";
import SelectItems from "@/components/common/SelectItems";
import AgriInput from "@/components/common/AgriInput";
import AgriLoadMore from "@/components/common/AgriLoadMore";
Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);
export default {
  components: {
    FHeader,
    CardItem,
    SelectItems,
    AgriInput,
    AgriLoadMore
  },
  data() {
    return {
      tableData: [],
      search: "",
      piCiBHList: [],
      popupVisible: false,
      proPopupVisible: false,
      planName: "",
      plans: [],
      products: [],
      proName: "",
      beginPage: 1,
      pageSize: 10,
      totalPage: 1,
      pullMessage: "正在加载中...",
      obj: {}
    };
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
      console.log(Object.values(this.obj));
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        if (item.planName == this.planName) {
          return item.batchno;
        }
      }
      return "";
    }
  },
  methods: {
    /* 请求数据 */
    request(clear) {
      querySemiFinishedStockInfoList({
        beginPage: this.beginPage,
        pageSize: this.pageSize,
        batchno: this.batchno,
        productname: this.proName
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          let dataList = _data.basePageObj.dataList;
          this.totalPage = _data.basePageObj.totalPages;
          if (clear) {
            this.obj = {};
          }
          dataList.forEach(item => {
            item.updationdate = item.updationdate.split(" ")[0];
            this.tableData.push(item);
            if (this.plans.indexOf(item.planName) == -1) {
              this.plans.push(item.planName);
            }
            if (this.products.indexOf(item.productname) == -1) {
              this.products.push(item.productname);
            }
            if (this.obj[item.updationdate]) {
              this.obj[item.updationdate].push(item);
            } else {
              this.obj[item.updationdate] = [item];
            }
          });
          Toast({
            message: _data.resultMsg,
            iconClass: "mintui mintui-success"
          });
        } else {
          Toast(_data.resultMsg);
        }
      });
    },
    handleClick(val) {
      this.planName = val;
      this.popupVisible = false;
      this.request(true);
    },
    proHandleClick(val) {
      this.proName = val;
      this.proPopupVisible = false;
      this.request(true);
    },
    handleCancel() {
      this.popupVisible = false;
      this.proPopupVisible = false;
    },
    piciFocus() {
      this.$refs.selectItems.setSlotValue(0, this.planName);
      this.popupVisible = true;
    },
    proFocus() {
      this.$refs.proSelectItems.setSlotValue(0, this.proName);
      this.proPopupVisible = true;
    },
    loadMore() {
      this.request();
      this.beginPage++;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../css/var.scss";

#stock {
  background-color: $bgColor;
  height: 100%;
  .center {
    box-sizing: border-box;
    background-color: $bgColor;
    time {
      color: $themeColor;
      font-size: 14px;
    }
    .filter-container {
      display: flex;
      padding: 5px 0 0 0;
      > input {
        flex: 1;
        border: 0;
        outline: none;
        height: 30px;
        border-radius: $radius;
        text-align: center;
      }
      > input:first-child {
        margin-right: 2px;
      }
    }
    .item-container {
      padding: 5px;
    }
  }

  section.item-name {
    color: #1c51bb !important;
  }
}
</style>
<style lang="scss">
.center {
  .page-infinite-loading {
    text-align: center;
    div {
      display: inline-block;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
}
</style>
