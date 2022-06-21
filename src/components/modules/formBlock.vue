<template>
    <div class="formBlock_wrapper">
        <button @click="delete_form()" class="button_delete clearButton">Delete</button>
        <p class="id">ID: {{form.ID}}</p>
        <p class="id" v-if="form.price">Price ID: 
            <select v-model="addPrice" @change="save_addPrice_handler()">
                <option v-for="price in partner.prices" :key="price" :value="price.ID">{{price.ID}}</option>
            </select>
        </p>
        <p style="color:red" v-else>This form doesn't have price!</p>
        <p v-if="form.price">Amount: ${{form.price.meta.cost}}</p>
        <p v-if="form.price">Ref Fee: {{form.price.meta.ref_rate?parseInt(form.price.meta.ref_rate):partner.data.meta.ref_rate}}</p>
        <p v-if="form.price">Ref Type: {{form.price.meta.type_ref_fee_rice?form.price.meta.type_ref_fee_rice:partner.data.meta.type_ref_fee_rice}}</p>
        <p v-if="priceState">State: {{priceState.title}}</p>
        <p v-if="form.price">Pays: {{form.price.meta.the_patient_pays}}</p>
        <p>Form: <a :href="form.permalink" target="_blank">{{form.permalink}}</a></p>
        <p class="clearButton" @click="QR_handler()" v-if="form.permalink">QR (Download QR)</p>
        <div class="info__form_buttons" v-if="priceState">
            <input :disabled="!edit_code" type="text" class="input_code" v-model="code">
            <button @click="edit_code_handler(true)" v-if="!edit_code">Edit</button>
            <button @click="edit_code_handler(false)" v-else>Save</button>
            <button @click="regenerate_code()">Generate</button>
        </div>
        {{error_code}}
        <button class="myButton" @click="$emit('editForm')" v-if="form.price">Edit</button>
        <label v-else>
            Select Price
            <select v-model="addPrice" @change="save_addPrice_handler()">
                <option v-for="price in partner.prices" :key="price" :value="price.ID">{{price.ID}}</option>
            </select>
        </label>
        <qrModal v-if="form.permalink&&showQrModal" :link="form.permalink" @closeQR="QR_handler()"/>
    </div>
</template>
<script>
import {ref} from 'vue'
import {computed} from 'vue'
import {useStore} from 'vuex'
import qrModal from '../modals/qrModal.vue'

export default {
    props: ['form','id'],
    components: { qrModal },
    setup(props) {
        const store = useStore()
        const edit_code = ref(false)
        const showQrModal = ref(false)
        const code = ref(props.form.price?props.form.price.meta.coupon:'')
        const error_code = ref('')
        const addPrice = ref(props.form.price?props.form.price.ID:null)
        return {
            addPrice,
            edit_code,
            error_code,
            code,
            showQrModal,
            host: computed(() => store.getters.getHost()),
            partner: computed(() => store.getters.get_userByID(props.id)),
            deletePost: () => store.dispatch('deletePost',props.form.ID),
            priceState: computed(() => store.getters.get_stateByID(props.form.price?props.form.price.meta.price_state:null)),
            save_addPrice: () => store.dispatch('save_addPrice', { form_id : props.form.ID, price_id: addPrice }),
        }
    },
    watch: {
        form(newVal){
            this.code = newVal.price?newVal.price.meta.coupon:''
        }
    },
    methods: {
        QR_handler(){
            this.showQrModal = !this.showQrModal
        },  
        save_addPrice_handler() {
            this.save_addPrice().then(()=>{
                 this.$emit('updateForms')
            })
        },
        edit_code_handler(edit){
            if(edit){
                this.edit_code = true
                return
            } else {
                if(this.form.price.meta.coupon===this.code){
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
                    this.$emit('updateForms')
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
            data.append('price_id', this.form.price.ID );
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
                    this.$emit('updateForms')
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
                data.append('price_id', this.form.price.ID );
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
                        this.$emit('updateForms')
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