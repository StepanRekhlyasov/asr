<template>
    <header id="header">
            <router-link :to="{ name: 'Home'}" class="logo">
                <img alt="dr-weedy logo" src="@/assets/logo.svg"/>
            </router-link>  
            <div class="accountMenu show_1200">
                <div class="hamburger-menu">
                    <input id="menu__toggle" type="checkbox" :checked="toggled_burger" @change="$emit('toggleAside')"/>
                <label class="menu__btn" for="menu__toggle">
                <span></span>
                </label>
                </div>
            </div>
            <div class="accountMenu hide_1200">
                <div class="accountMenu__wrapper" @click="show_menu=!show_menu">
                    <p class="accountMenu__name">{{user.data.display_name}}</p>
                    <p class="accountMenu__title">My Profile</p>
                </div>
                <img class="accountMenu__avatar" :src="user.data.avatar.url" @click="show_menu=!show_menu">
                <div class="accountMenu__context" v-if="show_menu">
                    <router-link :to="{ name: 'My profile'}"><img class="account_widget__profileIcon" src="@/assets/profile.svg">Edit my info</router-link>
                    <div class="accountMenu__logout" @click="show_logout=!show_logout"><img src="@/assets/logout.svg"/>Log out</div>
                </div>
            </div>
                <div class="logout__modal_background" v-if="show_logout" @click="show_logout=false"></div>
                <div id="logout__modal" v-if="show_logout">
                        <span class="logout__modal_close" @click="show_logout=false"></span>
                        <img src="@/assets/logout_attention.svg"/>
                        <span class="logout__modal_q">Are you sure?</span>
                        <div class="logout__dilema">
                            <div class="dilema_no" @click="show_logout=false">No</div>
                            <a class="dilema_yes" href="/exit">Yes</a>
                        </div>
                </div>
        </header>
        
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default defineComponent({
    props: ['toggled_burger'],
    setup() {
        const store = useStore()
        return {
            user: computed(() => store.state.user.user),
         }
    },
    data(){
        return {
            show_menu: false,
            show_logout: false,
        }
    },
})
</script>
<style scoped>
    #header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 10px 50px;
        background: #F5FEFF;
        border-bottom: 1px solid #898989;
    }
    .logo {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-right: 20px;
    }
    .logo>img {
        width: 100%;
    }
    @media (max-width: 500px){
        .logo{
            width: 100px
        }
    }
    @media (max-width: 560px){
        #header{
            padding: 10px
        }
    }
    .accountMenu__context{
        position: absolute;
    }
    .accountMenu__wrapper{
        margin-right: 15px;
        white-space: nowrap;
    }
    .accountMenu__wrapper>p{
        margin: 0;
    }
    .accountMenu__logout {
        color: #b10000;
        display: block;
        text-align: left;
        margin-top: 7px;
    }
    .accountMenu{
        display: flex;
        cursor: pointer;
        position: relative;
        z-index: 1;
        align-items: center;
        z-index: 21;
    }
    .accountMenu__context{
        background: #fff;
        box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
        border-radius: 5px;
        position: absolute;
        top: 60px;
        padding: 15px;
    }
    .accountMenu__context img {
        width: 13px;
        margin-right: 5px;
    }
    .accountMenu__context>a{
        margin-bottom: 5px;
        display: block;
        text-align: left;
        font-weight: 500;
    }
    .accountMenu__avatar{
        width: 52px;
        height: 52px;
        border-radius: 50%;
    }
    .accountMenu__name{
        font-weight: 500;
        font-size: 12px;
        text-align: right;
        color: #BCBCBC;
    }
    .accountMenu__title{
        font-weight: 500;
        font-size: 17px;
        color: #201E1E;
    }
    .logout__modal_close{
        width:44px;
        height: 44px;
        background: #5488A0;
        border-radius: 50%;
        display: block;
        position: absolute;
        top: 13px;
        right: 21px;
        cursor: pointer;
    }
    .logout__modal_close:after{
        content: "";
        display: block;
        width: 16px;
        border: 1px solid #fff;
        transform: rotate(-45deg);
        position: absolute;
        top: 21px;
        right: 13px;
    }
    .logout__modal_close:before{
        content: "";
        display: block;
        width: 16px;
        border: 1px solid #fff;
        transform: rotate(45deg);
        position: absolute;
        top: 21px;
        right: 13px;
    }
    .logout__dilema{
        display: flex;
        justify-content: center;
    }
    .logout__modal_q{
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        line-height: 52px;
        display: block;
        margin: 21px auto 39px;
    }
    .logout__dilema>.dilema_no,
    .logout__dilema>.dilema_yes
    {
        width: 113px;
        margin:0 9px;
        padding:15px;
        font-size: 16px;
        font-weight: 700;
        border-radius: 10px;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
    }
    .dilema_no{
        color: #225B76;
        background-color:#fff;
        border: 1px solid #1C5672;
    }
    .dilema_yes{
        color: #fff;
        background: linear-gradient(135deg, #5C8FA7 2.88%, #104B67 100%);
    }
    .account_logout img{
        margin-right:8px;
    }
    #logout__modal{
        max-width: 90vw;
        padding: 28px 100px 39px;
        background-color: #fff;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08), 0px 4px 4px rgba(0, 0, 0, 0.04);
        border-radius: 9px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items:center;
    }
    .logout__modal_background{
        z-index: 1;
        position: fixed;
        background-color: #000000a1;
        width: 100vw;
        height: 100vh;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .hamburger-menu{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 56px;
        width: 56px;
    }
    

    #menu__toggle {
    opacity: 0;
    }

    #menu__toggle:checked ~ .menu__btn > span {
    transform: rotate(45deg);
    }
    #menu__toggle:checked ~ .menu__btn > span::before {
    top: 0;
    transform: rotate(0);
    }
    #menu__toggle:checked ~ .menu__btn > span::after {
    top: 0;
    transform: rotate(90deg);
    }
    #menu__toggle:checked ~ .menu__box {
    visibility: visible;
    left: 0;
    }

    .menu__btn {
    display: flex;
    align-items: center;
    /* position: fixed; */
    top: 20px;
    left: 20px;

    width: 26px;
    height: 26px;

    cursor: pointer;
    z-index: 1;
    }
    .menu__btn > span,
    .menu__btn > span::before,
    .menu__btn > span::after {
        display: block;
        position: absolute;
        width: 25px;
        height: 2px;
        background-color: #616161;
        transition-duration: .25s;
    }
    .menu__btn > span::before {
        content: '';
        top: -8px;
    }
    .menu__btn > span::after {
        content: '';
        top: 8px;
    }
 
</style>

