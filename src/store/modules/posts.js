export default  {
    state: {
    },
    getters: {
    },
    actions: {
        async updatePost(ctx, saveData){
            let data = new FormData();
            data.append('action','VueAccount_updatePost');
            data.append('post_id', saveData.value.post_id);
            if(saveData.value.acf){
                for (var [key, value] of Object.entries(saveData.value.acf)) {
                    data.set('acf['+key+']', value);
                }
            }
            if(saveData.value.wp){
                for (var [key, value] of Object.entries(saveData.value.wp)) {
                    data.set('wp['+key+']', value);
                }
            }
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                method: 'POST',
                body: data
            });
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    // ctx.dispatch('fetch_myUsers')
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async deletePost(ctx,post_id){
            let data = new FormData();
            data.append('form_id', post_id );
            data.append('action', 'VueAccount_delete_post');

            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
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
        },
        async getPartnerForms(ctx,user_id){
            let data = new FormData();
            data.append('action','VueAccount_getPartnerForms');
            data.append('user_id', user_id);
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
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
        },
        async getPartnerPrices(ctx,user_id){
            let data = new FormData();
            data.append('action','VueAccount_getPartnerPrices');
            data.append('user_id', user_id);
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                method: 'POST',
                body: data
            });
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('updatePartnerPrices', { prices: answer, user_id : user_id })
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async save_addPrice(ctx, payload){
            let data = new FormData();
            data.append('action','VueAccount_save_addPrice');
            data.append('form_id', payload.form_id);
            data.append('price_id', payload.price_id.value);
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
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
        },
    },
    mutations: {
        updatePartnerPrices(state,answer){
            this.getters.get_userByID(answer.user_id).prices = answer.prices
        }
    }
}