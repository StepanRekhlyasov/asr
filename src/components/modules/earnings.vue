<template>
    <div class="earnings">
        <p>Earnings</p>
        <p>${{check(balance.profit)}}</p>
    </div>
</template>
<script>
import {useStore} from 'vuex'
import {computed} from 'vue'

export default {
    setup() {
        const store = useStore()
        return {
            balance: computed(() => store.getters.get_User.data.balance)
        }
    },
    methods: {
        check(value) {
            if(!value){
                return 0
            } else {
                return value
            }
        }
    }
}
</script>
<style scoped>
.earnings{
    text-align: center;
    font-weight: 400;
    font-size: 16px;
    color: #4A7589;
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid #4A7589;
    border-radius: 8px;
    padding: 5px 25px;
}
</style>