<template>
    <div class="wrapper">
        <div class="header" :class="{opened:toggle}">
            <div class="toggle__wrapper">
                <div @click="toggle=!toggle" class="toggle" :class="{'open':toggle}"></div>
            </div>
                    <div class="header__info">
                        <div class="header__name">{{partner.data.display_name}}</div>
                        <div class="header__id"><span class="sm_grey">ID:</span> {{partner.ID}}</div>
                        <p class="sm_grey" style="text-transform:capitalize;">{{partner.roles.join(", ").replace("_"," ")}}</p>
                        <div class="header__id show_900"><span class="sm_grey">Balance:</span> ${{balance_toFixed(partner.data.balance.profit)}}</div>
                        <div class="hide_900"><span class="sm_grey">Contact phone:</span> <span>{{partner.data.meta.partner_phone_number}}</span></div>
                    </div>
                    <div class="header__more hide_900">
                        <div>
                            <div class="sm_grey">Date of creation</div>
                            <div>{{dateButifier(partner.data.user_registered)}}</div>
                        </div>
                        <div>
                            <div class="sm_grey">Email</div>
                            <div>{{partner.data.user_email}}</div>
                        </div>
                        <div>
                            <div class="sm_grey">Website</div>
                            <div>{{partner.data.meta.partner_website?partner.data.meta.partner_website:'none'}}</div>
                        </div>
                        <div>
                            <div class="sm_grey">Balance</div>
                            <div>${{balance_toFixed(partner.data.balance.profit)}}</div>
                        </div>
                        <div>
                            <div class="sm_grey">Orders</div>
                            <div>{{partner.data.orders.total}}</div>
                        </div>
                        <div>
                            <div class="sm_grey">Paid</div>
                            <div>{{partner.data.orders.paid}}</div>
                        </div>
                    </div>
            <div class="status"><span class="sm_grey">Status</span><toggleCheckbox :status="partner.data.meta.activate_user" @checkboxToggles="toggleUser_handler()" :ukey="ukey" :id="id"/></div>
        </div>
        <partnerBadgeInner :id="id" v-if="toggle" :ukey="ukey"/>
    </div>
</template>
<script>
import {ref} from 'vue';
import toggleCheckbox from '../parts/toggleCheckbox.vue';
import partnerBadgeInner from '../partners/partnerBadgeInner.vue';
import { balance_toFixed , dateButifier } from '../../helpers/helpers';
import { useStore } from 'vuex'
import { computed } from 'vue'

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
    components: {toggleCheckbox, partnerBadgeInner},
    setup(props) {
        const toggle = ref(false);
        const store = useStore();
        const saveData = ref({});
        const ukey = ref(1);
        return {
            ukey,
            balance_toFixed,
            toggle,
            dateButifier,
            toggleUser : () => store.dispatch('toggleUser', props.id),
            partner: computed(() => store.getters.get_userByID(props.id)),
            saveUserData: () => store.dispatch('saveUserData',saveData)
        }
    },
    methods: {
        toggleUser_handler(){
            this.toggleUser()
        }
    },
    watch: {
        id(){
            this.toggle = false
        }
    }
}
</script>
<style scoped>
    .wrapper{
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
    .header__info{
        width:100%;
        max-width: 210px;
        margin-right: 15px;
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
    .status {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: auto;
    }
    .show_900 {
        display: none;
    }
    @media (max-width:900px){
        .show_900 {
            display: block;
        }
        .hide_900 {
            display: none;
        }
    }
</style>