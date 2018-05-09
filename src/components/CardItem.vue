<template>
  <div @click="emitClick" class="card-item-box">
    <div v-cloak class="item">
      <span v-if="bage" :class="bageClass" class="state">{{bageContent}}</span>
      <div v-if="checked" class="select-box">
        <input ref="check" type="checkbox">
        <div class="select">        
        </div>
      </div>
      <div class="card-title" :class="titleClass" v-if="title!='' && title!=null">{{title}}</div>
      <div class="top">
          <section :class="topLeftClass" class="item-name">{{topLeft}}</section>
          <section class="item-weight">
              {{topRight}}
          </section>
          <img @click="$emit('delete',value)" v-if="showDelete" class="delete" src="@/assets/delete-red.png" alt="">
      </div>
       <div class="card-center" v-if="cLeft!=null || cRight!=null">
          <section :class="cLeftClass" class="item-center">{{cLeft}}</section>
          <section :class="cRightClass" class="item-weight">
              {{cRight}}
          </section>
      </div>
      <div class="bottom">
          <section class="plan">{{bLeft}}</section>
          <section v-if="!check" class="level" :class="bRightClass">
            {{bRight}}
          </section>
          <section v-if="check">
            <agri-stepper @stepperChange="stepperChange" :value="bRight"></agri-stepper>
          </section>
      </div>
    </div>
  </div>
</template>

<script>
import AgriStepper from "@/components/common/AgriStepper";
export default {
  components: {
    AgriStepper
  },
  props: {
    showDelete: {
      type: Boolean,
      default: false
    },
    title: String,
    titleClass: String,
    topLeft: String,
    topLeftClass: String,
    topRight: String,
    cLeft: String,
    cLeftClass: String,
    cRight: String,
    cRightClass: String,
    bLeft: String,
    bRight: String,
    bRightClass: String,
    value: null,
    bage: {
      type: Boolean,
      default: false
    },
    bageClass: {
      type: String,
      default: ""
    },
    bageContent: {
      type: String,
      default: "待审核"
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      check: false
    };
  },
  methods: {
    emitClick() {
      this.$emit("click");
      if (this.checked) {
        this.toggleCheckbox();
      }
    },
    toggleCheckbox() {
      let input = this.$refs.check;
      let check = false;
      if (input.hasAttribute("checked")) {
        input.removeAttribute("checked");
        check = false;
      } else {
        input.setAttribute("checked", "checked");
        check = true;
      }
      this.check = check;
      this.$emit("change", check, this.value);
    },
    stepperChange(val){
      this.$emit('stepperChange',this.value,val)
    }
  }
};
</script>

<style scoped lang="scss">
@import "../css/var.scss";
.card-item-box {
  text-align: center;
}
.item {
  background-color: #fff;
  padding: 8px 0px;
  margin-bottom: 5px;
  border-radius: 6px;
  position: relative;
  font-size: 14px;  
  .card-title {
    text-align: center;
    color: $themeColor;
    width: 100%;
    border-bottom: 1px solid $bgColor;
    margin-bottom: 5px;
    line-height: 30px;
    position: relative;
    top: -8px;
  }
  .state {
    border: 1px solid $grayColor;
    box-sizing: border-box;
    display: inline-block;
    font-size: 14px;
    font-weight: 700;
    padding: 1px 8px;
    position: absolute;
    left: -10px;
    top: 47px;
    transform: rotate(-45deg);
    width: 60px;
    text-align: center;
  }
  section {
    // text-align: center;
    box-sizing: border-box;
    display: inline-block;
    width: 49%;

    color: #333;
  }
  > div {
    line-height: 30px;
  }
  .top {
    position: relative;
    .delete {
      position: absolute;
      top: -5px;
      right: 5px;
      width: 18px;
      height: 18px;
    }
    .item-weight {
      font-weight: 700;
      color: #333;
    }
  }
  .select-box {
    .select {
      width: 14px;
      height: 14px;
      background-color: transparent;
      border: 1px solid $blueColor;
      border-radius: 50%;
      position: absolute;
      top: 40%;
      left: 2%;
      &::after {
        content: " ";
        // display: block;
        position: absolute;
        // display: inline-block;
        width: 4px;
        height: 8px;
        border: 2px solid $blueColor;
        top: 2px;
        left: 4px;
        border-top: 0;
        border-left: 0;
        transition: transform 0.2s;
        transform: rotate(0) scale(0);
      }
    }
    input {
      display: none;
    }
    input[checked] + .select {
      background-color: $blueColor;
      &::after {
        border-color: $whiteColor;
        transform: rotate(45deg) scale(1);
      }
    }
  }
}
.level {
  color: #1bc9c0 !important;
}
</style>
