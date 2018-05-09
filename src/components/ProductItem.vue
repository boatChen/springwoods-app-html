<template>
    <div>
        <section class="items-box">
            <span class="items-box-title">{{title}}</span>
            <section class="items-box-section">
                <router-link v-for="(value,index) in label" :key="index" :to="value.path">
                    <div class="item">
                        <img width="48" :src="value.src" alt="">
                        <p>{{value.name}}</p>
                    </div>
                </router-link>
            </section>
        </section>
    </div>
</template>
<script>
export default {
  props: {
    title:String,
    label:Array
  },
  mounted(){
  }
};
</script>
<style lang="scss" scoped>
.items-box {
  width: 100%;
  .items-box-title {
    width: 90%;
    height: 32px;
    line-height: 32px;
    margin: 0 auto;
    font-size: 16px;
    color: #14a593;
    font-weight: bold;
    border-bottom: #eee 1px solid;
  }
  .items-box-section {    
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    > a{
      flex: 1
    }
    .item {      
      display: inline-block;
      padding: 10px 0;
      font-size: 12px;
      box-sizing: border-box;
      text-align: center;
      p {
        padding: 5px 0;
        color: #333;
        font-size: 12px;
      }
      img {
        width: 48px;
        height: 48px;
        vertical-align: middle;
      }
    }
  }
}
</style>

