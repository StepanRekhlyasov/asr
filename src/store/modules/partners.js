export default  {
    state: {
        myUsers: {
            users: {

            },
            all_partners: {

            }
        },
    },
    getters: {
        get_usersByRole : state => (role) => {
            return state.myUsers.users.filter(user => user.roles.includes(role) === true || user.roles.includes('customer') === true)
        },
        get_userByID: state => (id) => {
            let users = state.myUsers.users.find(user => user.ID === id)
            return users?users:state.myUsers.all_partners.find(user => user.ID === id)
        },
        get_myUsers(state){
            return state.myUsers.users
        },
        get_allPartners(state){
            return state.myUsers.all_partners
        },
    },
    actions: {
        async fetch_myUsers(ctx){
            let data = new FormData();
            data.append('action','VueAccount_myUsers');
            data.append('user_id',ctx.getters.get_User.ID);
            
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                    method: 'POST',
                    body: data
                }
            );
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('update_myUsers', answer);
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        // async fetch_allPartners(ctx){
        //     let data = new FormData();
        //     data.append('action','VueAccount_allPartners');
        //     data.append('user_id',ctx.getters.get_User.ID);
            
        //     const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
        //             method: 'POST',
        //             body: data
        //         }
        //     );
        //     return new Promise((resolve, reject) => {
        //         result.json().then((answer) => {
        //             ctx.commit('update_allPartners', answer);
        //             resolve(answer);
        //         }).catch((err) => {
        //             reject(err);
        //         })
        //     });
        // },
        async toggleUser(ctx, user_id){
            let data = new FormData();
            data.append('action','VueAccount_toggleUser');
            data.append('user_id', user_id);
            if(!ctx.getters.get_User.caps.admin_sales_rep){
                return
            }
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                method: 'POST',
                body: data
            });
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.dispatch('getUser', user_id)
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async saveUserData( ctx, saveData ){
            let data = new FormData();
            data.append('action','VueAccount_updateUserValue');
            data.append('user_id', saveData.value.user_id);
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
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async updateRelation ( ctx, relationData ){
            let data = new FormData();
            data.append('action','VueAccount_updateRelation');
            data.append('user_id', relationData.value.user_id);
            data.append('sales_rep', relationData.value.sales_rep);
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                    method: 'POST',
                    body: data
                }
            );
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async getUser(ctx, user_id){
            let data = new FormData();
            data.append('action','VueAccount_getUser');
            data.append('user_id',user_id);
            
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                    method: 'POST',
                    body: data
                }
            );
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('updateUser', answer);
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
    },
    mutations: {
        update_myUsers(state, myUsers){
            state.myUsers = myUsers
        },
        // update_allPartners(state, allPartners){
        //     state.allPartners = allPartners
        // },
        updateUser( state, user ){
            this.getters.get_userByID(user.ID).data = user.data
        }
    }
}