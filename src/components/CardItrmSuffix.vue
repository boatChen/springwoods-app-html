<template>
    <div>
        <ul class="ul-data">
            <li>
                <i style="font-weight: bold;">{{topleft}}</i>
                <i>{{topright}}</i>
            </li>
            <li>
                <i>{{centerleft}}</i>
                <i>{{centerright}}</i>
            </li>
            <li>
                <i style="font-size:12px">{{bottomleft}}</i>
                <i><i class="green">{{bottomrightleft}}</i>{{bottomrightright}}</i>
            </li>
            <li v-if="tail">
                <i style="float:none">{{tail}}</i>
            </li>
        </ul>
        <span class="box-span"><i class="green">{{suffixleft}}：</i>{{suffixright}}</span>
    </div>
</template>
<script>
export default {
    props: {
        topleft:String,
        topright:String,
        centerleft:String,
        centerright:String,
        bottomleftleft:String,
        bottomleft:String,
        bottomrightleft:String,
        bottomrightright:String,
        suffixleft:String,
        suffixright:String,
        tail:String
    },
    mounted(){
    }
}
</script>
<style>
.ul-data{
    width: 90%;
    margin: 0 auto;
    border-bottom: 1px #eee solid;
}
.ul-data>li{
    height: 36px;
    line-height: 36px;
}
.ul-data>li>i{
    width: 45%;
    display: block;
    float: left;
    padding-left: 8px;
    font-style: normal;
}
.box-span{
    width: 150px;
    height: 35px;
    line-height: 35px;
    float: right;
    text-align: center;
}
.green{
    color:#03a49a;
    font-style:normal;
    font-size: 13px;
}
</style>