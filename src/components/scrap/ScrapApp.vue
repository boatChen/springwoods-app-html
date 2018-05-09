<template>
  <main id="finish">
    <FHeader :title="'报废申请单'"/>
    <div class="form-box">
        <div class="form">
          <mt-field class="form-item" label="物料编码：" v-model="material"></mt-field>
          <mt-field class="form-item" readonly label="产品名称：" v-model="item.productname"></mt-field>
          <mt-field class="form-item" readonly label="规格型号：" v-model="specifications"></mt-field>
          <mt-field class="form-item" readonly label="生产批次：" v-model="item.planName"></mt-field>         
          <mt-field class="form-item" readonly label="单位：" v-model="unit"></mt-field>
          <mt-field class="form-item" readonly label="报废重量：" :value="item.grossweight+' kg'"></mt-field>     
          <mt-field class="form-item" readonly label="报废部门：" v-model="productDepartment"></mt-field>
          <mt-field class="form-item" readonly label="报废时间：" v-model="date"></mt-field>
          <mt-field class="form-item" readonly label="报废申请人：" v-model="submiter"></mt-field>
          <mt-field class="form-item" label="审核人：" placeholder="请输入审核人姓名" v-model="reviewer"></mt-field>          
          <mt-field class="form-item" label="报废原因：" placeholder="请输入报废原因" v-model="remark"></mt-field>
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
import { auditEntry, queryEntryInfo, addStorage } from "@/fetch/api";
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
      id: "",
      btn_submitter: "提交申请",
      btn_cancel: "取消",
      role: "",
      specifications: "散装",
      unit: "kg",
      material: "",
      entryId: "",
      isreentry: "2"
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
        this.auditEntry(REQUEST.TURNDOWN);
      }
    },
    /** 提交申请 */
    addStorage() {
      if (this.reviewer == "") {
        MessageBox.alert("请输入完审核人");
        return;
      }
      addStorage({
        id: this.entryId,
        material: this.material,
        chanpmc: this.item.productName,
        picibianh: this.item.batchno,
        inboundweight: this.item.weight,
        aweight: 0,
        bweight: 0,
        cweight: 0,
        b_weight: 0,
        treasurydepartment: this.productDepartment,
        deliveryman: this.submiter,
        reviewer: this.reviewer,
        warehouse: "",
        note: this.remark,
        aProportion: 0,
        bProportion: 0,
        cProportion: 0,
        bMinusProportion: 0,
        isreentry: this.isreentry,
        todoEntryId: this.item.id || ""
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          // 提交成功
          setTimeout(() => {
            this.$router.back();
          }, 100);
        } else {
          Toast(_data.resultMsg);
        }
      });
    },
    /** 半成品详情查询 */
    queryEntryInfo() {
      queryEntryInfo({
        id: this.id
      }).then(res => {
        let result = res.data;
        if (result.resultCode == "1") {
          let item = result.resultObj;
          item.materialCode = item.materialcode;
          item.packingType = item.packingtype;
          item.quantityTotal = item.quantity;
          item.batchno = item.batchNo;
          this.material = item.materialCode;
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
    handleSubmiter() {
      if (this.btn_submitter == "提交申请") {
        this.addStorage();
      } else {
        this.auditEntry(REQUEST.PASS);
      }
    },
    /** 审核 */
    auditEntry(status) {
      auditEntry({
        id: this.id,
        status: status,
        remark: this.remark
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          Toast(_data.resultMsg);
          this.$router.back();
        } else {
          Toast(_data.resultMsg);
        }
      });
    }
  },

  mounted() {
    this.id = this.$route.query.id || "";
    if (this.id == "") {
      this.item = this.$route.query.item;
      console.log(this.item);
      let d = new Date();
      let moment = require("moment");
      this.date = moment(d).format("YYYY-MM-DD hh:mm:ss");
      this.item.productname = this.item.productName;
      this.item.grossweight = this.item.weight;
      this.item.batchno = this.item.batchNo || this.item.batchno;      
      console.log(this.item);
    } else {
      this.role = this.$route.query.role;
      if (this.role == "操作工") {
        this.btn_submitter = "提交申请";
        this.btn_cancel = "取消";
      } else {
        this.btn_submitter = "通过";
        this.btn_cancel = "驳回";
      }
      this.queryEntryInfo();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../css/var.scss";
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
