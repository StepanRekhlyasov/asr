<template>
    <div style="padding-top:25px;">
        <h2>Prices <button class="clearButton" @click="$emit('priceModal_show')" type="button">Add new Price</button></h2>
        <div class="formBlocks__wrapper wrapper_form" v-if="prices.length">
            <priceBlock v-for="price,index in prices" :key="index" :price="price" :id="id" @updatePrices="updateHandler()" @editForm="$emit('priceModal_show',price.ID)"/>
        </div>
        <p v-else>This partner doesn't have a price. Please, add at least one.</p>
    </div>
</template>
<script>
import {useStore} from 'vuex'
import {ref} from 'vue'
import priceBlock from './priceBlock.vue';

export default {
    props: ['id','prices'],
    components: { priceBlock },
    setup(props) {
        const store = useStore()
        return {
            // getPartnerPrices: () => store.dispatch('getPartnerPrices',props.id)
        }
    },
    methods: {
        updateHandler(){
            this.$emit('updatePrices')
        },
    }
    
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
        max-width: 370px;
        min-width: 240px;
    }
    @media (max-width:560px){
        .wrapper_form {
            padding: 30px 10px;
        }
    }
</style>