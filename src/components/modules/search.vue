<template>
<div class="wrapper_search">
    <input type="text" v-model="searchData.string" @input="$emit('changedFilter',searchData)" placeholder="Search">
    <label>Registered Date:
        <select v-model="searchData.dateSort"  @change="$emit('changedFilter',searchData)">
            <option value="desc">DESC</option>
            <option value="asc">ASC</option>
        </select>
    </label>
    <label v-if="user.caps.admin_sales_rep">Pending:
        <input type="checkbox" v-model="searchData.pending" @change="$emit('changedFilter',searchData)">
    </label>
    <label v-if="user.caps.admin_sales_rep">Active:
        <input type="checkbox" v-model="searchData.active" @change="$emit('changedFilter',searchData)">
    </label>
</div>
</template>
<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
    setup() {
        const store = useStore()
        return {
            user: computed(()=> store.getters.get_User),
        }
    },
    data(){
        return {
            searchData: {
                string: '',
                orderBy: '',
                dateSort: 'desc',
                pending: false,
                active: false,
            }
        }
    },
    methods: {
        changed(){
            this.$emit('changed')
            // this.$parent.search = this.searchData
        }
    },
}
</script>
<style scoped>
    .wrapper_search {
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
        margin-bottom: 35px;
    }
    label {
        user-select: none;
        cursor: pointer;
    }
</style>
