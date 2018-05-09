<template>
  <section class="select-items">
    <mt-popup :closeOnClickModal="false" class="pop" v-model="show" position="bottom" popup-transition="popup-fade">
            <mt-picker :show-toolbar="showToolbar" ref="picker" :slots="slots" @change="onValuesChange">
                <section class="toolbar">                    
                    <button @click="$emit('cancel')">取消</button>
                    <button @click="handleClick">确定</button>
                </section>
            </mt-picker>
        </mt-popup>
  </section>
</template>

<script>
import Vue from 'vue';
import { Toast, Picker, Popup } from "mint-ui";
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
/**@augments popupVisible 显示/隐藏 */
/**@augments showToolbar 显示/隐藏 工具栏 */
/*@augments slots 插槽*/
export default {
  props: {
    popupVisible: {
      type: Boolean,
      default: false
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    slots: {
      type: Array,
      default: []
    },
  },
  computed: {
    show: {
      get(){
        return this.popupVisible;
      },
      set(val){
        
      }
    }
  },
  methods: {
    handleClick() {
      let selectValue = this.$refs.picker.getSlotValue(0);
      this.$emit("click", selectValue);
    },
    onValuesChange(picker,values) {
      this.$emit('change',values)
    },
    setSlotValue(index,val) {
      if(val== ''){
        return;
      }
      this.$refs.picker.setSlotValue(index,val)
    },
    setSlotValues(index,val) {
      if(val== ''){
        return;
      }
      this.$refs.picker.setSlotValues(index,val)
    },
    getSlotValue(index,val) {
       return this.$refs.picker.getSlotValue(index,val);
    }
  }
};
</script>

<style lang="scss">
.select-items .pop {
  width: 100%;
  text-align: center;
}
.toolbar {
  line-height: 40px;
}

.toolbar button {
    height: 40px;
    width: 120px;
    background-color: #fff;
    color: #333;
    border: 0;
}

.toolbar button:first-child {
    float: left;
}

.toolbar button:last-child {
    float: right;
}
</style>
