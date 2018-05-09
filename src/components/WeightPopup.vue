<template>
    <div>
        <div ref="modal" class="customPopup-box" v-if="WeightPopup"></div>
        <div class="customPopup" v-if="WeightPopup">
            <ul>
                <li class="clear">
                    <i @click="clearWeight">X</i>
                </li>
                <li class="centerList green">
                    <i v-for="(value,index) in weightheader" class="centerList_i" :style="{width:headerwidth}">{{value}}</i>
                </li>
                <li class="centerList" v-for="(items,indexs) in batchWeight">
                    <i v-for="(item,index) in items" class="centerList_i" :style="{width:headerwidth}">{{item}}</i>
                </li>
                <li class="rightList green">
                    <i>总重：{{TotalWeight}}kg</i>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        batchWeight:Array,
        TotalWeight:'',
        weightheader:Array
    },
    data(){
        return {
            weight:[],
            WeightPopup:false,
            headerwidth:"50%",
        }
    },
    methods:{
        //点击重量按钮触发
        selectWeight() {
            this.WeightPopup = true;
            document.body.style.overflow = "hidden";
        },
        //关闭重量详情弹窗
        clearWeight() {
            this.WeightPopup = false;
            document.body.style.overflow = "";
        },  
        //设置表格列宽度
        setwidth(){
            this.headerwidth = 100/this.weightheader.length+"%"
        }     
    },
    mounted(){
        this.setwidth();
    }
}
</script>
<style lang="scss" scoped>

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
    ul { 
        li {
            width: 100%;
            /* height: 30px; */
            font-size: 14px;
            line-height: 30px;
            font-style: normal;
        }
    }
    i {
        font-style: normal;
    }
    .clear {
        text-align: right;
        i {
            margin-right: 10px;
        }
    }
    .centerList {
        overflow: hidden;
        .centerList_i {
            width: 25%;
            display: block;
            float: left;
            text-align: center;
        }
    }
    .rightList{  
        i {
            float: right;
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }
}
.green {
  color: #02bcae;
}
</style>
