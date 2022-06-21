<template>
    <template v-if="loaded">
        <sr-header @toggleAside="_toggleAside()" :toggled_burger="toggle"/>
        <main class="main__wrapper">
            <sr-aside :toggle="toggle" @toggleAside="_toggleAside()"/>
            <section class="content__wrapper">
                <router-view/>
            </section>
        </main>
    </template>
    <template v-else>
        <main class="main__wrapper preload">
            <p v-if="errorLoading">{{errorLoading}}</p>
            <p v-else>Loading...</p>
        </main>
    </template>
</template>

<script>
import { defineComponent } from 'vue';
import srHeader from './components/srHeader.vue';
import srAside from './components/srAside.vue';
import { useStore } from 'vuex'
import { ref } from 'vue'

export default defineComponent({
    name: 'App',
    components: {
        srHeader,
        srAside
    },
    setup(){
        const store = useStore()
        const loaded = ref(false)
        const errorLoading = ref('')
        const toggle = ref(false)
        return {
            fetch_User : () => store.dispatch('fetch_User'),
            fetchStates : () => store.dispatch('fetchStates'),
            loaded,
            errorLoading,
            toggle
         }
    },
    methods: {
        _toggleAside(){
            this.toggle = !this.toggle
        }
    },
    mounted(){
        this.fetch_User().then((data)=>{
            if(data.ID){
                this.loaded = true
                this.fetchStates()
            } else {
                this.errorLoading = data.error
            }
        })
    }
});
</script>

<style>
    @font-face {
        font-family: 'DM Sans';
        src: local('DM Sans'),
        url('~@/assets/DM_Sans/DMSans-Medium.woff') format('woff'),
        url('~@/assets/DM_Sans/DMSans-Medium.woff2') format('woff2'),
        url('~@/assets/DM_Sans/DMSans-Medium.ttf') format('ttf');
        font-style: normal;
        font-weight: 500;
    }
    @font-face {
        font-family: 'DM Sans';
        src: local('DM Sans'),
        url('~@/assets/DM_Sans/DMSans-Regular.woff') format('woff'),
        url('~@/assets/DM_Sans/DMSans-Regular.woff2') format('woff2'),
        url('~@/assets/DM_Sans/DMSans-Regular.ttf') format('ttf');
        font-style: normal;
        font-weight: 400;
    }
    @font-face {
        font-family: 'DM Sans';
        src: local('DM Sans'),
        url('~@/assets/DM_Sans/DMSans-Bold.woff') format('woff'),
        url('~@/assets/DM_Sans/DMSans-Bold.woff2') format('woff2'),
        url('~@/assets/DM_Sans/DMSans-Bold.ttf') format('ttf');
        font-style: normal;
        font-weight: 700;
    }
    body {
        margin: 0;
        font-family: DM Sans,sans-serif;
        overflow: auto;
    }
    .main__wrapper{
        background: #F5FEFF;
        min-height: 100vh;
        display: flex;
        flex-wrap: nowrap;
    }
    p {
        margin: 0;
    }
    .content__wrapper{
        padding: 35px 75px;
        max-width: 900px;
        width: 100%;
    }
    a {
        text-decoration: none;
        color: #201e1e;
    }
    h1 {
        font-size: 30px;
        font-weight: 700;
        margin: 0 0 50px;
    }
    .preload {
        display:flex;
        align-items:center;
        justify-content:center
    }
    .myButton{
        background: linear-gradient(135deg, #5C8FA7 2.88%, #104B67 100%);
        border-radius: 5px;
        width: 100%;
        text-align: center;
        color: #fff;
        padding: 10px;
        cursor: pointer;
        border: none;
        margin: auto;
        display: block;
    }
    .myButton:hover{
        background: linear-gradient(135deg, #104B67 2.88%, #5C8FA7 100%);
    }
    .myButton:disabled{
        background: linear-gradient(135deg, rgba(92, 143, 167, 0.4) 2.88%, rgba(16, 75, 103, 0.4) 100%);
    }
    .clearButton{
        background: none;
        outline: none;
        color: #4A7589;
        cursor:pointer;
        border: none;
        user-select: none;
    }
    .clearButton:hover{
        text-decoration: underline;
    }
    .clearButton:disabled{
        color: #898989;
    }
    .bold {
        font-weight: 700;
    }
    .golden {
        color: #e29f39;
    }
    .show_1200 {
        display: none!important;
    }
    @media (max-width:1200px){
        .show_1200 {
            display: block!important;
        }
        .hide_1200 {
            display: none!important;
        }
    }
    .show_900 {
        display: none!important;
    }
    @media (max-width:900px){
        .show_900 {
            display: block!important;
        }
        .hide_900 {
            display: none!important;
        }
    }
    @media(max-width:560px){
        .content__wrapper {
            padding: 35px 10px;
        }
    }
</style>
