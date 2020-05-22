import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
});

const store = new Vuex.Store({
  state: {
    instance: {
      contacts: [],
    },
  },
  getters: {
    getInstance: (state) => state.instance,
    getContacts: (state) => state.instance.contacts,
  },
  mutations: {
    setInstanceParam(state, data) {
      state.instance[data.param] = data.value;
    },
  },
  actions: {},
  plugins: [vuexLocal.plugin],
});

export default store;

const initialStateCopy = JSON.parse(JSON.stringify(store.state));

export function resetState() {
  store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)));
}
