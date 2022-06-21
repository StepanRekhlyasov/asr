<template>
    <form class="wrapper_inner form_wrapper">
        <div class="input_wrapper" style="margin-right:20px">
            <p class="title">Type</p>
            <label>
            <input type="radio" value="dollars" name="ref_type" v-model="ref_type" @change="saveFields" :disabled="disable"/>
                $
            </label>
            <label>
                <input type="radio" value="percentages" name="ref_type" v-model="ref_type" @change="saveFields" :disabled="disable"/>
                %
            </label>
        </div>
        <div class="input_wrapper">
            <p class="title">Referral rate</p>
            <input type="number" name="ref_rate" @input="saveFields" v-model="ref_rate"  :disabled="disable"/>
        </div>
    </form>    
</template>
<script>
import {useStore} from 'vuex';
import {computed} from 'vue';
import {ref} from 'vue';

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
        disable: {
            type: Boolean
        }
    },
    data(){
        return {
            ref_rate : this.partner.data.meta.ref_rate,
            ref_type : this.partner.data.meta.type_ref_fee_rice,
        }
    },
    methods: {
        saveFields(){
            this.saveData = {
                user_id : this.id,
                acf : {
                    ref_rate : this.ref_rate?this.ref_rate:0,
                    type_ref_fee_rice : this.ref_type,
                }
            }
            this.saveUserData().then(()=>{
                this.$emit('updateForms')
            })
        }
    },
    setup(props) {
        const store = useStore()
        const saveData = ref({})
        return {
            saveData,
            partner: computed(() => store.getters.get_userByID(props.id)),
            saveUserData: () => store.dispatch('saveUserData',saveData)
        }
    },
    watch: {
        id(){
            this.ref_rate = this.partner.data.meta.ref_rate
            this.ref_type = this.partner.data.meta.type_ref_fee_rice
        }
    }
}
</script>
<style scoped>
.title{
    font-weight: 500;
    font-size: 16px;
    color: #000;
    margin-bottom: 5px;
}
label {
    cursor: pointer;
}
.wrapper_inner.form_wrapper{
    display: flex;
    padding: 0;
    margin-bottom: 20px;
}
</style>