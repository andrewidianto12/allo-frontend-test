/**
 * stores/rockets.ts
 *
 * Rocket list/detail state. API rockets are cached after the first fetch;
 * user-added rockets live only in client state.
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchRocket, fetchSpaceXRockets } from '@/services/rocketApi'
import type { NewRocketInput, Rocket, RocketStatusFilter } from '@/types/rocket'

const LOCAL_ID_PREFIX = 'local-'

function toErrorMessage (err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong'
}

export const useRocketsStore = defineStore('rockets', () => {
  // State
  const apiRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const detailCache = ref<Record<string, Rocket>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)
  const detailLoading = ref(false)
  const detailError = ref<string | null>(null)
  const searchQuery = ref('')
  const statusFilter = ref<RocketStatusFilter>('all')

  let listRequest: Promise<void> | null = null
  let localCounter = 0

  // Getters
  const rockets = computed(() => [...localRockets.value, ...apiRockets.value])

  const filteredRockets = computed(() => {
    const query = (searchQuery.value ?? '').trim().toLowerCase()
    return rockets.value.filter(rocket => {
      if (query) {
        const haystack = `${rocket.name} ${rocket.description ?? ''}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      switch (statusFilter.value) {
        case 'active': return rocket.active === true
        case 'inactive': return rocket.active === false
        case 'reusable': return rocket.reusable === true
        default: return true
      }
    })
  })

  function getRocketById (id: string): Rocket | undefined {
    return rockets.value.find(rocket => rocket.id === id) ?? detailCache.value[id]
  }

  // Actions
  function fetchRockets (options: { force?: boolean } = {}): Promise<void> {
    if (loaded.value && !options.force) return Promise.resolve()
    if (listRequest) return listRequest

    loading.value = true
    error.value = null
    listRequest = fetchSpaceXRockets()
      .then(result => {
        apiRockets.value = result
        loaded.value = true
      })
      .catch(err => {
        error.value = toErrorMessage(err)
      })
      .finally(() => {
        loading.value = false
        listRequest = null
      })
    return listRequest
  }

  async function fetchRocketById (id: string, options: { force?: boolean } = {}): Promise<Rocket | null> {
    const cached = getRocketById(id)
    if (cached && !options.force) {
      detailError.value = null
      return cached
    }
    if (id.startsWith(LOCAL_ID_PREFIX)) {
      // Local rockets never exist on the server (and are lost on reload)
      detailError.value = cached ? null : 'Rocket not found'
      return cached ?? null
    }

    detailLoading.value = true
    detailError.value = null
    try {
      const rocket = await fetchRocket(id)
      detailCache.value[id] = rocket
      return rocket
    } catch (err) {
      detailError.value = toErrorMessage(err)
      return null
    } finally {
      detailLoading.value = false
    }
  }

  function addRocket (input: NewRocketInput): Rocket {
    localCounter += 1
    const rocket: Rocket = {
      ...input,
      id: `${LOCAL_ID_PREFIX}${Date.now()}-${localCounter}`,
      active: null,
      reusable: null,
      isLocal: true,
    }
    localRockets.value.unshift(rocket)
    return rocket
  }

  function resetFilters () {
    searchQuery.value = ''
    statusFilter.value = 'all'
  }

  return {
    apiRockets,
    localRockets,
    detailCache,
    loading,
    error,
    loaded,
    detailLoading,
    detailError,
    searchQuery,
    statusFilter,
    rockets,
    filteredRockets,
    getRocketById,
    fetchRockets,
    fetchRocketById,
    addRocket,
    resetFilters,
  }
})
