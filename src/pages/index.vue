<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <h1 class="text-h4">
        SpaceX Rockets
      </h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="dialogOpen = true"
      >
        Add rocket
      </v-btn>
    </div>

    <RocketFilter
      v-model:search="searchQuery"
      v-model:status="statusFilter"
      class="mb-6"
    />

    <ErrorState
      v-if="error"
      :message="error"
      title="Failed to load rockets"
      @retry="retry"
    />

    <LoadingState
      v-if="loading && !loaded"
      message="Loading rockets..."
      variant="cards"
    />

    <template v-else-if="hasRockets">
      <RocketList
        v-if="filteredRockets.length"
        :rockets="filteredRockets"
      />
      <v-alert
        v-else
        type="info"
        variant="tonal"
      >
        No rockets match your filter.
        <template #append>
          <v-btn
            variant="text"
            @click="store.resetFilters()"
          >
            Reset filters
          </v-btn>
        </template>
      </v-alert>
    </template>

    <AddRocketDialog
      v-model="dialogOpen"
      @submit="onAddRocket"
    />

    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="3000"
    >
      Rocket added
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRocketsStore } from '@/stores/rockets'
  import type { NewRocketInput } from '@/types/rocket'

  const store = useRocketsStore()
  const { error, filteredRockets, loaded, loading, rockets, searchQuery, statusFilter } = storeToRefs(store)

  const dialogOpen = ref(false)
  const snackbar = ref(false)

  // Local rockets are still shown when the API request fails
  const hasRockets = computed(() => rockets.value.length > 0)

  // Cached in the store: navigating back from detail does not refetch
  onMounted(() => {
    store.fetchRockets()
  })

  function retry () {
    store.fetchRockets({ force: true })
  }

  function onAddRocket (input: NewRocketInput) {
    store.addRocket(input)
    snackbar.value = true
  }
</script>
