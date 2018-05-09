<template>
  <div id="agri-stepper">
    <button class="agri-stepper__minus" @click.stop="minus"></button><input @click.stop="input" @keyup="input" type="text" v-model="num"><button class="agri-stepper__plus" @click.stop="plus"></button>
  </div>
</template>

<script>
export default {
  props: {
    value: ""
  },
  data() {
    return {
      num: ""
    };
  },
  methods: {
    minus() {
      this.num--;
      this.$emit('stepperChange',this.num);
    },
    plus() {
      this.num++;
      this.$emit('stepperChange',this.num);
    },
    input(){
      this.$emit('stepperChange',this.num);
    }
  },
  mounted() {
    if (this.value.indexOf("：") != -1) {
      this.num = parseInt(this.value.split("：")[1]);
    } else {
      this.num = this.value;
    }
  }
};
</script>

<style lang="scss">
@import "../../css/var.scss";
#agri-stepper {
  > button {
    background-color: $whiteColor;
    width: 40px;
    height: 30px;
    border: 1px solid #ccc;
    padding: 5px;
    vertical-align: middle;
    box-sizing: border-box;
    position: relative;
  }
  .agri-stepper__plus::after {
    content: "";
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #6c6c6c;
    width: 1px;
    height: 9px;
  }
  .agri-stepper__minus::before,
  .agri-stepper__plus::before {
    content: "";
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #6c6c6c;
    width: 9px;
    height: 1px;
  }

  > input {
    width: 50px;
    height: 26px;
    padding: 1px;
    border: 1px solid #ccc;
    border-width: 1px 0;
    border-radius: 0;
    box-sizing: content-box;
    color: #666;
    font-size: 14px;
    vertical-align: middle;
    text-align: center;
    -webkit-appearance: none;
  }
}
</style>
