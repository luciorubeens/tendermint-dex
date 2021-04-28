import { computed } from 'vue'
import { useStore } from 'vuex'

export function useWallet() {
	const store = useStore()
	const address = computed<string>(() => store.getters['common/wallet/address'])
	const isLoggedIn = computed<boolean>(
		() => store.getters['common/wallet/loggedIn']
	)

	return { address, isLoggedIn }
}
