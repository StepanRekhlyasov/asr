<template>
    <aside :class="{toggle:toggle}">
        <ul>
            <li v-for="root in routes_filtered" :key="root" :class="root.name.toLowerCase().replace(' ','_')" @click="$router.push({name:root.name})">
                <router-link :to="root.path" @click="$emit('toggleAside')">{{root.name}}</router-link>
            </li>
        </ul>
        <newUserButtons class="hide_900"/>
    </aside>
</template>
<script>
import newUserButtons from './modules/newUserButtons.vue'
import {computed} from 'vue'
import {useStore} from 'vuex'

export default {
    components: {newUserButtons},
    props: ['toggle'],
    setup(){
        const store = useStore()
        return {
            user: computed(() => store.getters.get_User),
        }
    },
    computed: {
        routes_filtered(){
            var filtered = this.$router.options.routes.slice(1)
            if(!this.user.caps.admin_sales_rep){
                var filtered = this.$router.options.routes.slice(1).filter((route)=>{
                    return route.name !='Sales rep' && route.name !='Coupons'
                })
            }
            if(this.user.data.meta.show_all_partners != "1"){
                filtered = filtered.filter((route)=>{
                    return route.name !='All partners'
                })
            }
            return filtered
        }
    }
}
</script>
<style scoped>
    aside {
        width: 100%;
        max-width: 270px;
        border-right: 1px solid rgba(74, 117, 137, 0.12);
        min-height: 100%;
    }
    @media (max-width:1200px){
        aside {
            /* display: none; */
            position: fixed;
            z-index: 20;
            background: #fff;
            padding: 20px;
            right: 0;
            top: 0;
            width: 0;
            padding: 0;
            opacity: 0;
            transition: .5s;
        }
        aside.toggle {
            /* display: block; */
            width: 100%;
            padding: 20px;
            
            opacity: 1;
        }
    }
    ul {
        list-style: none;
        margin: 35px;
        padding: 0;
    }
    li {
        display: flex;
        align-items: center;
        font-size: 16px;
        margin-bottom: 28px;
        cursor: pointer;
    }
    li:before {
        display: block;
        content: "";
        width: 39px;
        height: 39px;
        float: left;
        margin-right: 20px;
    }
    a {
        color: rgba(74, 117, 137, 0.62);
    }
    .router-link-active{
        color: rgb(74 117 137);
    }
    .my_profile:before {
        background-image: url('~@/assets/my_profile.png');
    }
    .my_partners:before {
        background-image: url('~@/assets/my_partners.png');
    }
    .sales_rep:before {
        background-image: url('~@/assets/sales_reps.png');
    }
    .all_partners:before {
        background-image: url('~@/assets/all_partners.png');
    }
</style>