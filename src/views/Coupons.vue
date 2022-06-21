<template>
    <template v-if="loaded">
    <div style="position:relative;">
        <h1 style="text-transform: capitalize;">Admin Coupons</h1>
        <search @changedFilter="updateFilter"/>
    </div>
        <couponBadge v-for="coupon, index in coupons_filtered" :key="index" :coupon="coupon" @reload_coupons="fetch_adminCoupons"/>
    </template>
    <template v-else>
        <div class="preload">
            <p v-if="errorLoading">{{errorLoading}}</p>
            <p v-else>Loading...</p>
        </div>
    </template>
</template>
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { ref } from 'vue'
import couponBadge from '../components/parts/couponBadge.vue';
import search from '../components/modules/search.vue';
import _ from 'lodash';

export default {
    components: { couponBadge, search },
    setup() {
        const store = useStore()
        const loaded = ref(false)
        const errorLoading = ref('')
        const search = ref({
            string: '',
            orderBy: null,
            dateSort: 'desc'
        });
        return {
            loaded,
            search,
            errorLoading,
            fetch_adminCoupons : () => store.dispatch('fetch_adminCoupons'),
            user: computed(() => store.getters.get_User),
            coupons: computed(() => store.getters.get_Coupons),
        }
    },
    methods: {
        updateFilter(data){
            this.search = data
        },
        search_filter(coupons){
            let searchString = this.search.string.toLowerCase()
            if(!(this.search.active&&this.search.pending)){
                if(this.search.active){
                    coupons = coupons.filter((coupon)=>{
                        return coupon.data.active =='1'
                    })
                } else if(this.search.pending){
                    coupons = coupons.filter((coupon)=>{
                        return coupon.data.active =='0'
                    })
                }
            } 
            coupons = this.sort_filter(coupons)
            return coupons.filter((coupon)=>{
                let first = coupon.data.code.toLowerCase()
                let last = coupon.data.post_name.toLowerCase()
                if(first.includes(searchString)||last.includes(searchString)){
                    return coupon
                }
            })
        },
        sort_filter(coupons){
            let sorted = _.orderBy(coupons,[
                function(coupon) {
                    return new Date(coupon.data.post_date);
                }],[this.search.dateSort])
            return sorted
        },
    },
    computed: {
        coupons_filtered(){
            return this.search_filter(this.coupons)
        }
    },
    created(){
        if(!this.user.caps.admin_sales_rep){
            this.$router.push({name:'My partners'})
        }
    },
    mounted() {
        this.fetch_adminCoupons().then((data)=>{
            if(data.error){
                this.errorLoading = data.error
            } else {
                this.loaded = true
            }
        });
    }
}
</script>