<template>
    <div class="wrapper_inner wrapper_inner__borders">
        <div class="info">
            <div class="header__more show_900">
                        <div>
                            <div class="bold">Date of creation</div>
                            <div>{{dateButifier(partner.data.user_registered)}}</div>
                        </div>
                        <div>
                            <div class="bold">Email</div>
                            <div>{{partner.data.user_email}}</div>
                        </div>
                        <div>
                            <div class="bold">Website</div>
                            <div>{{partner.data.meta.partner_website?partner.data.meta.partner_website:'none'}}</div>
                        </div>
                        <div>
                            <div class="bold">Orders</div>
                            <div>{{partner.data.orders.total}}</div>
                        </div>
                        <div>
                            <div class="bold">Paid</div>
                            <div>{{partner.data.orders.paid}}</div>
                        </div>
            </div>
            <form class="info__form" @submit.prevent="editInfo">
                
                <div class="info__form_wrapper" style="margin-bottom: 40px">  
                    <label class="grey">Referral link:
                        <div class="info__form_ref">{{host}}/?ref={{id}}</div>
                    </label>
                    <label class="grey" v-if="get_User.caps.admin_sales_rep && (partner.caps.partner || partner.caps.doctor || partner.caps.offline_doctor)">Sales rep:
                        <select class="info__select" v-model="partner.data.meta.related_sales_rep" @change="changeRelation">
                                <option v-for="sr,index in salesReps" :key="index" :value="sr.data.ID">{{sr.data.display_name}}</option>
                        </select>
                    </label>
                </div>
                <changeRefType :id="id" :ukey="ukey" v-if="partner.caps.partner" :disable="!edit" @updateForms="updateHandler()"/>
                <div class="info__form_wrapper">
                    <div class="wrapper_names">
                        <div class="wrapper_name">
                        <label class="golden">First name</label>
                        <input class="input_name" :value="partner.data.meta.first_name" :disabled="!edit" name="first">
                        </div>
                        <div class="wrapper_name">
                            <label class="golden">Last name</label>
                            <input class="input_name" :value="partner.data.meta.last_name" :disabled="!edit" name="last">
                        </div>
                        <div class="wrapper_name">
                            <label class="golden">Display name</label>
                            <select name="display_name" :disabled="!edit">
                                <option selected>{{partner.data.display_name}}</option>
                                <option :value="partner.data.meta.first_name+' '+' '+partner.data.meta.last_name">{{partner.data.meta.first_name}} {{partner.data.meta.last_name}}</option>
                                <option :value="partner.data.meta.last_name+' '+' '+partner.data.meta.first_name">{{partner.data.meta.last_name}} {{partner.data.meta.first_name}}</option>
                                <option :value="partner.data.meta.first_name">{{partner.data.meta.first_name}}</option>
                                <option :value="partner.data.meta.last_name">{{partner.data.meta.last_name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="info__form_buttons">
                        <button v-if="!edit">Edit</button>
                        <button v-else>Save</button>
                    </div>
                </div>
               
                
            </form>
            <template v-if="partner.caps.partner">
                <formModal :id="id" v-if="show_formModal" @updateForms="updateHandler()"/>
                <priceModal :id="id" :price_for_edit="price_for_edit" v-if="show_priceModal" @updateForms="updateHandler()"/>
                <formComponent :id="id" :ukey="ukey" :formProp="partnerForms" @updateForms="updateHandler()"/>
                <priceComponent :id="id" :prices="prices" @updatePrices="updateHandler()" @priceModal_show="show_formModal_handler"/>
            </template>
        </div>
    </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { ref } from 'vue'
import formComponent from '../modules/formComponent.vue';
import priceComponent from '../modules/priceComponent.vue';
import changeRefType from '../partners/changeRefType.vue';
import { dateButifier } from '../../helpers/helpers';
import formModal from '../modals/formModal.vue';
import priceModal from '../modals/priceModal.vue';

export default {
    props: {
        id: {
            type: Number,
            required: true
        }, 
        ukey: {
            type: Number,
            required: true
        },
    },
    components: { formComponent,changeRefType,formModal,priceComponent,priceModal },
    setup(props) {
        const store = useStore()
        const edit = ref(false)
        const saveData = ref({})
        const relationData = ref({})
        const partnerForms = ref({})
        const show_formModal = ref(false)
        const show_priceModal = ref(false)
        const prices = ref([])
        const price_for_edit = ref(null)
        return {
            edit,
            prices,
            price_for_edit,
            dateButifier,
            saveData,
            relationData,
            partnerForms,
            show_formModal,
            show_priceModal,
            partner: computed(() => store.getters.get_userByID(props.id)),
            updateUser: () => store.dispatch('getUser',props.id),
            host: computed(() => store.getters.getHost()),
            saveUserData: () => store.dispatch('saveUserData',saveData),
            updateRelation: () => store.dispatch('updateRelation', relationData ),
            get_User: computed(()=> store.getters.get_User),
            salesReps: computed(()=> store.getters.get_usersByRole('sales_rep')),
            getPartnerForms: () => store.dispatch('getPartnerForms',props.id),
            getPartnerPrices: () => store.dispatch('getPartnerPrices',props.id),
        }
    },
    methods: {
        editInfo(e){
            this.edit = !this.edit
            if(this.edit){
                return
            }
            this.saveData = {
                user_id: this.id,
                wp: {
                    first_name : e.target.elements.first.value,
                    last_name: e.target.elements.last.value,
                    display_name: e.target.elements.display_name.value
                }
            }
            this.saveUserData().then(()=>{
                this.updateHandler()
            })
        },
        show_formModal_handler(price_id){
            this.price_for_edit = price_id
            this.show_priceModal = true
        },
        formModal__handler(){
            this.show_formModal = true
        },
        changeRelation(){
            this.relationData = {
                user_id: this.id,
                sales_rep: this.partner.data.meta.related_sales_rep,
            },
            this.updateRelation().then(()=>{
                this.updateHandler()
            })
        },
        updateHandler(){
            this.show_formModal = false
            this.updateUser()
            this.getPartnerForms().then((data)=>{
                if(data){
                    this.partnerForms = data
                } else {
                    this.partnerForms = []
                } 
            })
            this.getPartnerPrices().then((data)=>{
                if(data){
                    this.prices = data
                } else {
                    this.prices = []
                }
            })
        },
    },
    mounted(){
        if(this.partner.caps.partner){
            this.updateHandler()
        }
    }
}
</script>
<style scoped>
    .wrapper_buttons{
        padding: 10px;
        display: flex;
        justify-content: space-around;
    }
    .wrapper_buttons button{
        max-width: 200px;
    }
    .info__form_ref {
        color: #000;
    }
    .info__form_buttons{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    label.grey {
        margin-bottom: 5px;
        display: block;
    }
    .wrapper_names{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
    }
    .info__select {
        max-width: 340px;
        width: 100%;
        padding: 8px;
        border-radius: 10px;
    }
    .info__form_buttons>button{
        border:none;
        outline:none;
        background: none;
        color: #4A7589;
        cursor: pointer;
        padding: 0;
    }
    .info__form_buttons>button:hover{
        text-decoration: underline;
    }
    .wrapper_inner{
        padding: 40px 30px;
        font-size: 16px;
        max-width: 100%;
    }
    .wrapper_inner__borders{
        border-top: 1px solid #CECECE;
        border-bottom: 1px solid #CECECE;
    }
    .wrapper_name{
        min-width: 180px;
        display: flex;
        flex-direction: column;
    }
    .wrapper_name label {
        margin-bottom: 5px;
    }
    .wrapper_name select {
        max-width: 100%;
        padding: 2px;
    }
    .input_name{
        max-width: 100%;
    }
    .input_name:disabled{
        background: none;
        border: none;
    }
    .grey{
        color: #989898;
    }
    .info__form{
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #989898;
        padding-bottom: 25px;
    }
    .info__form_wrapper{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        gap: 25px;
    }
    @media (max-width:560px){
        .wrapper_inner {
            padding: 30px 10px;
        }
    }
    .header__more {
        display: flex;
        gap: 25px;
        flex-wrap: wrap;
        margin-bottom: 25px;
    }
    .show_900 {
        display: none;
    }
    @media (max-width:900px){
        .show_900 {
            display: flex;
        }
        .hide_900 {
            display: none;
        }
    }
</style>