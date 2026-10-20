<template>
  <div>
    <v-btn
      class="mb-6"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <RocketDetail
      v-if="rocket"
      :rocket="rocket"
    />

    <LoadingState
      v-else-if="detailLoading"
      message="Loading rocket..."
      variant="detail"
    />

    <ErrorState
      v-else-if="detailError"
      :message="detailError"
      title="Failed to load rocket"
      @retry="retry"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useRocketsStore } from '@/stores/rockets'

  const route = useRoute('/rockets/[id]')
  const store = useRocketsStore()
  const { detailError, detailLoading } = storeToRefs(store)

  const rocketId = computed(() => route.params.id)

  // Reads from the store (list cache, local rockets or detail cache)
  const rocket = computed(() => store.getRocketById(rocketId.value) ?? null)

  function load (force = false) {
    // Only hits the API when the rocket is not already in the store
    store.fetchRocketById(rocketId.value, { force })
  }

  function retry () {
    load(true)
  }

  watch(rocketId, () => load(), { immediate: true })
</script>
