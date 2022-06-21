export default {
    state: {
        host() {
            if(window.location.hostname=='localhost' || window.location.hostname=='dr-weedy.testing4u.ru'){
                return 'https://dr-weedy.testing4u.ru'
            }else{
                return 'https://dr-weedy.com'
            }
        },
        params() {
            let $_GET = {},
            args = location.search.substr(1).split(/&/);
            for (let i=0; i<args.length; ++i) {
                let tmp = args[i].split(/=/);
                if (tmp[0] != "") {
                    $_GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
                }
            }
            return $_GET
        },
        states: {},
    },
    actions: {
        async fetchStates(ctx){
            var data = new FormData();
            data.append('action','get_current_states_list_ajax');
            const result = await fetch(
                this.getters.getHost()+'/ajax.php', {
                    method: 'POST',
                    body: data
                }
            );
            return new Promise((resolve, reject) => {
                result.json().then((answer) => {
                    ctx.commit('updStates', answer);
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        },
        async reload_coupon_generated_code(ctx){
            let data = new FormData();
            data.append('action','reload_coupon_generated_code');
            const result = await fetch( ctx.getters.getHost()+'/ajax.php', {
                method: 'POST',
                body: data
            });
            return new Promise((resolve, reject) => {
                result.text().then((answer) => {
                    resolve(answer);
                }).catch((err) => {
                    reject(err);
                })
            });
        }
    },
    getters: {
        getHost(state){
            return state.host
        },
        getParams(state){
            return state.params
        },
        getStates(state){
            return state.states
        },
        get_stateByID: state => (id) => {
            for (let key in state.states) {
                if(state.states[key].id == id){
                    return state.states[key]
                }
            }
        },
    },
    mutations: {
        updStates(state,states){
            state.states = states
        }
    }
}