<template>
  <main class="restock-app">
    <FHeader :title="'半成品再入库申请单'"/>
    <div class="form-box">
        <div class="form" v-if="item!=null">
          <mt-field class="form-item" readonly label="果子级别：" v-model="level"></mt-field>
          <mt-field class="form-item" readonly label="物料编码：" v-model="item.materialcode"></mt-field>
          <mt-field class="form-item" readonly label="生产批次：" v-model="planName"></mt-field>
          <mt-field class="form-item" readonly label="产品名称：" v-model="item.productname"></mt-field>
          <mt-field class="form-item" readonly label="型号规格：" v-model="specification"></mt-field>
          <mt-field class="form-item" readonly label="入库毛重：" v-model="disWeight"></mt-field>
          <section class="multiple-item">
            <section class="item item-left">
              <mt-field class="form-item" readonly label="A级果：" v-model="aWeight"></mt-field>
            </section>
            <section class="item item-right">
              <mt-field class="form-item" readonly placeholder="请选择比例" v-model="aScale"></mt-field>
            </section>
          </section>
          <section class="multiple-item">
            <section class="item item-left">
              <mt-field class="form-item" readonly label="B级果：" v-model="bWeight"></mt-field>
            </section>
            <section class="item item-right">
              <mt-field class="form-item" readonly placeholder="请选择比例" v-model="bScale"></mt-field>
            </section>
          </section>
          <section class="multiple-item">
            <section class="item item-left">
              <mt-field class="form-item" readonly label="B-级果：" v-model="bMinuWeight"></mt-field>
            </section>
            <section class="item item-right">
              <mt-field class="form-item" readonly placeholder="请选择比例" v-model="bMinuScale"></mt-field>
            </section>
          </section>
          <section class="multiple-item">
            <section class="item item-left">
              <mt-field class="form-item" readonly label="C级果：" v-model="cWeight"></mt-field>
            </section>
            <section class="item item-right">
              <mt-field class="form-item" readonly placeholder="请选择比例" v-model="cScale"></mt-field>
            </section>
          </section>          
          <mt-field class="form-item" readonly label="入库部门：" v-model="productDepartment"></mt-field>
          <mt-field class="form-item" readonly label="入库时间：" v-model="date"></mt-field>
          <mt-field class="form-item" readonly label="交货人：" v-model="submiter"></mt-field>
          <mt-field class="form-item" label="审核人：" placeholder="请输入审核人姓名" v-model="reviewer"></mt-field>
          <mt-field class="form-item" label="仓管：" placeholder="请输入仓管姓名" v-model="warehouse"></mt-field>
          <mt-field class="form-item" label="备注：" placeholder="请输入备注信息" v-model="remark"></mt-field>
        </div>
          <section class="btns">
            <agri-button type="green" @click="handleSubmiter">提交申请</agri-button>
            <agri-button @click="cancel">取消</agri-button>             
          </section>
      </div>
  </main>
</template>

<script>
import Vue from "vue";
import { Toast, Field, Button } from "mint-ui";

import FHeader from "@/components/Header";
import AgriButton from "@/components/common/AgriButton";
import { queryProportion, addStorage } from "../fetch/api";

Vue.component(Field.name, Field);
Vue.component(Button.name, Button);
export default {
  components: {
    FHeader,
    AgriButton
  },
  data() {
    return {
      disabled: true,
      username: "abc",
      level: this.$route.query.level == 1 ? "好果" : "B级果",
      planName: this.$route.query.planName,
      item: null,
      specification: "散装",
      productDepartment: "生产部",
      submiter: sessionStorage.getItem("username"),
      reviewer: "",
      warehouse: "",
      remark: "",
      weight: (this.$route.query.weight * 1).toFixed(2),
    };
  },
  methods: {
    cancel() {
      this.$router.back();
    },
    handleSubmiter() {
      addStorage({
        material: this.item.materialcode,
        chanpmc: this.item.productname,
        picibianh: this.item.batchno,
        inboundweight: this.weight,
        aweight: this.item.aweight,
        bweight: this.item.bweight,
        cweight: this.item.cweight,
        deliveryman: this.submiter,
        treasurydepartment: this.productDepartment,
        reviewer: this.reviewer,
        warehouse: this.warehouse,
        note: this.remark,
        b_weight: this.item.bminusweight,
        aProportion: this.item.aproportion,
        bProportion: this.item.bproportion,
        bMinusProportion: this.item.bminusproportion,
        cProportion: this.item.cproportion,
        isreentry: 1,
        todoEntryId: '',
        id: '',
        entryId:'',
        level: this.level == "好果" ? 1 : 2
      }).then(res => {
        let result = res.data;
        if (result.resultCode === "1") {
          Toast(result.resultMsg);
          setTimeout(() => {
            this.$router.back();
          }, 500);
        } else {
          Toast(result.resultMsg);
        }
      });
    }
  },
  computed: {
    disWeight() {
      return this.weight + " kg";
    },
    aWeight() {
      return (this.item.aproportion * this.weight).toFixed(2) + " kg";
    },
    bWeight() {
      return (this.item.bproportion * this.weight).toFixed(2) + " kg";
    },
    bMinuWeight() {
      return (this.item.bminusproportion * this.weight).toFixed(2) + " kg";
    },
    cWeight() {
      return (this.item.cproportion * this.weight).toFixed(2) + " kg";
    },
    aScale() {
      return (this.item.aproportion * 100).toFixed(2) + "%";
    },
    bScale() {
      return (this.item.bproportion * 100).toFixed(2) + "%";
    },
    bMinuScale() {
      return (this.item.bminusproportion * 100).toFixed(2) + "%";
    },
    cScale() {
      return (this.item.cproportion * 100).toFixed(2) + "%";
    },
    date() {
      let d = new Date();
      let moment = require("moment");
      return moment(d).format("YYYY-MM-DD hh:mm:ss");
    }
  },
  created() {
    this.planName = this.$route.query.item.planName;

    let batchno = this.$route.query.item.batchno;
    queryProportion({ batchno: batchno }).then(res => {
      let result = res.data;
      if (result.resultCode === "1") {
        this.item = result.resultObj;
      } else {
        Toast(result.resultMsg);
      }
    });
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "../css/var.scss";
.restock-app {
  height: 100%;
  background-color: $bgColor;
}
.form-box {
  padding: 5px;
  background-color: $bgColor;
  .form {
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .multiple-item {
      display: flex;
      .item {
        flex: 2;
      }
      .item.item-right {
        flex: 1;
      }
    }
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
  }
}
</style>
<style>
.mint-cell {
  min-height: 42px;
}
</style>