<template>
<h1>My profile</h1>
<div class="wrapper_profile">
    <div class="widget widget_avatar">
        <img class="avatar_profile" :src="user.data.avatar.url">
        <div style="text-align:center">
            <b>{{user.data.display_name}}</b>
            <p v-for="role in user.roles" :key="role" style="text-transform: capitalize" class="sm_grey">{{role.replace(/_/g,' ', true)}}</p>
        </div>
        <earnings/>
        <p class="sm_grey">Registered: {{dateButifier(user.data.user_registered)}}</p>
    </div>
    <form class="widget" @submit.prevent="editInfo()">
        <button class="clearButton" v-if="!edit">Edit</button>
        <button class="clearButton" v-else>Save</button>
        <hr/>
        <div class="widget_grid">
            <div>
                <p class="sm_grey">Country</p>
                <p>USA</p>
            </div>
            <div>
                <p class="sm_grey">State</p>
                <select placeholder="Choose a state" v-model="saveData.acf.state" name="partner_state" v-if="edit">
                    <option v-for="state,index in states" :key="index" :value="state.id">{{state.title}}</option>
                </select>
                <p v-else>{{stateTitle_getByID(states,user.data.meta.state)}}</p>
            </div>
            <div>
                <p class="sm_grey">Phone</p>
                <input type="phone" v-model="saveData.acf.partner_phone_number" name="phone" placeholder="+1" @input="saveData.acf.partner_phone_number = replaceNumberForInput($event)" maxlength="17" minlength="17" v-if="edit"/>
                <p v-else>{{user.data.meta.partner_phone_number?user.data.meta.partner_phone_number:user.data.meta.patient_phone_number?user.data.meta.patient_phone_number:'None'}}</p>
            </div>
            <div>
                <p class="sm_grey">City</p>
                <input type="text" v-model="saveData.acf.city" name="city" v-if="edit"/>
                <p v-else>{{user.data.meta.city?user.data.meta.city:'None'}}</p>
            </div>
            <div>
                <p class="sm_grey">Street</p>
                <input type="text" v-model="saveData.acf.address" name="address" v-if="edit"/>
                <p v-else>{{user.data.meta.address?user.data.meta.address:'None'}}</p>
            </div>
            <div>
                <p class="sm_grey">Email</p>
                <p>{{user.data.user_email}}</p>
            </div>
            <div>
                <p class="sm_grey">Zip</p>
                <input type="text" v-model="saveData.acf.zip" name="zip" v-if="edit"/>
                <p v-else>{{user.data.meta.zip?user.data.meta.zip:'None'}}</p>
            </div>
            <div>
                <p class="sm_grey">NPI number</p>
                <p>-</p>
            </div>
        </div>
    </form>
</div>

</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { ref } from 'vue'
import earnings from '../components/modules/earnings.vue';
import { dateButifier, stateTitle_getByID, replaceNumberForInput } from '../helpers/helpers';

export default defineComponent({
    components: {earnings},
    setup() {
        const store = useStore()
        const edit = ref(false)
        const saveData = ref({})
        return {
            replaceNumberForInput,
            saveData,
            edit,
            dateButifier,
            stateTitle_getByID,
            fetch_User : () => store.dispatch('fetch_User'),
            fetchStates: () => store.dispatch('fetchStates'),
            user: computed(() => store.getters.get_User),
            states: computed(() => store.getters.getStates),
            saveUserData: () => store.dispatch('saveUserData',saveData)
        }
    },
    methods: {
        editInfo(){
            if(this.edit){
                this.edit = false
                this.saveUserData().then(()=>{
                    this.fetch_User()
                })
            } else {
                this.edit = true
            }
        }
    },
    mounted(){
        this.fetchStates()
        this.saveData = {
            user_id: this.user.ID,
            acf: {
                partner_phone_number: this.user.data.meta.partner_phone_number?this.user.data.meta.partner_phone_number:this.user.data.meta.patient_phone_number?this.user.data.meta.patient_phone_number:'',
                city: this.user.data.meta.city?this.user.data.meta.city:'',
                address: this.user.data.meta.address?this.user.data.meta.address:'',
                state: this.user.data.meta.state?this.user.data.meta.state:'',
                zip: this.user.data.meta.zip?this.user.data.meta.zip:'',
            }
            
        }
    }
})
</script>
<style scoped>
.clearButton{
    display: block;
    margin-left: auto;
}
.earnings {
    position: initial;
    background: #F5FEFF;
    width: 155px;
    padding: 5px 0;
}
.widget_avatar{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}
.wrapper_profile{
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}
.avatar_profile{
    border-radius: 50%;
}
.widget{
    background: #fff;
    padding: 20px 35px;
}
.widget_grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    height: calc(100% - 40px);
    margin-top: 20px;
}
.sm_grey{
    color: #989898;
}
@media (max-width:500px){
    .widget_grid {
        display: flex;
        flex-wrap: wrap;
        height: calc(100% - 30px);
        margin-top: 15px;
    }
    .widget {
        padding: 15px;
    }
}
</style>
