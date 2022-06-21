<template>
    <div class="modal_blackout" @click.self="$parent.show_priceModal=false">
        <div class="modal_window">
            <div class="modal_close" @click.self="$parent.show_priceModal=false">Close</div>
            <h2 v-if="priceObject.ID">Edit Price {{priceObject.ID}}</h2>
            <h2 v-else>Create Partner Price</h2>
            <form class="modal_form" @submit.prevent="saveHandler">
                <div class="input_wrapper">
                        <label>Pays:
                            <select v-model="priceObject.meta.the_patient_pays">
                                <option value="patient">Patient</option>
                                <option value="partner">Partner</option>
                            </select>
                        </label>
                </div>
                 <div class="input_wrapper">
                    <label>
                        Cost
                        <input type="number" v-model="priceObject.meta.cost"/>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        Title
                        <input type="text" v-model="priceObject.meta.title"/>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        State
                        <select v-model="priceObject.meta.price_state">
                            <option v-for="state in getStates" :key="state" :value="state.id">{{state.title}}</option>
                        </select>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        Ref Type
                        <select v-model="priceObject.meta.type_ref_fee_rice">
                            <option value="">not set</option>
                            <option value="percentages">%</option>
                            <option value="dollars">$</option>
                        </select>
                    </label>
                </div>
                <div class="input_wrapper">
                    <label>
                        Ref Fee
                        <input type="number" v-model="priceObject.meta.ref_rate"/>
                    </label>
                </div> 
                <button class="myButton" :disabled="disabled">Save</button>
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
        price_for_edit: {
            type: Number,
            required: false
        }
    },
    setup(props) {
        const store = useStore()
        const error_message = ref('')
        const priceObject = ref({
            ID: '',
            meta: {
                the_patient_pays: 'patient',
                title: '',
                cost: '',
                price_state: '',
                ref_rate: '',
                type_ref_fee_rice: ''
            }
        })
        const disabled = computed(() => {
            if(!priceObject.value.meta.title||!priceObject.value.meta.cost||!priceObject.value.meta.price_state){
                return true
            } else {
                return false
            }
        }, priceObject )
        const priceComputed = props.price_for_edit?computed(() => store.getters.get_userByID(props.id).prices.find(item => item.ID == props.price_for_edit)):null
        return {
            disabled,
            priceObject,
            priceComputed,
            error_message,
            host: computed(() => store.getters.getHost()),
            getStates: computed(() => store.getters.getStates),
        }
    },
    methods: {
        saveHandler(){
            let saveData = {
                ID: this.priceObject.ID,
                meta: {
                    the_patient_pays: this.priceObject.meta.the_patient_pays,
                    title: this.priceObject.meta.title,
                    cost: this.priceObject.meta.cost,
                    price_state: this.priceObject.meta.price_state,
                    ref_rate: this.priceObject.meta.ref_rate,
                    type_ref_fee_rice: this.priceObject.meta.type_ref_fee_rice
                }
            }
            this.savePrice(saveData)
        },
        savePrice(saveData){
            let data = new FormData();
            data.append('user_id', this.id);
            data.append('price_id', saveData.ID);
            data.append('title', saveData.meta.title);
            data.append('cost', saveData.meta.cost );
            data.append('the_patient_pays', saveData.meta.the_patient_pays );
            data.append('type_ref_fee_rice', saveData.meta.type_ref_fee_rice );
            data.append('ref_rate', saveData.meta.ref_rate );
            data.append('price_state', saveData.meta.price_state );

            data.append('action', 'VueAccount_savePrice');
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
                    this.$parent.show_priceModal=false
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
    created() {
        if(this.priceComputed){
            this.priceObject = JSON.parse(JSON.stringify(this.priceComputed))
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