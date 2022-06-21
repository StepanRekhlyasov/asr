<template>
<div style="padding-top:25px;">
    <h2>Forms <button class="clearButton" @click="formModal__handler()" type="button">Add new Form and Price</button></h2>
    <div class="formBlocks__wrapper wrapper_form"  v-if="partnerForms.length">
            <formBlock v-for="form, index in partnerForms" :key="index" :form="form" :id="id" @editForm="formModal__handler(form.ID)" @updateForms="updateHandler()"/>
    </div>
    <p v-else>This partner doesn't have a form. Please, add at least one.</p>
    <formModal :form_id="form_id" :id="id" v-if="show_formModal" @updateForms="updateHandler()"/>
</div>
</template>
<script>
import formModal from '../modals/formModal.vue';
import changeRefType from '../partners/changeRefType.vue';
import formBlock from './formBlock.vue';
import {ref} from 'vue';
import {useStore} from 'vuex';

export default {
    components: {formModal,formBlock,changeRefType},
    props: {
        id: {
            type: Number,
            required: true
        },
        ukey: {
            type: Number,
            required: true
        },
        formProp: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useStore()
        const show_formModal = ref(false)
        const form_id = ref(0)
        const partnerForms = ref(props.formProp)
        return {
            show_formModal,
            form_id,
            partnerForms,
            getPartnerForms: () => store.dispatch('getPartnerForms',props.id)
        }
    },
    watch: {
        id(){
            this.getPartnerForms().then((data)=>{
                this.partnerForms = data
            })
        },
        formProp(newVal){
            this.partnerForms = newVal
        }
    },
    methods: {
        formModal__handler(form_id){
            if(form_id){
                this.form_id = form_id
            } else {
                this.form_id = 0
            }
            this.show_formModal = true
        },
        updateHandler(){
            this.show_formModal = false
            this.$emit('updateForms')
        }
    },

}
</script>
<style scoped>
    .wrapper_form{
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
    }
    .myButton{
        max-width: 200px;
    }
    .formBlocks__wrapper{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 25px;
    }
    .formBlocks__wrapper>div {
        width: 100%;
        max-width: calc(50% - 50px);
    }
    @media (max-width:1000px){
        .formBlocks__wrapper>div {
            max-width: 370px;
        }
    }
    @media (max-width:560px){
        .wrapper_form {
            padding: 30px 10px;
        }
    }
</style>