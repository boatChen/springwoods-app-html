<template>
  <!-- <div> -->
    <div class="agri-nav-item"><router-link replace :to="to"><slot></slot></router-link></div>
    <!-- <div class="agri-nav-item"><router-link replace to="/restock">半成品再入库</router-link></div>
    <div class="agri-nav-item"><router-link replace to="/FinishedProIn">成品入库</router-link></div> -->
  <!-- </div> -->
</template>

<script>
export default {
  props: {
    to: String,
  }
};
</script>

<style>

</style>
