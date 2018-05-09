<template>
    <div>
        <span class="data-box-span">
            {{date}}
        </span>
        <CardItrmSuffix 
            class="data-box-box" 
            v-for="(item,index) in data" 
            :key="index" 
            :topleft="item.planName" 
            :topright="status" 
            :centerleft="item.packingType" 
            :centerright="item.materialCode" 
            :bottomleftleft="hour"
            :bottomleft="item.specifications" 
            :bottomrightleft="zhuangtai" 
            :bottomrightright="item.quantity +' 盒'" 
            :suffixleft="people" 
            :suffixright="item.submitter"
            :tail="item.levelString"></CardItrmSuffix>
    </div>
</template>
<script>
import CardItrmSuffix from '@/components/CardItrmSuffix'
export default {
    components:{
        CardItrmSuffix
    },
    props: {
        date:String,
        status:String,
        zhuangtai:String,
        data:Array,
        people:String,
        hour:String
    }
}
</script>
<style scoped>
.data-box-span{
    margin-bottom: 3px;
    color: #139993;
    font-weight: bold;
}
.data-box-box{
    padding-top: 5px;
    border-radius: 10px;
    background-color: #fff;
    font-size: 13px;
    overflow: auto;
    margin:10px 0;
}
</style>