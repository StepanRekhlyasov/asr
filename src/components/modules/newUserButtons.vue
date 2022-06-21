<template>
    <div>
        <div class="newPartner" @click="showModal_handler('partner')">
            <p>New Partner</p>
        </div>
        <div class="newPartner" @click="showModal_handler('sales_rep')" v-if="user.caps.admin_sales_rep">
            <p>New Sales Rep</p>
        </div>
        <div class="newPartner" @click="showCouponModal_handler()" v-if="user.caps.admin_sales_rep">
            <p>New Coupon</p>
        </div>
        <partnerModal v-if="showModal" @close="showModal=false" :role="role"/>
        <couponModal v-if="showCouponModal" @closeCoupon="showCouponModal_handler"/>
    </div>
</template>
<script>
import {ref} from 'vue'
import {computed} from 'vue'
import {useStore} from 'vuex'
import partnerModal from '../modals/partnerModal.vue'
import couponModal from '../modals/couponModal.vue'

export default {
    methods: {
        showModal_handler(role){
            this.role = role
            this.showModal = true
        },
        showCouponModal_handler(){
            this.showCouponModal = !this.showCouponModal
        }
    },
    components: { partnerModal,couponModal },
    setup(){
        const showModal = ref(false)
        const showCouponModal = ref(false)
        const role = ref('')
        const store = useStore()
        return {
            role,
            showModal,
            showCouponModal,
            user: computed(() => store.getters.get_User),
        }
    }
}
</script>
<style scoped>
    .newPartner{
        border: 2px dashed #4A7589;
        border-radius: 10px;
        color: #4A7589;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        margin: 0 35px;
        font-weight: 500;
        font-size: 16px;
        cursor: pointer;
        user-select: none;
        margin-bottom: 20px;
    }
    .newPartner:hover{
        border: 2px solid #4A7589;
        font-weight: 700;
    }
    @media (max-width:900px){
        .newPartner {
            margin: 0 0 20px;
        }
    }
</style>