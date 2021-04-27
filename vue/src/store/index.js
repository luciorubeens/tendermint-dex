import { createStore } from 'vuex'
import init from './config'

const store = createStore({
	state() {
		return {
			refreshCount: 0
		}
	},
	mutations: {
		INCREMENT_REFRESH: (state) => state.refreshCount++
	},
	actions: {
		refresh ({ commit }) {
			commit('INCREMENT_REFRESH')
		}
	}
})
init(store)
export default store
