<template>
  <button :class="'agri-btn-'+type" class="agri-button" @click="handleClick">
    <!-- <button :class="classObject" class="agri-button" @click="handleClick"> -->
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "default"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      classObject(){
        let type = 'agri-btn-'+this.type;
        return {
          type: true,
          disabled: this.disabled
        }
      }
    };
  },
  methods: {
    handleClick() {
      if (this.disabled) {
        return;
      }
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss">
@import "../..//css/var.scss";
.agri-button {
  box-sizing: border-box;
  width: 100%;
  height: $btnHeight;
  border-radius: $radius;
  font-size: $fontSize;
  border: 0;
  outline: none;
  text-align: center;
  display: block;
  margin: 6px 0;
  &:hover {
    opacity: 0.8;
  }
  &.agri-btn-green {
    background-color: $themeColor;
    color: $whiteColor;
  }
  &.agri-btn-default {
    background-color: $whiteColor;
    color: $blackColor;
  }
  &.agri-btn-gray {
    background-color: $grayColor;
    color: $blackColor;
  }
  // .disabled {
  //   background-color: #ccc;
  // }
}
</style>
