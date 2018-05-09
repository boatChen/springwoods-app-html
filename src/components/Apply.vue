<template>
    <div>
        <FHeader :showLogo="true" :back="false"/>
        <main class="main">
            <div class="title-box">
                <div class="title-left">
                    <span class="icon"></span>
                    <div class="title">
                        <h4 v-cloak>{{title}}</h4>
                    </div>
                    <img onclick="history.go(-1)" class="close" src="../assets/x.png" alt="">
                </div>
            </div>
            <div class="form-box">
                <div class="form-item">
                    <label class="label" for="">物料编码：</label>
                    <input class="text" placeholder="请输入物料编码" type="text" v-model="material">
                </div>
                <div class="form-item">
                    <label class="label" for="">产品名称：</label>
                    <label v-cloak class="" for="">{{productName}}</label>
                </div>
                <div class="form-item">
                    <label class="label" for="">生产批次：</label>
                    <label v-cloak class="" for="">{{picibianhName}}</label>
                </div>
                <div class="form-item">
                    <label class="label" for="">型号规格：</label>
                    <label class="" for="">散装</label>
                </div>
                <div class="form-item">
                    <label class="label" for="">单位：</label>
                    <label v-cloak class="" for="">{{unit}}</label>
                </div>
                <div class="form-item">
                    <label class="label" for="">入库时毛重：</label>
                    <input class="text" placeholder="请输入重量" type="text" v-model="countKg" disabled>
                </div>
                <div class="form-item">
                    <label class="label" for="">A级果：</label>
                    <input class="text mult-text" v-model="AWeight" placeholder="请输入重量" type="number" @focus="inputFocus($event)" @blur="AScale = computeScale(AWeight)">
                    <input v-model="AScale" @focus="inputFocus($event)" @blur="AWeight = computeWeight(AScale)" class="text mult-text" placeholder="输入比例" type="text"><strong>%</strong>
                </div>
                <div class="form-item">
                    <label class="label" for="">B级果：</label>
                    <input ref="binput" class="text mult-text" v-model="BWeight" placeholder="请输入重量" @focus="inputFocus($event)" type="number" @blur="BScale = computeScale(BWeight)">
                    <input ref="bWeight" v-model="BScale" class="text mult-text" placeholder="输入比例" type="text" @focus="inputFocus($event)" @blur="BWeight = computeWeight(BScale)"><strong>%</strong>
                </div>
                <!-- <div class="form-item">
                    <label class="label" for="">B-级果：</label>
                    <input ref="b_input" class="text mult-text" v-model="B_Weight" placeholder="请输入重量" @focus="inputFocus($event)" type="number">
                    <input ref="b_Weight" v-model="B_Scale" class="text mult-text" placeholder="选择比例" type="text"><strong>%</strong>
                </div> -->
                <div class="form-item">
                    <label class="label" for="">C级果：</label>
                    <input class="text mult-text" v-model="CWeight" placeholder="请输入重量" @focus="inputFocus($event)" type="number" @blur="CScale = computeScale(CWeight)">
                    <input v-model="CScale" class="text mult-text" placeholder="输入比例" type="text" @focus="inputFocus($event)" @blur="CWeight = computeWeight(CScale)"><strong>%</strong>
                </div>
                <div class="form-item">
                    <label class="label" for="">入库部门：</label>
                    <input class="text" v-model="productDepartment" placeholder="请输入入库部门" type="text" disabled>
                </div>
                <div class="form-item">
                    <label class="label" for="">入库时间：</label>
                    <input class="text" placeholder="请输入入库时间" v-model="storageTime" type="text" disabled>
                </div>
                <div class="form-item">
                    <label class="label" for="">交货人：</label>
                    <input class="text" placeholder="请输入交货人姓名" type="text" v-model="deliveryman" disabled>
                </div>
                <div class="form-item">
                    <label class="label" for="">审核人：</label>
                    <input class="text" placeholder="请输入审核人姓名" type="text" v-model="reviewer">
                </div>
                <div class="form-item">
                    <label class="label" for="">仓管：</label>
                    <input class="text" placeholder="请输入仓管人姓名" type="text" v-model="warehouse">
                </div>
                <div class="form-item" style="height: 140px;">
                    <label class="label" for="">备注：</label>
                    <textarea v-model="note" name="" id="" cols="30" rows="8" style="padding-left: 1%; border: 1px solid #ccc;resize: none;float: right;width: 50%;margin-right: 16%;"></textarea>
                </div>
                <div class="form-item submit">
                    <button v-cloak style="margin-right: 30%;" class="btn-success" @click="handleCommit('submit')">{{btnSubmit}}</button>
                    <button v-cloak class="btn-success" @click="handleCommit('cancel')">{{btnCancel}}</button>
                </div>
            </div>
        </main>
        <!-- <mt-popup class="pop" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
            <mt-picker :show-toolbar="showToolbar" ref="picker" :slots="slots" @change="onValuesChange">
                <section class="toolbar">                    
                    <button @click="handleClick">确定</button>
                </section>
            </mt-picker>
        </mt-popup> -->
    </div>
</template>
<script>
import Vue from "vue";
import { auditEntry, addStorage, queryEntryInfo } from "../fetch/api";
import { Toast, Popup, Picker, MessageBox } from "mint-ui";

import FHeader from "@/components/Header";
import SelectItems from '@/components/common/SelectItems';
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component(MessageBox.name, MessageBox);
const REQUEST = {
  PASS: 2, // 通过审核
  TURNDOWN: 1 //驳回
};
export default {
  components: {
    FHeader,
    SelectItems
  },
  data() {
    return {
      showToolbar: true,
      countKg: "",
      productName: "",
      piCiBianH: "",
      popupVisible: false,

      AWeight: 0,

      BWeight: 0,

      B_Weight: 0,

      CWeight: 0,

      current: "",
      productDepartment: "生产部",
      storageTime: "",
      picibianhName: "",
      unit: "kg",
      specifications: "",

      deliveryman: "",
      reviewer: "",
      warehouse: "",
      note: "",
      material: "",
      id: "",
      entryId: '',

      btnSubmit: "确认",
      btnCancel: "取消",
      title: "半成品入库申请单",
      isreentry: 0,
      todoEntryId: '',
      AScale: '0.00',
      BScale: '0.00',
      CScale: '0.00'
    };
  },
  methods: {
    inputFocus(even) {
      even.currentTarget.select();
    },
    computeWeight(scale){
      if(scale != ''){
        setTimeout(()=>{
          this.computeCountWeight();
        },300)
        return (this.countKg * parseFloat(scale) / 100).toFixed(2);
      }
    },
    computeScale(weight){
      if(weight==''){
        weight = 0;
      }
      setTimeout(()=>{
          this.computeCountWeight();
        },300)
      return (weight / this.countKg * 100).toFixed(2);
    },
    handleClick() {
      this.popupVisible = false;
    },
    /** 计算总重量 */
    computeCountWeight(input) {
      let aweight = parseFloat(this.AWeight);
      let bweight = parseFloat(this.BWeight);
      // let b_weight = parseFloat(this.B_Weight);
      let cweight = parseFloat(this.CWeight);
      let count = aweight + bweight  + cweight;
      if (count > this.countKg) {
        MessageBox(
          "提示",
          "输入总重量:" + count.toFixed(2) + "大于入库总重量:" + this.countKg
        );
        return false;
      } else {
        return true;
      }
    },
    transitionPicker(val) {
      this.$refs.picker.setSlotValue(0, val);
    },
    onValuesChange(picker, values) {
      let current = this.current;
      console.log(values[0]);
      if (current === "A") {
        this.AScale = values[0];
      } else if (current === "B") {
        this.BScale = values[0];
      } else if (current === "B_") {
        this.B_Scale = values[0];
      } else if (current === "C") {
        this.CScale = values[0];
      }
    },
    /** 处理按钮事件 */
    handleCommit(type) {
      console.log("type", type);
      let role = sessionStorage.getItem("role");
      if (role == "审核人") {
        if (type == "submit") {
          this.auditEntry(REQUEST.PASS);
        } else if (type == "cancel") {
          this.auditEntry(REQUEST.TURNDOWN);
        }
      } else {
        if (this.computeCountWeight()) {
          //转半成品入库申请单提交
          if (type == "submit") {
            this.addStorage();
          } else if (type == "cancel") {
            history.go(-1);
          }
        }
      }
    },
    /** 审核 */
    auditEntry(status) {
      auditEntry({
        id: this.id,
        status: status,
        remark: this.note
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          Toast(_data.resultMsg);
          this.$router.back();
        } else {
          Toast(_data.resultMsg);
        }
      });
    },
    /** 半成品入库 */
    addStorage() {
      if (this.computeCountWeight() == false) {
        return;
      }

      function getScale(scale) {
        return (parseFloat(scale) / 100).toFixed(4);
      }
      addStorage({
        id: this.entryId,
        material: this.material,
        chanpmc: this.productName,
        picibianh: this.piCiBianH,
        inboundweight: this.countKg,
        aweight: this.AWeight,
        bweight: this.BWeight,
        cweight: this.CWeight,
        b_weight: 0,
        treasurydepartment: this.productDepartment,
        deliveryman: this.deliveryman,
        reviewer: this.reviewer,
        warehouse: this.warehouse,
        note: this.note,
        aProportion: getScale(this.AScale),
        bProportion: getScale(this.BScale),
        cProportion: getScale(this.CScale),
        bMinusProportion: 0.0,
        isreentry: this.isreentry,
        todoEntryId: this.todoEntryId
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          // 提交成功
          console.log(_data);
          setTimeout(() => {
            this.$router.back();
          }, 100);
        } else {
          Toast(_data.resultMsg);
        }
      });
    },
    handleCancel(){
      this.popupVisible = false;
    }
  },
  mounted() {
    //获取当前角色
    let role = sessionStorage.getItem("role");
    if (role != null) {
      if (role == "操作工") {
        //操作工
        this.btnSubmit = "提交";
        this.btnCancel = "取消";
        this.title = "半成品入库再申请单";
      } else if (role == "审核人") {
        //审核人
        this.btnSubmit = "通过";
        this.btnCancel = "驳回";
        this.title = "半成品入库申请单";
      }
      let id = sessionStorage.getItem("item");
      queryEntryInfo({
        id: id
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          Toast(_data.resultMsg);
          let item = _data.resultObj;
          this.entryId = item.id;
          this.piCiBianH = item.batchno;
          this.picibianhName = item.planName;
          this.productName = item.productname;
          this.deliveryman = item.submitter;
          this.countKg = item.grossweight.toFixed(2);
          this.storageTime = item.entrytime;
          this.specifications = item.specifications;
          this.productDepartment = item.entrydepartment;
          this.AWeight = item.aweight.toFixed(2);

          this.AScale = (item.aproportion * 100).toFixed(2);
          this.BWeight = item.bweight.toFixed(2);
          this.BScale = (item.bproportion * 100).toFixed(2);
          this.CWeight = item.cweight.toFixed(2);
          this.CScale = (item.cproportion * 100).toFixed(2);
          // this.B_Weight = item.bminusweight;
          // this.B_Scale = (item.bminusproportion * 100).toFixed(2);
          this.material = item.materialcode;
          this.unit = item.unit;
          this.id = item.id;
          this.note = item.remark;
          this.reviewer = item.auditor;
          this.warehouse = item.storeman;
        } else {
          Toast(_data.resultMsg);
        }
      });
      // let item = JSON.parse(sessionStorage.getItem('item'));
      // console.log(item);
    } else {
      let action = this.$route.query.action;
      if (action == "wait") {
        let item = this.$route.query.item;
        console.log(item);
        this.picibianhName = item.planName;
        this.productName = item.productName;
        this.countKg = item.weight;
        this.storageTime = item.updationdate;
        this.piCiBianH = item.batchno;
        this.isreentry = -1;
        this.todoEntryId = item.id || '';
        this.deliveryman = sessionStorage.getItem("username");
        return;
      }
      let json = JSON.parse(sessionStorage.getItem("stock"));
      this.picibianhName = json.picibianhName;
      this.countKg = json.totalWeight;
      this.productName = json.productName;
      this.storageTime = json.storageTime;
      this.piCiBianH = json.picibianh;
      this.deliveryman = sessionStorage.getItem("username");
    }
  },
};
</script>
<style scoped>
.top {
  height: 60px;
  background-color: rgba(2, 188, 174, 1);
}

.top .img {
  width: 50%;
  line-height: 60px;
}

.top img {
  width: 100%;
  vertical-align: middle;
}

.icon {
  display: inline-block;
  width: 10px;
  height: 30px;
  /* height: 28px; */
  background-color: rgba(2, 188, 174, 1);
  left: -2%;
  top: 0;
}

.title-left {
  padding-bottom: 1%;
  margin-left: 2%;
  height: 30px;
  border-bottom: 1px solid #ccc;
  position: relative;
}

.title-left .title {
  width: 85%;
  display: inline-block;
}

.title-left h4 {
  line-height: 30px;
}

.title-left .close {
  /* float: right; */
  width: 28px;
  height: 28px;
  vertical-align: middle;
  /* margin-right: 2%; */
}

.form-box {
  padding-top: 10px;
  background-color: #fff;
}

.form-item {
  margin-bottom: 3%;
}

.form-item .label {
  display: inline-block;
  width: 30%;
  text-align: right;
  font-size: 14px;
  margin-right: 2%;
}

.form-item .text {
  padding-left: 1%;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 24px;
  width: 50%;
  outline-color: skyblue;
}

.form-item .mult-text {
  width: 23.5%;
}

.form-item.submit {
  margin-left: 2%;
  border-top: 1px solid #ccc;
  text-align: center;
  padding-top: 20px;
}

.clearbox::after {
  content: " ";
  display: inline-block;
  clear: both;
}

.btn-success {
  border: 1px solid #ccc;
  background-color: rgba(2, 188, 174, 1);
  color: #fff;
  width: 70px;
  height: 30px;
  border-radius: 8px;
  outline: none;
}

.pop {
  width: 100%;
  text-align: center;
}

.logo {
  max-height: 60px;
}

.picker-item {
  text-align: center !important;
}

.toolbar {
  line-height: 40px;
}

.toolbar button {
  height: 40px;
  width: 120px;
  background-color: #fff;
  color: #333;
  border: 0;
}

.toolbar button:first-child {
  float: left;
}

.toolbar button:last-child {
  float: right;
}
</style>