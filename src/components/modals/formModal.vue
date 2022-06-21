<template>
    <div class="modal_blackout" @click.self="$parent.show_formModal=false">
        <div class="modal_window">
            <div class="modal_close" @click.self="$parent.show_formModal=false">Close</div>
            <form class="modal_form" @submit.prevent="saveHandler">
                <h2 v-if="form_id">Edit Partner Form</h2>
                <h2 v-else>Create Partner Form</h2>
                <div class="input_wrapper">
                        <label>The patient pays
                            <input type="checkbox" v-model="patient_pays" name="patient_pays"/>
                        </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        Price
                        <input type="number" v-model="formData.price.meta.cost" name="cost"/>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        Title
                        <input type="text" v-model="formData.post_title" name="title"/>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        State
                        <select v-model="formData.meta.state_form" name="state">
                            <option v-for="state in getStates" :key="state" :value="state.id">{{state.title}}</option>
                        </select>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        Ref Type
                        <select v-model="formData.price.meta.type_ref_fee_rice" name="type_ref_fee_rice">
                            <option value="">not set</option>
                            <option value="percentages">%</option>
                            <option value="dollars">$</option>
                        </select>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        Ref Fee
                        <input type="number" v-model="formData.price.meta.ref_rate" name="ref_rate"/>
                    </label>
                </div>  
                <button class="myButton" :disabled="disabled || disabled_static">Save</button>
                <p v-if="error_message" style="margin-top:10px">{{error_message}}</p>
            </form>
        </div>
    </div>
</template>
<script>
import {useStore} from 'vuex'
import {computed} from 'vue'
import {ref} from 'vue'

export default {
    props: {
        id: {
            type: Number,
            required: true
        },
        form_id: {
            type: Number,
            required: false
        }
    },
    setup(props) {
        const store = useStore()
        let form = ref(()=>{return new Promise});
        const saveData = ref({})
        const formData = ref({
            price: {
                ID : null,
                meta: {
                    cost: '',
                    type_ref_fee_rice: 'percentages',
                    ref_rate: 10,
                }
            },
            post_title: '',
            meta: {
                state_form: 6913,
            }
        })
        const error_message = ref('')
        const disabled_static = ref(false)
        if(props.form_id){
            const host = computed(() => store.getters.getHost())
            form = async () => {
            let data = new FormData();
                data.append('action', 'VueAccount_getForm');
                data.append('form_id', props.form_id);
                const result = await fetch( host.value+'/ajax.php', {
                    method: 'POST',
                    body: data
                });
                return new Promise((resolve, reject) => {
                    result.json().then((answer) => {
                        resolve(answer);
                    }).catch((err) => {
                        reject(err);
                    })
                });
            }   
        }
        return {
            formData,
            form,
            saveData,
            error_message,
            disabled_static,
            updatePost: () => store.dispatch('updatePost',saveData),
            host: computed(() => store.getters.getHost()),
            getStates: computed(() => store.getters.getStates),
        }
    },
    mounted( ){
        if(this.form_id){
            this.disabled_static = true
            this.form().then((data)=>{
                this.formData = data
                if(data.price){
                    if(data.price.meta.the_patient_pays=='patient'){
                        this.patient_pays = true
                    }
                    if(parseInt(data.price.meta.is_refferal)){
                        this.is_refferal = true
                    } else {
                        this.is_refferal = false
                    }
                } else {
                    this.formData.price = {
                        ID : null,
                        meta: {
                            cost: '',
                            type_ref_fee_rice: 'percentages',
                            ref_rate: 10,
                        }
                    }
                }
                this.disabled_static = false
            })
        }
    },
    computed:{
        disabled(){
            if(!this.formData.price.meta.cost || !this.formData.post_title){
                return true
            }
        }
    },
    methods: {
        saveHandler(e){
            if(e.target.patient_pays.checked){
                var patient_pays = 'patient'
            } else {
                var patient_pays = 'partner'
            }

            let data = {
                patient_pays : patient_pays,
                cost : e.target.cost.value,
                title : e.target.title.value,
                type_ref_fee_rice : e.target.type_ref_fee_rice.value,
                ref_rate : e.target.ref_rate.value,
                state : e.target.state.value
            }

            if(this.form_id){
                this.updateForm(data)
            } else {
                this.createForm(data)
            }
            
        },
        updateForm(value){
            let data = new FormData();
            data.append('partner_id', this.id);
            data.append('form_id', this.form_id );
            data.append('price_id', this.formData.price.ID );
            data.append('title', value.title);
            data.append('price_value', value.cost );
            data.append('the_patient_pays', value.patient_pays );
            data.append('type_ref_fee_rice', value.type_ref_fee_rice );
            data.append('ref_rate', value.ref_rate );
            data.append('state', value.state );


            data.append('action', 'VueAccount_update_formPrice');
            fetch(this.host+'/ajax.php', {
                method: 'POST', 
                body: data,
            }).then((res) => {
                return res.json()
            }).then((res)=>{
                if(res.success){
                    this.$emit('updateForms')
                }
            })
        },
        createForm(value){
            let data = new FormData();
            data.append('partner_id', this.id);
            data.append('title', value.title);
            data.append('price_value', value.cost );
            data.append('the_patient_pays', value.patient_pays );

            data.append('type_ref_fee_rice', value.type_ref_fee_rice );
            data.append('ref_rate', value.ref_rate );
            data.append('state', value.state );

            data.append('action', 'VueAccount_createPriceForm');
            fetch(this.host+'/ajax.php', {
                method: 'POST', 
                body: data,
            }).
            then((res) => {
                return res.json()
            }).
            then((res) => {
                if (res.is_success === true) {
                    this.$emit('updateForms')
                } else {
                    if (res.message) {
                        this.error_message = res.message;
                    } else {
                        this.error_message = 'unexpected error has occurred';
                    }
                    
                }
            })
        }
    },
    data(){
        return {
            patient_pays: false,
            is_refferal: true,
            post_title_form: this.formData.post_title,
            post_title_price: this.formData.price.post_title,
        }
    },
}
</script>
<style scoped>
label {
    cursor: pointer;
    display: flex;
    align-items: center;
}
.modal_form{
    display: flex;
    flex-direction: column;
}
.input_wrapper{
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}
.modal_blackout{
    background: #000000a3;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal_window{
    display: block;
    position: relative;
    background: #fff;
    padding: 40px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    z-index: 11;
}
.modal_close{
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
    color: #4A7589;
}
.modal_close:hover{
    text-decoration: underline;
}
input,select {
    margin: 0 10px;
}
h2 {
    margin: 0 0 25px;
}
</style>