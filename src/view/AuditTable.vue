<template>
    <div id="audit">
        <FHeader :title="title" :back="false" :showLogo="true"  />
        <div class="center">
            <div class="tab-box">
                <mt-navbar v-model="selected">
                    <mt-tab-item id="oper">我的申请</mt-tab-item>
                    <mt-tab-item id="review">我的审核</mt-tab-item>
                </mt-navbar>
                <mt-tab-container v-model="selected">
                    <mt-tab-container-item id="oper">
                      <agri-load-more
                        :begin="beginPage"
                        :total="totalPage"
                        @loadMore="loadMore"
                        v-if="selected=='oper'"
                        >
                          <CardItem v-for="(item,index) in applicationData" :key="index" 
                          :title="item.title"    
                          :titleClass="item.titleClass"
                          :topLeft="item.planName" 
                          :topRight="item.grossweight + 'kg'" 
                          :cRight="item.levelName"
                          :cRightClass="item.levelClass"
                          :bLeft="'审核人：'+item.auditor" 
                          :bRight="item.updationDate" 
                          :bage="showBage"
                          :bageContent="item.state"
                          :bageClass="item.status=='1'?'red':item.status=='0'?'yellow':'green'"
                          @click="handleClick(0,item)"                          
                          >
                          </CardItem>

                          <div class="tip" v-if="applicationData.length == 0">
                              <p>
                                  暂无消息！
                              </p>
                          </div>
                      </agri-load-more>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="review" >
                      <agri-load-more
                        :begin="beginPage"
                        :total="totalPage"
                        @loadMore="loadMoreReView"
                         v-if="selected=='review'"
                        >
                          <CardItem 
                            v-for="(item,index) in auditData" 
                            :key="index"
                            :title="item.title"
                            :titleClass="item.titleClass"
                            :topLeft="item.planName" 
                            :topRight="item.grossweight + 'kg'" 
                            :cLeft="item.levelName==null?item.packingType:item.levelName"                              
                            :cRight="item.complete==3?item.specifications:null"
                            :cRightClass="item.levelClass"
                            :bLeft="'入库人：'+item.submitter" 
                            :bRight="item.updationDate" 
                            :bage="showBage"
                            :bageContent="item.state"
                            :bageClass="item.status=='1'?'red':item.status=='0'?'yellow':'green'"
                            @click="handleClick(1,item)"                          
                            >
                          </CardItem>
                        
                          <div v-if="auditData.length==0 " class="tip">
                              <p>
                                  暂无消息！
                              </p>
                          </div>
                        </agri-load-more>
                        <!-- </mt-cell> -->
                    </mt-tab-container-item>
                </mt-tab-container>
            </div>
        </div>
        <mt-actionsheet
          :actions="actions"
          v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>
<script>
import Vue from "vue";
import {
  queryAuditStatusByAuditor,
  queryAuditStatusByOper,
  auditEntry,
  deleteEntry
} from "../fetch/api";
import {
  TabContainer,
  TabContainerItem,
  Navbar,
  TabItem,
  Cell,
  Actionsheet,
  Toast
} from "mint-ui";

Vue.component(Navbar.name, Navbar);
Vue.component(Cell.name, Cell);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Actionsheet.name, Actionsheet);
import FHeader from "@/components/Header";
import CardItem from "@/components/CardItem";
import AgriLoadMore from "@/components/common/AgriLoadMore";
function getStatus(status) {
  let title = "";
  switch (status) {
    case 0:
      title = "半成品入库申请";
      break;
    case 1:
      title = "半成品再入库申请";
      break;
    case 2:
      title = "报废申请";
      break;
    case 3:
      title = "成品入库申请";
      break;
    case -1:
      title = "待入库申请";
      break;
    default:
      title = "";
      break;
  }
  return title;
}
export default {
  components: {
    FHeader,
    CardItem,
    AgriLoadMore
  },
  data() {
    return {
      showBage: true,
      applicationData: [
        // 申请表数据
      ],
      auditData: [
        //审核表数据
      ],
      search: "",
      popupVisible: false,
      piCiBHList: [],
      role: "",
      selected: "oper",
      loading: false,
      title: sessionStorage.getItem("username"),
      sheetVisible: false,
      actions: [
        {
          name: "编辑",
          method: this.handleEdit
        },
        {
          name: "取消申请",
          method: this.deleteEntry
        }
      ],
      item: {},
      beginPage: 1,
      totalPage: 1
    };
  },
  methods: {
    /** 被驳回编辑申请单 */
    handleEdit() {
      let item = this.item;
      this.sheetVisible = false;
      if (item.complete == 3) {
        console.log(item);
        this.$router.push({
          path: "/finished_pro_app",
          query: {
            id: item.id,
            role: "操作工"
          }
        });
      } else if (item.complete == "2") {
        this.$router.push({
          path: "/scrapapp",
          query: {
            id: item.id,
            role: "操作工"
          }
        });
      } else {
        this.$router.push("Apply");
      }
    },
    /**被驳回取消申请 */
    deleteEntry() {
      deleteEntry({
        id: this.item.id
      }).then(res => {
        if (res.data.resultCode == "1") {
          Toast("成功取消申请");
          setTimeout(() => {
            this.requestApplicaiton();
          }, 500);
        } else {
          Toast(res.data.resultMsg);
        }
      });
    },
    handleClick(flag, item) {
      console.log(item);
      if (flag == 0) {
        sessionStorage.setItem("role", "操作工");
        sessionStorage.setItem("item", item.id);
        console.log("操作工");
        if (item.status == "1") {
          console.log("已驳回");
          this.sheetVisible = true;
          this.item = item;
          return;
        }
      } else {
        sessionStorage.setItem("role", "审核人");
        sessionStorage.setItem("item", item.id);
        console.log("审核人");
        if (item.status == "0") {
          console.log("待审核");
          if (item.complete == 3) {
            this.$router.push({
              path: "/finished_pro_app",
              query: {
                id: item.id,
                role: "审核人"
              }
            });
          } else if (item.complete == "2") {
            this.$router.push({
              path: "/scrapapp",
              query: {
                id: item.id,
                role: "审核人"
              }
            });
          } else {
            this.$router.push("Apply");
          }
        }
      }
    },
    /* 请求我的申请数据 */
    requestApplicaiton(clear) {
      queryAuditStatusByOper({
        complete: 4,
        beginPage: this.beginPage,
        pageSize: 10
      }).then(data => {
        if (clear == true) {
          this.applicationData = [];
        }
        let _data = data.data;
        let dataList = _data.basePageObj.dataList;
        this.totalPage = _data.basePageObj.totalPages;
        dataList.forEach(item => {
          let state =
            item.status == "0"
              ? "待审核"
              : item.status == "1" ? "被驳回" : "通过";
          let date = item.updationDate;
          item.state = state;
          item.title = getStatus(item.complete);
          item.titleClass =
            item.complete == 0
              ? "yellow"
              : item.complete == 1 ? "green" : item.complete == 2 ? "blue" : "";
          item.levelName =
            item.level == 1 ? "好果" : item.level == 2 ? "B级果" : null;
          item.levelClass = item.level == 1 ? "green" : "blue";
          this.applicationData.push(item);
        });
      });
    },
    /* 请求我的审核数据 */
    requestReview(clear) {
      // if (this.auditData.length != 0) return;
      queryAuditStatusByAuditor({
        complete: 4
      }).then(data => {
        if (clear == true) {
          this.auditData = [];
        }
        let _data = data.data;
        console.log(_data);
        let dataList = _data.basePageObj.dataList;
        this.totalPage = _data.basePageObj.totalPages;
        dataList.forEach(item => {
          let state =
            item.status == "0"
              ? "待审核"
              : item.status == "1" ? "已驳回" : "通过";
          let date = item.updationDate;
          item.state = state;
          item.title = getStatus(item.complete);
          item.titleClass =
            item.complete == 0
              ? "yellow"
              : item.complete == 1 ? "green" : item.complete == 2 ? "blue" : "";
          item.levelName =
            item.level == 1 ? "好果" : item.level == 2 ? "B级果" : null;
          item.levelClass = item.level == 1 ? "green" : "blue";
          this.auditData.push(item);
        });
        console.log(this.auditData);
      });
    },
    loadMore() {
      if (this.selected === "review") {
        console.log('return')
        //我的审核
        return;
      } else if (this.selected === "oper") {
        //我的申请
        this.requestApplicaiton();
        this.beginPage++;
      }
    },
    loadMoreReView() {
      if (this.selected === "review") {
        console.log('ssss')
        //我的审核
        this.requestReview();
        this.beginPage++;
      } else if (this.selected === "oper") {
        return;
      }
    }
  },
  mounted() {
    // this.requestApplicaiton();
  },
  // activated() {
  // if (this.selected === "review") {
  //   //我的审核
  //   this.requestReview();
  // } else if (this.selected === "oper") {
  //   //我的申请
  //   this.requestApplicaiton();
  // }
  // console.log("activated");
  // },
  watch: {
    selected: function(val, oldVal) {
      this.beginPage = 1;
      console.log(val);
      if (val === "review") {
        //我的审核
        this.requestReview(true);
      } else if (val === "oper") {
        //我的申请
        this.requestApplicaiton(true);
      }
    }
  }
};
</script>
<style lang="scss">
@import "../css/var.scss";
#audit {
  background-color: $bgColor;
  .center {
    margin-bottom: 55px;
    width: 100%;
    box-sizing: border-box;
    background-color: $bgColor;
    .tab-box {
      // padding: 5px;
      .mint-tab-container-item {
        margin: 5px 0;
        box-sizing: border-box;
        padding: 0 5px;
        // padding-top: 0;
      }
    }
  }
}
.tab-box .mint-tab-item-label {
  text-align: center;
}

.tab-box .mint-tab-item.is-selected {
  color: rgb(0, 187, 170);
}

.tab-box .mint-cell-wrapper {
  padding: 0;
}

.tab-box .mint-cell-value th {
  background-color: #f2f2f2;
  color: #000;
  width: 100px;
  height: 30px;
  border: 1px solid #ccc;
  border-right: 0;
}

.tab-box .mint-cell-value td {
  padding: 3px 0;
  width: 100px;
  height: 22px;
  line-height: 22px;
  color: #000;
}

.tab-box .mint-cell-wrapper {
  overflow-x: scroll;
}
.mint-cell-value {
  width: 100%;
}

.tip {
  width: 100%;
  padding: 10% 0;
  color: #333;
  background-color: #fff;
}

.tip p {
  text-align: center;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 3px solid rgb(0, 187, 170) !important;
  color: rgb(0, 187, 170) !important;
  margin-bottom: 0;
}
</style>