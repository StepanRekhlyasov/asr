<template>
    <div class="modal_blackout" @click.self="$emit('closeCoupon')">
        <div class="modal_window">
            <div class="modal_close" @click.self="$emit('closeCoupon')">Close</div>
            <form class="modal_form" @submit.prevent="saveHandler">
                <h2>Create Admin Coupon</h2>
                <div class="fieldGroup">
                    <label>
                        Coupon name
                        <input type="text" v-model="saveData.coupon_name" required>
                    </label>
                    <label>
                        Date limit
                        <input type="datetime-local" v-model="saveData.coupon_date_limit">
                    </label>
                    <label>
                        Use limit
                        <input type="number" v-model="saveData.coupon_limit">
                    </label>
                    <label>
                        Code
                        <input type="text" v-model="saveData.coupon_code" required>
                        <button class="clearButton" type="button" @click="reload_handler">Reload</button>
                    </label>
                    <label>
                        <p>Coupon type</p>
                        <label>
                            <input type="radio" value="1" name="type" v-model="saveData.coupon_type">
                            %
                        </label>
                        <label>
                            <input type="radio" value="2" name="type" v-model="saveData.coupon_type">
                            $
                        </label>
                    </label>
                    <label>
                        Amount
                        <input type="number" v-model="saveData.discount_value" required>
                    </label>
                    <label>
                        Multiple
                        <input type="number" v-model="saveData.counter">
                    </label>
                </div>
                <button class="myButton">Save</button>
                <p v-if="error" style="text-align:center">{{error}}</p>
            </form>
        </div>
    </div>
</template>
<script>
import { useStore } from 'vuex'
import { ref } from 'vue'

export default {
    setup() {
        const store = useStore()
        const saveData = ref({
            coupon_name : '',
            coupon_date_limit : '',
            coupon_limit: 1,
            coupon_code: '',
            coupon_type: 1,
            discount_value: '',
            counter: 1,
            role: 'admin_sales_rep',
            is_admin_coupon: true
        })
        const error = ref('')
        return {
            saveData,
            error,
            reload_coupon_generated_code : () => store.dispatch('reload_coupon_generated_code'),
            createCoupon : () => store.dispatch('createCoupon',saveData),
            fetch_adminCoupons : () => store.dispatch('fetch_adminCoupons'),
        }
    },
    methods: {
        saveHandler(){
            if(this.saveData.coupon_type==1 && this.saveData.discount_value>100){
                this.error = '100% maximum'
                return
            }
            this.createCoupon().then((data)=>{
                if(data.success){
                    this.fetch_adminCoupons().then(()=>{
                        this.$emit('closeCoupon')
                    })
                } else {
                    this.error = data.message
                }
            })
        },
        reload_handler(){
            this.reload_coupon_generated_code().then((data)=>{
                this.saveData.coupon_code = data
            })
        }
    },
    mounted(){
        this.reload_handler()
    }
}
</script>
<style scoped>
    label {
        cursor: pointer;
    }
    .fieldGroup{
        margin-bottom: 25px;
        display: flex;
        flex-direction: column;
    }
    .fieldGroup label {
        margin-bottom: 15px;
    }
    .modal_blackout{
        background: #000000a3;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 22;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal_window{
        display: block;
        position: relative;
        background: #fff;
        padding: 40px;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        z-index: 11;
    }
    .modal_close{
        position: absolute;
        right: 20px;
        top: 10px;
        cursor: pointer;
        color: #4A7589;
    }
    .modal_close:hover{
        text-decoration: underline;
    }
</style>