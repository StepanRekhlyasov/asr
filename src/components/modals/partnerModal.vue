<template>
    <div class="modal_blackout" @click.self="$emit('close')">
        <div class="modal_window">
            <div class="modal_close" @click.self="$emit('close')" v-if="step===1">Close</div>
            <div class="modal_close" @click.self="step=1" v-else>Back</div>
            <form class="modal_form" @submit.prevent="saveHandler">
                <h2>Create account {{role.replace('_',' ')}}</h2>
                <template v-if="step===1">
                    <div style="display:flex;justify-content:space-between;">
                        <label style="max-width:calc(50% - 5px)">First name
                            <input type="text" v-model="userObject.first_name" name="first_name" placeholder="Jane" required @input="userObject.first_name = onlyLetters($event)"/>
                        </label>
                        <label style="max-width:calc(50% - 5px)">Last name
                            <input type="text" v-model="userObject.last_name" name="last_name" placeholder="Doe" required @input="userObject.last_name = onlyLetters($event)"/>
                        </label>
                    </div>
                    <label>Email
                        <input type="email" v-model="userObject.email" name="email" placeholder="Enter your email" required/>
                    </label>
                    <label>Phone
                        <input type="phone" v-model="userObject.phone" name="phone" placeholder="+1" required @input="userObject.phone = replaceNumberForInput($event)" maxlength="17" minlength="17"/>
                    </label>
                    <label>Website
                        <input type="text" v-model="userObject.website" name="website" placeholder="URL"/>
                    </label>
                    <label>
                        State
                        <select placeholder="Choose a state" v-model="userObject.state" name="partner_state" required>
                            <option v-for="state,index in getStates" :key="index" :value="state.id">{{state.title}}</option>
                        </select>
                    </label>
                </template>
                <template v-else-if="step===2">
                    <label>Create a password
                        <input type="text" v-model="userObject.password" name="password" required/>
                    </label>
                    <label>Confirm password
                        <input type="text" v-model="userObject.confirm_password" name="confirm" required/>
                    </label>
                    <label class="privacy">
                        <input type="checkbox" v-model="privacy"/>
                        By clicking the button, I agree to the Terms of Use and Privacy Policy
                    </label>

                </template>
                

                <button class="myButton" :disabled="!enabled">
                    <span v-if="step===1">Next</span>
                    <span v-else>Create</span>
                </button>
                <p v-for="error,index in error_list" style="margin-top:10px" :key="index">{{error.key}} - {{error.val}}</p>
                <p v-if="error_message" style="margin-top:10px">{{error_message}}</p>
            </form>
        </div>
    </div>
</template>
<script>
import {useStore} from 'vuex'
import {computed} from 'vue'
import {ref} from 'vue'
import {replaceNumberForInput,onlyLetters} from '../../helpers/helpers'


export default {
    data(){
        return {
            states: []
        }
    },
    props: {
        role: {
            type: String,
            required: true
        },
    },
    computed:{
        enabled(){
            if(this.valid()){
                return true
            }
        }
    },
    setup(props) {
        const store = useStore()
        const error_list = ref([])
        const error_message = ref('')
        const step = ref(1)
        const privacy = ref(false) 
        const userObject = ref({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            website: '',
            state: null,
            password: '',
            confirm_password: '',
            related_role: props.role
        })
        return {
            replaceNumberForInput,
            onlyLetters,
            userObject,
            error_message,
            step,
            privacy,
            error_list,
            fetchStates: () => store.dispatch('fetchStates'),
            fetch_myUsers: () => store.dispatch('fetch_myUsers'),
            createPartner: () => store.dispatch('createPartner',userObject),
            getStates: computed(() => store.getters.getStates),
        }
    },
    methods: {
        saveHandler(e){
            this.error_message = ''
            this.error_list = []
            if(this.step === 1){
                if(e.target.checkValidity()){
                    this.step = 2
                }
            } else {
                this.error_message = 'Creating user...'
                this.createPartner().then((answer)=>{
                    if(answer.is_success){
                        this.$emit('close')
                        this.fetch_myUsers()
                    } else {
                        if(answer.message_list){
                            this.error_list = answer.message_list
                        }
                        if(answer.message){
                            this.error_message = answer.message
                        }
                    }
                })
            }
        },
        valid(){
            if(this.step===1){
                return true
            }
            if(this.step===2){
                if(this.privacy && this.userObject.password && this.userObject.password === this.userObject.confirm_password){
                    return true
                }
            }
        },
    },
    mounted(){
        this.fetchStates()
    }
}
</script>
<style scoped>
label {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}
.privacy{
    font-weight: 400;
    font-size: 12px;
    text-align: center;
    color: #989898;
    max-width: 260px;
    display: block;
    user-select: none;
}
input,select {
    background: #F8FAFC;
    border-radius: 4px;
    border: none;
    margin-top: 5px;
    padding: 12px 7px;
    max-width: 100%;
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
    z-index: 22;
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
h2 {
    margin: 0 0 25px;
}
@media (max-width:560px){
    .modal_window{
        width: 100vw;
        height: calc(100% - 20px);
        padding: 10px;
        overflow: auto;
        border-radius: 0;
    }
    .modal_close{
        position: initial;
    }
}
</style>