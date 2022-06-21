<template>
    <label class="toggle-control">
        <input type="checkbox" v-model="status_bool" @change="$emit('checkboxToggles', status_string)" :disabled="!user.caps.admin_sales_rep">
        <span class="control"></span>
    </label>
</template>
<script>
import { ref } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  props: ['status', 'ukey', 'id'],
  setup(props) {
    const store = useStore()
    if(props.status === 'on'){
        var status_bool = ref(true)
    } else {
        var status_bool = ref(false)
    }
    return {
      status_bool,
      user: computed(()=> store.getters.get_User),
    }
  },
  computed: {
    status_string(){
        if(this.status_bool){
            return 'on'
        } else {
            return 'off'
        }
    },
  },
    watch: {
        status(newVal){
            if(newVal === 'on'){
                this.status_bool = true
            } else {
                this.status_bool = false
            }
        },
        id(){
            if(this.status === 'on'){
                this.status_bool = true
            } else {
                this.status_bool = false
            }
        },
    }
}
</script>
<style lang="scss" scoped>
$toggle-background-color-on: #000;
$toggle-background-color-off: #fff;
$toggle-control-color: #fff;
$toggle-width: 38px;
$toggle-height: 18px;
$toggle-gutter: 1px;
$toggle-radius: 25%;
$toggle-control-speed: 0.15s;
$toggle-control-ease: ease-in;

// These are our computed variables
// change at your own risk.
$toggle-radius: calc($toggle-height / 2);
$toggle-control-size: $toggle-height - ($toggle-gutter * 2);

.toggle-control {
  display: block;
  position: relative;
  padding-left: $toggle-width;
  height: $toggle-height;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  // transform: scale(0.4);
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  input:checked ~ .control {
    background-color: $toggle-background-color-on;

    &:after {
      left: $toggle-width - $toggle-control-size - $toggle-gutter;
      background-color: $toggle-background-color-off;
    }
  }

  .control {
    position: absolute;
    top: 0;
    left: 0;
    height: $toggle-height;
    width: $toggle-width;
    border-radius: $toggle-radius;
    background-color: $toggle-background-color-off;
    transition: background-color $toggle-control-speed $toggle-control-ease;
    border: 1px solid #000;
    &:after {
      content: "";
      position: absolute;
      left: $toggle-gutter;
      top: $toggle-gutter;
      width: $toggle-control-size;
      height: $toggle-control-size;
      border-radius: $toggle-radius;
      background: $toggle-control-color;
      transition: left $toggle-control-speed $toggle-control-ease;
      background-color: $toggle-background-color-on;
    }
  }
}

</style>