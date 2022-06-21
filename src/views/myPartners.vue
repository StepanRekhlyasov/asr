<script>
import { defineComponent } from 'vue'

import search from '../components/modules/search.vue';
import earnings from '../components/modules/earnings.vue';
import newUserButtons from '../components/modules/newUserButtons.vue';
import partnerBadge from '../components/partners/partnerBadge.vue';
import { ref } from 'vue';
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute } from 'vue-router';
import _ from 'lodash';

export default defineComponent({
    components: {search,earnings,partnerBadge,newUserButtons},
    setup() {
        const search = ref({
            string: '',
            orderBy: null,
            dateSort: 'desc'
        });
        const store = useStore();
        const loaded = ref(false);
        const errorLoading = ref('');
        const route = useRoute();
        return {
            search,
            route,
            fetch_myPartners : () => store.dispatch('fetch_myUsers'),
            myPartners: computed(() => store.getters.get_usersByRole('partner')),
            mySalesReps: computed(() => store.getters.get_usersByRole('sales_rep')),
            myUsers: computed(() => store.getters.get_myUsers),
            allPartners: computed(() => store.getters.get_allPartners),
            get_usersByRole: computed(() => store.getters.get_usersByRole()),
            loaded,
            errorLoading,
            user: computed(() => store.getters.get_User),
        }
    },
    computed: {
        myPartners_filtered(){
            if(this.route.name == 'My partners'){
                return this.search_filter(this.myPartners)
            }
            if(this.route.name == 'Sales rep'){
                if(this.user.caps.admin_sales_rep){
                    return this.search_filter(this.mySalesReps)
                } else {
                    this.$router.push({name:'My partners'})
                }
            }
            if(this.route.name == 'All partners'){
                if(this.user.data.meta.show_all_partners == "1"){
                    return this.search_filter(this.allPartners)
                } else {
                    this.$router.push({name:'My partners'})
                }
            }
        },
    },
    methods: {
        search_filter(users){
            let searchString = this.search.string.toLowerCase()
            if(!(this.search.active&&this.search.pending)){
                if(this.search.active){
                    users = users.filter((user)=>{
                        return user.data.meta.activate_user=='on'
                    })
                } else if(this.search.pending){
                    users = users.filter((user)=>{
                        return user.data.meta.activate_user!='on'
                    })
                }
            }
                
            users = this.sort_filter(users)
            return users.filter((user)=>{
                let display = user.data.display_name.toLowerCase()
                let first = user.data.meta.first_name.toLowerCase()
                let last = user.data.meta.last_name.toLowerCase()
                if(display.includes(searchString)||first.includes(searchString)||last.includes(searchString)){
                    return user
                }
            })
        },
        sort_filter(users){
            let sorted = _.orderBy(users,[
                function(user) {
                    return new Date(user.data.user_registered);
                }],[this.search.dateSort])
            return sorted
        },
        updateFilter(data){
            this.search = data
        }
    },
    mounted() {
        this.fetch_myPartners().then((data)=>{
            if(data.error){
                this.errorLoading = data.error
            } else {
                this.loaded = true
            }
        });
    },
})
</script>
<template>
    <template v-if="loaded">
    <div style="position:relative;">
        <h1 style="text-transform: capitalize;">{{route.name}}</h1>
        <earnings/>
    </div>
        <search @changedFilter="updateFilter"/>
        <newUserButtons class="show_900"/>
        <partnerBadge v-for="partner,index in myPartners_filtered" :key="index" :id="partner.ID" :ukey="index"/>
    </template>
    <template v-else>
        <div class="preload">
            <p v-if="errorLoading">{{errorLoading}}</p>
            <p v-else>Loading...</p>
        </div>
    </template>
</template>