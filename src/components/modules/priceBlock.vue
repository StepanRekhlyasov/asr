<template>
    <div class="formBlock_wrapper">
        <button @click="delete_form()" class="button_delete clearButton">Delete</button>
        <p class="id">Price ID: {{price.ID}}</p>
        <p>Amount: ${{price.meta.cost}}</p>
        <p>Ref Fee: {{price.meta.ref_rate?parseInt(price.meta.ref_rate):partner.data.meta.ref_rate}}</p>
        <p>Ref Type: {{price.meta.type_ref_fee_rice?price.meta.type_ref_fee_rice:partner.data.meta.type_ref_fee_rice}}</p>
        <p>State: {{priceState.title}}</p>
        <p>Pays: {{price.meta.the_patient_pays}}</p>
        <!-- <p>Form: <a :href="form.permalink" target="_blank">{{form.permalink}}</a></p> -->
        <div class="info__form_buttons">
            <input :disabled="!edit_code" type="text" class="input_code" v-model="code">
            <button @click="edit_code_handler(true)" v-if="!edit_code">Edit</button>
            <button @click="edit_code_handler(false)" v-else>Save</button>
            <button @click="regenerate_code()">Generate</button>
        </div>
        {{error_code}}
        <button class="myButton" @click="$emit('editForm')">Edit</button>
    </div>
</template>
<script>
import {ref} from 'vue'
import {computed} from 'vue'
import {useStore} from 'vuex'
export default {
    props: ['price','id'],
    setup(props) {
        const store = useStore()
        const edit_code = ref(false)
        const code = ref(props.price.meta.coupon)
        const error_code = ref('')
        return {
            edit_code,
            error_code,
            code,
            host: computed(() => store.getters.getHost()),
            partner: computed(() => store.getters.get_userByID(props.id)),
            priceState: computed(() => store.getters.get_stateByID(props.price.meta.price_state)),
            deletePost: () => store.dispatch('deletePost',props.price.ID)
        }
    },
    watch: {
        price(newVal){
            this.code = newVal.meta.coupon
        }
    },
    methods: {
        edit_code_handler(edit){
            if(edit){
                this.edit_code = true
                return
            } else {
                if(this.price.meta.coupon===this.code){
                    this.edit_code = false
                    return
                }
                this.sdv_save_coupon_for_price()
            }
        },
        delete_form(){
            if(!window.confirm("Delete?")){
                return
            }
            this.deletePost().then((res) => {
                if (res.is_success === true) {
                    this.code = res.code
                    this.$emit('updatePrices')
                } else {
                    if (res.message) {
                        this.error_code = res.message;
                    } else {
                        this.error_code = 'unexpected error has occurred';
                    }
                    
                }
            })
        },
        regenerate_code(){
            this.edit_code = false;
            let data = new FormData();
            data.append('partner_id', this.id);
            data.append('price_id', this.price.ID );
            data.append('action', 'sdv_regenerate_price_coupon');
            fetch(this.host+'/ajax.php', {
                method: 'POST', 
                body: data,
            }).
            then((res) => {
                return res.json()
            }).
            then((res) => {
                if (res.status === true) {
                    this.code = res.code
                    this.error_code = '';
                    this.$emit('updatePrices')
                } else {
                    if (res.error) {
                        this.error_code = res.error;
                    } else {
                        this.error_code = 'unexpected error has occurred';
                    }
                    
                }
            })
        },
        sdv_to_valid_code(value) {
            value = value.replace( /[^A-Z0-9]/gi, '');
            if (value.length > 20) {
                value = value.slice(0,20);
            }
            return value;
        },
        sdv_save_coupon_for_price(){
            let code = this.code.toUpperCase();
            code = this.sdv_to_valid_code(code);
            if (code.length >= 8){
                let data = new FormData();
                data.append('code', code);
                data.append('price_id', this.price.ID );
                data.append('action', 'sdv_generate_price_coupon');
                fetch(this.host+'/ajax.php', {
                    method: 'POST', 
                    body: data,
                }).
                then((res) => {
                    return res.json()
                }).
                then((res) => {
                    if (res.status === true) {
                        this.edit_code = false
                        this.error_code = '';
                        this.$emit('updatePrices')
                    } else {
                        if (res.error) {
                            this.error_code = res.error;
                            if(res.error == 'This code is occupied.'){
                                this.edit_code = false
                            }
                        } else {
                            this.error_code = 'unexpected error has occurred';
                        }
                        
                    }
                })
            } else {
                this.error_code = 'Minimum length of coupon is 8 characters!';
            }
        }
    }
}
</script>
<style scoped>
.id {
    color: #4A7589;
    font-size: 12px;
}
.button_delete{
    position: absolute;
    top: 5px;
    right: 5px;
    color: #898989;
}
.info__form_buttons>button {
    background: none;
    border: none;
    outline: none;
    color: #4A7589;
    cursor: pointer;
}
.info__form_buttons>button:hover{
    text-decoration: underline;
}
.info__form_buttons{
    display: flex;
}
.input_code{
    width: 100%;
    max-width: 260px;
    padding: 12px;
    border-radius: 10px;
    text-transform: uppercase;
}
.formBlock_wrapper p {
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 10px;
}
.formBlock_wrapper{
    background: #F8FAFC;
    border-radius: 5px;
    padding: 15px;
    position: relative;
}
.myButton{
    margin-top: 30px;
}
</style>