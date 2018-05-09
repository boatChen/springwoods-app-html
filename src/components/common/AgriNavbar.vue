<template>
  <nav class="agri-nav">
    <slot></slot>    
  </nav>
</template>

<script>
export default {
  props: {
    
  }
};
</script>

<style lang="scss">
@import "../../css/var.scss";
.agri-nav {
  display: flex;
  text-align: center;
  font-size: 14px;
  box-sizing: border-box;
  background-color: $whiteColor;

  .agri-nav-item {
    flex: 1;
    a {
      box-sizing: border-box;
      color: #333;
      display: block;
      padding: 10px 5px;
      width: 100%;
    }
  }
  .agri-nav-item a.router-link-active {
    color: $themeColor;

    border-bottom: 2px solid $themeColor;
  }
}
</style>
