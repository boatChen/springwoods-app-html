<template>
<transition name="m-slide">
  <div id="modal" class="modal">
    <header class="header">
      <img @click="close" class="icon-delete" src="../assets/delete.png" width="24" alt="">
      <h2 style="color: #fff;">二维码扫描</h2>
    </header>
  </div>
</transition>
  
</template>

<script>
export default {
  components: {
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      bc: null
    }
  },
  methods: {
    scanQRCode() {
      let _this = this;
      try {
        this.bc = new plus.barcode.Barcode("modal");
        this.bc.onmarked = function(type, result) {
          this.cancel();
          _this.$emit("scanQRCode", result);
          this.close();
        };
        this.bc.start();
      } catch (error) {
        console.error("error", error.message);
        // _this.$emit("scanQRCode", error.message);
      }
    },
    close() {
      try {
        this.bc.close();
        this.$emit("close");
      } catch (error) {
        this.$emit("close");
        console.error("error", error.message);
      }
    }
  },
  mounted() {
    this.scanQRCode();
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #333;
  top: 0;
  left: 0;
  z-index: 999;
  transition: transform .3s ease-in;
}
.header {
  line-height: 60px;
}
.header h2{
  text-align: center;
}
.icon-delete {
  position: absolute;
  top: 6%;
  left: 5%;
}
.m-slide-enter,
.m-slide-leave-active {
  transform: translateX(100%);
}
.m-slide-leave,
.m-slide-enter-active {
  transform: translateX(0);
}
</style>
