import { createStore } from "vuex";
import user from './modules/user'
import getters from './modules/getters'
import partners from './modules/partners'
import posts from './modules/posts'

export default createStore({
  
  modules: {
    user,
    getters,
    partners,
    posts
  },

});
