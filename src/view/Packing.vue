<template>
    <div class="packing">
        <FHeader :title="title" :back="false" :showLogo="true" />
        <div class="center">
           <div class="content-box">
              <section class="input-box">
                <i @click="showScan" class="icon icon-qrcode"></i>
                <input v-autofocus ref="input" class="input search" type="text" v-model="code" placeholder="请扫描二维码">
            </section>
            <section class="form-box">
              <div class="add">
                <img @click="addResource" src="../assets/add.png" width="18" height="18" /> 
                <img @click="lessRecource" src="../assets/less.png" width="18" height="18" />               
              </div>
                <div v-for="(res,index) in resources" class="form-item">
                    <label class="label">采收框{{index+1}}名称：</label>
                    <label v-cloak for="">{{res.resourceName}}</label>
                </div>
                <div class="form-item">
                    <label class="label">产品名称：</label>
                    <label v-cloak for="">{{packingtype}}</label>
                </div>
                <div class="form-item">
                    <label class="label">物料编码：</label>
                    <label v-cloak for="">{{materialcode}}</label>
                </div>
                <div class="form-item">
                    <label class="label">产品规格：</label>
                    <label v-cloak for="">{{specifications}}</label>
                </div>
                <div v-for="(res,index) in resources" :key="index" class="form-item">
                    <label class="label">生产批次{{(index+1)}}：</label>
                    <input type="text" placeholder="扫描采收框获取批次信息" class="input text" v-model="res.jiHuaMC" disabled>
                </div>
                <div class="form-item">
                    <label class="label">数量：</label>
                    <input type="number" ref="numInput" placeholder="请输入包装数量" @blur="numBlur" @focus="numFocus" v-model="quantity" id="num" class="input text">
                </div>
                <div class="form-item">
                    <label class="label">装箱人：</label>
                    <input type="text" disabled placeholder="请输入装箱人" v-model="packingman" id="num" class="input text" 
                    >
                </div>
                <div class="form-item">
                    <label class="label">日期：</label>
                    <label v-cloak for="">{{date}}</label>
                </div>
            </section>
           </div>
          <section class="footer">
            <agri-button type="green" @click="submit">提交</agri-button>
            <agri-button @click="back">取消</agri-button>
          </section>
        </div>
        <modal @close="close" @scanQRCode="scanQRCode" v-if="scan"></modal>
    </div>
</template>
<script>
import {
  queryPackingBoxSpecs,
  addPackingBox,
  queryTaskInfoLists,
  handleSubtask,
  finishSubtask,
  queryBatchNo
} from "@/fetch/api";
import Vue from "vue";
import { MessageBox, Popup, Toast, Field, Picker } from "mint-ui";
Vue.component(Field.name, Field);
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);
import FHeader from "@/components/Header";
import Modal from "@/components/Modal";
import AgriButton from "@/components/common/AgriButton";
export default {
  components: {
    FHeader,
    Modal,
    AgriButton
  },
  data() {
    return {
      scan: false,
      resources: [
        {
          piCiBianH: "",
          jiHuaMC: "",
          resourceId: "",
          resourceName: ""
        }
      ],
      piCiBianH: "",
      resourceIndex: 0,
      code: "",
      productName: "", //产品名称
      packingtype: "", // 产品名称
      date: "", //日期
      quantity: "", // 数量
      materialcode: "", //物料编码
      specifications: "", //规格
      packingman: sessionStorage.getItem("username"), //装箱人

      params: "",
      timeoutEvent: 0,
      title: sessionStorage.getItem('username')
    };
  },
  methods: {
    showScan() {
      this.scan = true;
    },
    close() {
      this.scan = false;
    },
    scanQRCode(value) {
      this.code = value;
      this.updata();
      this.scan = false;
    },
    updata() {
      let reg = /^(PackingBoxSpecsId|id):(\d{1,})/;
      let result = this.code.trim().match(reg);
      if (result != null) {
        let pre = result[1];
        let value = result[2];
        /** 扫描采收框 */
        this.code = "";
        if (pre == "id") {
          if (this.packingtype === "") {
            MessageBox.alert("请先扫描规格二维码哦");
            return;
          }
          this.scanResource(value);
        } else if (pre == "PackingBoxSpecsId") {
          /** 扫描产品规格二维码 */
          this.queryPackingBoxSpecs(value);
        }
      }
    },
    /** 扫描采收框 */
    scanResource(value) {
      for (let index = 0; index < this.resources.length; index++) {
        const element = this.resources[index];
        if (element.resourceId == value) {
          MessageBox.alert("采收框重复扫描啦");
          return;
        }
      }
      queryBatchNo({
        resourceid: value
      }).then(res => {
        if (res.data.resultCode == "1") {
          console.log(res.data);
          let obj = res.data.resultObj;
          // 扫描第二个以上的采收框
          if (this.resourceIndex > 0) {
            if (this.packingtype.indexOf("彩虹") == -1) {
              // 彩虹杯才可以有不同批次，非彩虹杯限制一个批次
              for (let i = 0; i < this.resourceIndex; i++) {
                const item = this.resources[i];
                console.log(item);
                if (item.piCiBianH != obj.piCiBianH) {
                  MessageBox.alert("要扫描同一批次的采收框哦");
                  return;
                }
              }
            } else {
              for (let i = 0; i < this.resourceIndex; i++) {
                const item = this.resources[i];
                console.log(item);
                if (item.piCiBianH == obj.piCiBianH) {
                  MessageBox.alert("要扫描不同批次的采收框哦");
                  return;
                }
              }
            }
          }
          this.resources[this.resourceIndex].resourceId = value;
          this.resources[this.resourceIndex].resourceName = obj.resourcename;
          this.resources[this.resourceIndex].jiHuaMC = obj.jiHuaMC;
          this.resources[this.resourceIndex].piCiBianH = obj.piCiBianH;
          let keyval = JSON.parse(obj.keyval);
          this.productName = keyval.produceName;
          this.handleSubtask(value);
        } else {
          Toast({
            message: data.resultMsg,
            iconClass: "mintui mintui-error"
          });
        }
      });
    },
    /** 扫描产品规格二维码 */
    queryPackingBoxSpecs(value) {
      queryPackingBoxSpecs({
        id: value
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          let obj = _data.basePageObj.dataList[0];
          this.packingtype = obj.packingtype;
          this.specifications = obj.specifications;
          this.materialcode = obj.materialcode;
          if (this.packingtype.indexOf("彩虹") != -1) {
            this.addResource();
          }
          Toast({
            message: _data.resultMsg,
            iconClass: "mintui mintui-success"
          });
        } else {
          Toast({
            message: _data.resultMsg
          });
        }
        this.code = "";
        this.$refs.input.blur();
      });
    },
    handleSubtask(value) {
      handleSubtask({
        resourceid: value,
        piCiBianH: this.piCiBianH
      }).then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          this.params = _data.resultObj.keyValueLists;

          if (this.resourceIndex < this.resources.length - 1) {
            this.resourceIndex++;
          }

          Toast({
            message: _data.resultMsg,
            iconClass: "mintui mintui-success"
          });
        } else {
          this.$nextTick(() => {
            this.resources[this.resourceIndex].resourceId = "";
            this.resources[this.resourceIndex].resourceName = "";
            this.resources[this.resourceIndex].jiHuaMC = "";
            this.resources[this.resourceIndex].piCiBianH = "";
          });
          Toast({
            message: _data.resultMsg
          });
        }
      });
    },
    submit() {
      if (this.quantity == "" || isNaN(parseInt(this.quantity))) {
        Toast({
          message: "数量输入有误"
        });
        return;
      }
      if (this.packingman == "") {
        Toast({
          message: "请输入装盒人"
        });
        return;
      }
      for (let i = 0; i < this.resources.length; i++) {
        const item = this.resources[i];
        if (item.piCiBianH == "") {
          MessageBox.alert("采收框没填完呢");
          return;
        }
      }
      MessageBox.confirm("是否确认提交?").then(action => {
        let params = this.params;
        let date = new Date();
        let currentdate = `${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        let paramsObj = {
          datetime: params[0].value,
          batchNumber: params[1].value,
          produceName: this.productName,
          startDateTime: params[3].value,
          endDateTime: currentdate,
          quantity: this.quantity,
          packingType: this.packingtype,
          plan: this.plans,
          materialCode: this.materialcode,
          liablePerson: params[9].value,
          specifications: this.specifications
        };
        console.log(paramsObj);
        let paramsStr = JSON.stringify(paramsObj);
        let resourceIds = "";
        this.resources.forEach(item => {
          resourceIds += item.resourceId + ";";
        });
        resourceIds = resourceIds.substring(0, resourceIds.length - 1);
        finishSubtask({
          resourceid: resourceIds,
          piCiBianH: this.piCiBianH,
          params: paramsStr
        }).then(data => {
          let _data = data.data;
          if (_data.resultCode == "1") {
            Toast({
              message: _data.resultMsg,
              iconClass: "mintui mintui-success"
            });
            this.clearData();
          } else {
            Toast({
              message: _data.resultMsg,
              iconClass: "mintui mintui-error"
            });
          }
        });
      });
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    /* 清除数据 */
    clearData() {
      this.packingtype = "";
      this.materialcode = "";
      this.specifications = "";
      this.quantity = "";
      this.resources = [
        {
          piCiBianH: "",
          jiHuaMC: "",
          resourceId: "",
          resourceName: ""
        }
      ];
      this.resourceIndex = 0;
    },
    queryTaskInfoLists() {
      queryTaskInfoLists().then(data => {
        let _data = data.data;
        if (_data.resultCode == "1") {
          let datalist = _data.basePageObj.dataList;
          if (datalist.length == 0 || datalist == null) {
            MessageBox.alert("当前没有装盒任务").then(action => {
              this.$router.back();
            });
          } else {
            this.piCiBianH = datalist[0].picibianh;
          }
        } else {
          Toast(_data.resultMsg, { type: "error" });
        }
      });
    },
    addResource() {
      let index = this.resources.length;
      if (index === 4) {
        MessageBox.alert("4个够用啦");
        return;
      }
      if (this.resources[index - 1].resourceId != "") {
        this.resourceIndex++;
      }
      this.resources.push({
        piCiBianH: "",
        jiHuaMC: "",
        resourceId: "",
        resourceName: ""
      });
    },
    lessRecource() {
      let index = this.resources.length;
      if (index === 1) {
        MessageBox.alert("在删就没了。");
        return;
      }
      if (this.resources[index - 1].resourceId != "") {
        this.resourceIndex--;
      }
      this.resources.pop();
    },
    eventBing() {
      let $this = this;
      document.onkeydown = function(e) {
        if (e.keyCode == 229 || e.keyCode == 13 || e.keyCode == 0) {
          $this.$refs.input.focus();
        }
      };
    },
    numFocus(){
       setTimeout(()=>{
        this.$refs.numInput.scrollIntoView(true);
          },200)
      this.unEventBing();
    },
    numBlur(){
      this.eventBing();
    },
    unEventBing() {
      document.onkeydown = null;
    },
    back() {
     this.clearData();
    }
  },
  computed: {
    plans() {
      let plans = "";
      if (this.packingtype.indexOf("彩虹") != -1) {
        for (let i = 0; i < this.resources.length; i++) {
          const item = this.resources[i];
          plans += item.piCiBianH + ";";
        }
        plans = plans.substring(0, plans.length - 1);
        return plans;
      } else {
        return this.resources[this.resourceIndex].piCiBianH;
      }
      return "";
    }
  },
  mounted() {
    this.eventBing();
    this.date = this.getNowFormatDate();
    this.queryTaskInfoLists();
  },
  directives: {
    autofocus: {
      inserted: function(el, pre, vnode) {
        let timeoutEvent = 0;
        let $this = vnode.context;
        el.onkeydown = function() {
          clearTimeout(timeoutEvent);
          timeoutEvent = setTimeout(() => {
            $this.updata();
          }, 100);
          el.focus();
        };
        el.onfocus = function(even) {
          even.currentTarget.select();
        };
        el.onkeyup = function() {
          el.blur();
        };
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../css/var.scss";
.icon-qrcode {
  height: 24px;
  width: 24px;
  top: 5px;
  left: 0;
}
.packing {
  background-color: $bgColor;
}

.center {
  padding-bottom: 1rem;
  width: 100%;
  text-align: center;
  // background-color: $bg;
}

.form-box {
  padding-top: 10px;
  font-size: 16px;
  position: relative;
  
}
.input-box {
  .input {
    background-color: $bgColor;
  }
}

.form-box .add {
  position: absolute;
  right: 5%;
  top: 7px;
  padding: 5px;
}

.form-item {
  margin-bottom: 4%;
}

.form-item:last-child {
  margin-bottom: 0;
}
.form-item label:last-child {
  display: inline-block;
  width: 50%;
  text-align: left;
}
.form-item .label {
  display: inline-block;
  width: 35%;
  text-align: right;
  margin-right: 2%;
}

.form-item .text {
  padding-left: 1%;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 24px;
  width: 50%;
  font-size: 14px;
  outline-color: skyblue;
}

.form-item .mult-text {
  width: 20%;
  margin-right: 7%;
}
.footer {
  box-sizing: border-box;
  padding: 5px;
  display: flex;
  margin-bottom: 55px;
  background-color: $bgColor;
  > button {
    flex: 1;
  }
  button:first-child {
    margin-right: 10px;
  }
}
</style>
<style>
.mint-msgbox-confirm {
  color: #03a49a !important;
}
</style>
