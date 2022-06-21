<template>
    <div class="wrapper">
        <div class="header">
            <div class="toggle__wrapper">
                <div @click="toggle=!toggle" class="toggle" :class="{'open':toggle}"></div>
            </div>
            <div class="header__info">
                <div class="header__name">{{coupon.data.code}}</div>
                <div><span class="sm_grey">ID:</span> {{coupon.data.id}}</div>
                <div><span class="sm_grey">Status:</span> {{coupon.data.active==='1'?'Active':'Deacivated'}}</div>
            </div>
            <div class="header__more">
                <div>
                    <div class="sm_grey">Name</div>
                    <div>{{coupon.data.post_name}}</div>
                </div>
                <div>
                    <div class="sm_grey">Date limit</div>
                    <div>{{datetimeButifier(coupon.data.coupon_date_limit)?datetimeButifier(coupon.data.coupon_date_limit):'no limit'}}</div>
                </div>
                <div>
                    <div class="sm_grey">Used</div>
                    <div>{{coupon.data.used}}</div>
                </div>
                <div>
                    <div class="sm_grey">Use limit</div>
                    <div>{{coupon.data.coupon_limit}}</div>
                </div>
                <div>
                    <div class="sm_grey">Discount</div>
                    <div>{{coupon.data.amount}}{{coupon.data.sale_type=='2'?'$':'%'}}</div>
                </div>
            </div>
            <div class="status"><span class="sm_grey">Status</span><toggleCheckbox :status="coupon.data.active==='1'?'on':'off'" @checkboxToggles="toggleCoupon_handler"/></div>
        </div>
        <div class="wrapper_inner" v-if="toggle">
            <button class="clearButton" @click="delete_coupon_handler">Delete</button>
            <p v-if="error">{{error}}</p>
            <p>{{coupon.data}}</p>
            <p>{{coupon.meta}}</p>
        </div>
    </div>
</template>
<script>
import { useStore } from 'vuex'
import toggleCheckbox from '../parts/toggleCheckbox.vue'
import { ref } from 'vue'
import { datetimeButifier } from '../../helpers/helpers'

export default {
    components: { toggleCheckbox },
    props: {
        coupon: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useStore()
        const saveData = ref({})
        const toggle = ref(false)
        const error = ref('')
        return {
            datetimeButifier,
            saveData,
            toggle,
            error,
            updateCoupon: () => store.dispatch('updateCoupon', saveData),
            delete_coupon: () => store.dispatch('delete_coupon', props.coupon.data.id),
        }
    },
    watch:{
        coupon() {
            this.toggle = false
        }
    }, 
    methods: {
        toggleCoupon_handler(status){
            this.saveData = {
                coupon_id : this.coupon.data.id,
                active : status=='on'?'1':'0'
            }
            this.updateCoupon()
        },
        delete_coupon_handler(){
            this.error = ''
            if(!window.confirm("Delete?")){
                return
            }
            this.delete_coupon().then((data)=>{
                if(data.success){
                    this.$emit('reload_coupons')
                } else {
                    this.error = data.error
                }
            })
        }
    }
}
</script>
<style scoped>
    .wrapper {
        background: #FFFFFF;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        width: 100%;
        margin-bottom: 40px;
    }
    .header{
        padding: 15px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        color: #383838;
    }
    .header__info{
        width: max-content;
        margin-right: 15px;
        font-size: 12px;
    }
    .header__more{
        width:100%;
        background: #F5FEFF;
        border-radius: 5px;
        padding: 18px 30px;
        margin-right: 15px;
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }
    .sm_grey{
        font-size: 12px;
        color: #989898;
        margin-bottom: 5px;
    }
    .header__name {
        font-weight: 700;
        font-size: 18px;
        color: #2E2E2E;
    }
    .toggle{
        width: 12px;
        height: 12px;
        border-bottom: 2px solid #000;
        border-right: 2px solid #000;
        transform: rotate(45deg);
        cursor: pointer;
    }
    .toggle__wrapper{
        width: 10px;
        margin-right: 15px;
    }
    .toggle.open {
        transform: rotate(-135deg);
    }
    .wrapper_inner{
        padding: 40px 30px;
        font-size: 16px;
        max-width: 100%;
        border-top: 1px solid #CECECE;
        border-bottom: 1px solid #CECECE;
    }
</style>