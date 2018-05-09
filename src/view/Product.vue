<template>
    <div id="product">
        <FHeader :title="title" :back="false" :showLogo="true" />
        <div class="center">
            <ProductItem class="items" v-for="(values,indexs) in typedata" :key="indexs" :title="values.Title" :label="values.label" :back="false"></ProductItem>
        </div>
    </div>
</template>
<script>
import FHeader from '@/components/Header'
import ProductItem from '@/components/ProductItem'

export default {
    components:{
        FHeader,
        ProductItem
    },
    data(){
        return {
            typedata:[
                {
                    Title:'樱桃番茄(半成品)',
                    label:[
                        {
                            path:'/warehouse_record',
                            name:'出入库记录',
                            src:require("../assets/outin.png")
                        },
                        {
                            path:'/Stock',
                            name:'当前库存',
                            src:require("../assets/repertory.png")
                        },
                        {
                            path:'/waitstorage/data',
                            name:'待入库',
                            src:require("../assets/waitenterwarehouse.png")
                        },
                        {
                            path:'/Scrap/scrapdata',
                            name:'报废',
                            src:require("../assets/scrap1.png")
                        },
                    ]
                },
                {
                    Title:'樱桃番茄(成品)',
                    label:[
                        {
                            path:'/finishedrecord',
                            name:'出入库记录',
                            src:require("../assets/outin.png")
                        },
                        {
                            path:'/finished_pro_stock',
                            name:'当前库存',
                            src:require("../assets/repertory.png")
                        }
                    ]
                }
            ],
            title: sessionStorage.getItem('username')
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../css/var.scss";
#product {
    height: 100%;
    background-color: $bgColor;
}
.center{
    width: 100%;
    box-sizing: border-box; 
    padding: 5px;
    .items{        
        background-color: #fff;
        border-radius: 10px;
        padding: 5px 0;
        margin: 5px auto;
    }
}
</style>
