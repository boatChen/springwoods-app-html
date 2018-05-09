<template>
  <input class="agri-input" @focus="$emit('focus')" type="text" :placeholder="placeholder" :readonly="readonly">
</template>

<script>
export default {
  props: {
    placeholder: "",
    readonly: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
@import "../../css/var.scss";
.agri-input {
  flex: 1;
  border: 0;
  outline: none;
  height: 30px;
  border-radius: $radius;
  text-align: center;
}
</style>
