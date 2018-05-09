<template>
    <div>
        <section class="main">
            <div class="resource-box">
                <!-- <div class="card-item-box">
                    <div v-cloak class="item" v-for="(item,key) in resources" :key="key">
                        <div class="top">
                            <section style="font-weight: 700;" class="item-name">{{item.packingType}}</section>
                            <section>
                                {{item.planName}}
                            </section>
                        </div>     
                        <div class="bottom">
                            <section class="plan">成品数量：{{item.quantityTotal}} 个</section>
                            <section class="level">
                                规格：{{item.specifications}}
                            </section>
                        </div>
                    </div>
                </div> -->
                <card-item v-for="(item,key) in resources" :key="key" 
                    :topLeftClass="item.packingType.indexOf('彩虹')!=-1?'green':item.packingType.indexOf('红')!=-1?'red':'blue'"
                    :topLeft="item.packingType" 
                    :topRight="item.planName" 
                    :bLeft="'成品数量：'+item.quantityTotal+ ' 个'" 
                    :bRight="'规格：'+item.specifications" 
                    :bRightClass="item.level==1? '': 'b-level'"
                ></card-item>
            </div> 
            <section class="btn-box">
                <!-- <button class="btn-primary" @click="handleClick">
                    转成品入库申请单
                </button> -->
                <agri-button @click="handleClick" type="green">转成品入库申请单</agri-button>
            </section>
        </section>
        <mt-popup
            v-model="popupVisible"
            position="bottom" 
            class="popup"
            :closeOnClickModal="closeOnClickModal">
            <mt-picker ref="picker" @change="onChange" :slots="slots" :show-toolbar="showToolbar">
                <section class="toolbar">
                    <button @click="handleCancel">取消</button>
                    <span>请选择产品名称</span>            
                    <button @click="handleConfirm">确定</button>
                </section>
            </mt-picker>
        </mt-popup>        
    </div>
</template>
<script>
import Vue from "vue";
import { Toast, Field, Badge, Picker, Popup ,MessageBox} from "mint-ui";
Vue.component(Picker.name, Picker);
Vue.component(Badge.name, Badge);
Vue.component(Popup.name, Popup);
Vue.component(Field.name, Field);
import FHeader from "@/components/Header";
import CardItem from "@/components/CardItem";
import AgriButton from "@/components/common/AgriButton";
import { selectFinishedProIn } from "../fetch/api";

export default {
  components: {
    FHeader,
    CardItem,
    AgriButton
  },
  data() {
    return {
      showToolbar: true,
      closeOnClickModal: false,
      popupVisible: false,
      resources: [],
      pros: {},
      plans: []
    };
  },
  computed: {
    slots() {
      return [
        {
          flex: 1,
          values: Object.keys(this.pros),
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
      let res = this.resources;
      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        if (
          item.packingType == this.$refs.picker.getSlotValue(0) &&
          item.planName == this.$refs.picker.getSlotValue(1)
        ) {
          return item;
        }
      }
    }
  },
  methods: {
    onChange(picker, values) {      
      picker.setSlotValues(1, this.pros[values[0]]);
    },
    handleClick() {
      if(this.resources.length == 0){
        MessageBox.alert('没有需要入库的产品哦');
        return;
      }
      if (Object.keys(this.pros).length > 1 || Object.values(this.pros).length > 1) {
        this.popupVisible = true;
      } else {
        this.item.batchno = this.item.batchNods;
        this.$router.push({
          path: "/finished_pro_app",
          query: {
            item: this.item
          }
        });
      }
    },
    handleCancel() {
      this.popupVisible = false;
    },
    handleConfirm() {
      this.popupVisible = false;
      this.item.batchno = this.item.batchNods;
      this.$router.push({
        path: "/finished_pro_app",
        query: {
          item: this.item
        }
      });
    },
    select() {
      this.tableData = [];
      this.TotalWeight = 0;
      selectFinishedProIn().then(data => {
        let datalist = data.data.resultObj;
        let pros = {};
        datalist.forEach(item => {
          let keys = Object.keys(this.pros);
          if (keys.indexOf(item.packingType) == -1) {
            pros[item.packingType] = [];
          }
          if (pros[item.packingType].indexOf(item.planName) == -1) {
            pros[item.packingType].push(item.planName);
          }
          this.resources.push(item);
        });
        this.pros = pros;
        this.$nextTick(() => {
          this.$refs.picker.setSlotValues(1, pros[Object.keys(pros)[0]]);
        });
      });
    }
  },
  mounted() {
    this.select();
  }
};
</script>
<style scoped>
.resource-box {
  padding: 10px 5px;
}
.btn-box {
  padding: 5px;
}
.level.b-level {
  color: #000 !important;
}
.item {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 6px;
  position: relative;
}
.item section {
  text-align: left;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  width: 45%;
  font-size: 13px;
  color: #333;
  padding: 5px 10px;
}
.popup {
  width: 100%;
}
.toolbar {
  line-height: 40px;
  text-align: center;
}
.toolbar span {
  display: inline-block;
  font-size: 14px;
}
.toolbar button {
  height: 40px;
  width: 100px;
  background-color: #fff;
  color: #333;
  border: 0;
  font-size: 14px;
}
.toolbar button:last-child,
.toolbar button:first-child {
  position: absolute;
  top: 0;
  right: 5px;
}
.toolbar button:first-child {
  left: 0;
}
</style>
<style lang="scss">
@import "../css/var.scss";
.card-item-box {
  text-align: center;
}
</style>
