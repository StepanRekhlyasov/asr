export default  {
    state: {
        user: {
            data: {
                balance: {

                },
                meta: {
                    
                }
            }
        },
        coupons: {

        }
    },
    getters: {
        get_User(state) {
            return state.user
        },
        get_Coupons(state) {
            return state.coupons
        },
        get_CouponByID: state => (id) => {
            return state.coupons.find( item => item.data.id == id)
        },
    },
    actions: {
        async fetch_User(ctx){
            let data = new FormData();
            data.append('action','VueAccount_getSRUser');
            var $_GET = ctx.getters.getParams();
            if($_GET['id']){
                localStorage.setItem('dw_user_id', $_GET['id'])
            }
            if(localStorage.getItem('dw_user_id')){
                var id = localStorage.getItem('dw_user_id', $_GET['id'])
                data.set('user_id',id);
            }
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                    method: 'POST',
                    body: data
                }
            );
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('update_User', answer);
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async createPartner(ctx, userObject){
            let data = new FormData();
            data.append('action','VueAccount_register_user');
            for (var [key, value] of Object.entries(userObject.value)) {
                data.set( key, value);
            }
            data.append('user_id', ctx.state.user.ID);
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
        async fetch_adminCoupons(ctx){
            let data = new FormData();
            data.append('action','VueAccount_fetch_adminCoupons');
            data.append('user_id', ctx.state.user.ID);
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                method: 'POST',
                body: data
            });
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('update_Coupons', answer);
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async updateCoupon(ctx, saveData){
            let data = new FormData();
            data.append('action','VueAccount_updateCoupon');
            for (var [key, value] of Object.entries(saveData.value)) {
                data.set( key, value);
            }
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                method: 'POST',
                body: data
            });
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('update_Coupon', answer);
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async delete_coupon(ctx, coupon_id){
            let data = new FormData();
            data.append('action','VueAccount_deleteCoupon');
            data.append('coupon_id', coupon_id);
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
        async createCoupon(ctx, saveData){
            let data = new FormData();
            data.append( 'action','admin_coupon_register' );
            data.append( 'user_id',ctx.state.user.ID );
            for (var [key, value] of Object.entries(saveData.value)) {
                data.set( key, value);
            }
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                method: 'POST',
                body: data
            });
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('update_Coupon', answer);
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
    },
    mutations: {
        update_User(state, user){
            state.user = user
        },
        update_Coupons(state, coupons){
            state.coupons = coupons
        },
        update_Coupon( state, data ){
            for (let update in data.updateFields){
                this.getters.get_CouponByID(data.id).data[data.updateFields[update]] = data[data.updateFields[update]]
            }
        }
    }
}