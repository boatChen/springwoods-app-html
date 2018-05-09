<template>
  <main id="finish">
    <FHeader :title="'成品入库申请单'"/>
    <div class="form-box">
        <div class="form">
          <mt-field @click.native="materialCodeClick" class="form-item" :readonly="materialCodeReadonly" label="物料编码：" v-model="item.materialCode"></mt-field>
          <mt-field class="form-item" readonly label="产品名称：" v-model="item.packingType"></mt-field>
          <mt-field class="form-item" readonly label="规格型号：" v-model="item.specifications"></mt-field>
          <mt-field v-for="(pici,index) in picis" :key="index" class="form-item" readonly :label="'批次'+(index+1)+'：'" :value="pici"></mt-field>         
          <mt-field class="form-item" readonly label="数量：" v-model="item.quantityTotal"></mt-field>         
          <mt-field class="form-item" readonly label="入库部门：" v-model="productDepartment"></mt-field>
          <mt-field class="form-item" readonly label="入库时间：" v-model="date"></mt-field>
          <mt-field class="form-item" readonly label="交货人：" v-model="submiter"></mt-field>
          <mt-field class="form-item" label="审核人：" placeholder="请输入审核人姓名" v-model="reviewer"></mt-field>
          <mt-field class="form-item" label="仓管：" placeholder="请输入仓管姓名" v-model="warehouse"></mt-field>
          <mt-field class="form-item" label="备注：" placeholder="请输入备注信息" v-model="remark"></mt-field>
        </div>
          <section class="btns">
            <agri-button type="green" @click="handleSubmiter">{{btn_submitter}}</agri-button>
            <agri-button @click="cancel">{{btn_cancel}}</agri-button>            
          </section>
      </div>
  </main>
</template>

<script>
import Vue from "vue";
import { Toast, Field, Button, MessageBox } from "mint-ui";

import FHeader from "@/components/Header";
import AgriButton from "@/components/common/AgriButton";
import {
  addFinishedEntry,
  finishedQueryEntryInfo,
  finishedAuditEntry
} from "../fetch/api";
Vue.component(Field.name, Field);
Vue.component(Button.name, Button);

const REQUEST = {
  PASS: 2, // 通过审核
  TURNDOWN: 1 //驳回
};
export default {
  components: {
    FHeader,
    AgriButton
  },
  data() {
    return {
      disabled: true,
      username: "abc",
      item: {},
      productDepartment: "生产部",
      submiter: sessionStorage.getItem("username"),
      reviewer: "",
      warehouse: "",
      remark: "",
      date: "",
      id: '',
      btn_submitter: "提交申请",
      btn_cancel: "取消",
      role: '',
      materialCodeReadonly: true
    };
  },
  computed: {
    picis() {
      if (this.item.planName == null) {
        return [];
      }
      if (this.item.planName.indexOf(";") == -1) {
        return [this.item.planName];
      } else {
        return this.item.planName.split(";");
      }
    }
  },
  methods: {
    cancel() {
      if (this.btn_cancel == "取消") {
        this.$router.back();
      } else if (this.btn_cancel == "驳回") {
        this.finishedAuditEntry(REQUEST.TURNDOWN);
      }
    },
    /** 提交申请 */
    submitterApplication() {
      if (this.reviewer == "" || this.warehouse == "") {
        MessageBox.alert("请输入完审核人和仓管信息");
        return;
      }

      let item = this.item;
      console.log(item);
      addFinishedEntry({
        materialcode: item.materialCode,
        batchno: item.batchno,
        packingtype: item.packingType,
        quantity: item.quantityTotal,
        entrydepartment: this.productDepartment,
        submitter: this.submiter,
        auditor: this.reviewer,
        storeman: this.warehouse,
        remark: this.remark,
        id: this.id,
        _in_id: this.item.ids
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          Toast(result.resultMsg);
          this.$router.back();
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    handleSubmiter() {
      if (this.btn_submitter == "提交申请") {
        this.submitterApplication();
      } else {
        this.finishedAuditEntry(REQUEST.PASS);
      }
    },
    /** 成品详情查询 */
    finishedQueryEntryInfo() {
      finishedQueryEntryInfo({
        id: this.id
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let item = result.resultObj;
          item.materialCode = item.materialcode;
          item.packingType = item.packingtype;
          item.quantityTotal = item.quantity;
          this.date = item.entrytime;
          this.warehouse = item.storeman;
          this.reviewer = item.auditor;
          this.remark = item.remark;
          this.item = item;
        } else {
          Toast(result.resultMsg);
        }
      });
    },
    /** 成品审核提交 */
    finishedAuditEntry(status) {
      finishedAuditEntry({
        status: status,
        remark: this.remark,
        id: this.id
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          Toast(result.resultMsg);
          setTimeout(() => {
            this.$router.back();
          }, 200);
        } else {
          Toast(result.resultMsg);
        }
      });
    },

    materialCodeClick(){
      this.materialCodeReadonly = false;
    }
  },

  created() {
    this.id = this.$route.query.id || '';    
    if (this.id == '') {
      this.item = this.$route.query.item;
      let d = new Date();
      let moment = require("moment");
      this.date = moment(d).format("YYYY-MM-DD hh:mm:ss");
    } else {
      this.role = this.$route.query.role;
      if(this.role == '操作工'){
        this.btn_submitter = '提交申请';
        this.btn_cancel = "取消";
      }else{
        this.btn_submitter = "通过";
        this.btn_cancel = "驳回";
      }
      this.finishedQueryEntryInfo();
    }
  },
  mounted() {
    console.log(this.item);
  }
};
</script>

<style lang="scss" scoped>
@import "../css/var.scss";
#finish {
  background-color: $bgColor;
}
.form-box {
  padding: 5px 0;
  background-color: #e5e5e5;
  .form {
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .item {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      box-sizing: border-box;
    }
    .item-left {
      width: 60%;
    }
    .item-right {
      width: 38%;
      text-align: center;
      input {
        padding-left: 20%;
        height: 42px;
        font-size: 14px;
        border: 0px solid #e5e5e5;
        border-bottom-width: 1px;
        width: 90%;
      }
    }

    .form-item {
      border-bottom: 1px solid #e5e5e5;
      height: 30px;
    }
    .btns {
      text-align: center;
      padding: 10px 0;
      background: #e5e5e5;
      .btn {
        display: inline-block;
        width: 49%;
      }
    }
  }
}
</style>
<style>
.mint-cell {
  min-height: 42px;
}
</style>
