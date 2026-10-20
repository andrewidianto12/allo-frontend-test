<template>
  <v-card
    class="d-flex flex-column"
    height="100%"
    :to="{ name: '/rockets/[id]', params: { id: rocket.id } }"
  >
    <RocketImage
      :alt="rocket.name"
      :src="rocket.imageUrl"
    />

    <v-card-title class="d-flex align-center ga-2">
      <span class="text-truncate">{{ rocket.name }}</span>
      <v-chip
        v-if="rocket.isLocal"
        color="secondary"
        size="small"
      >
        Local
      </v-chip>
    </v-card-title>

    <v-card-text class="rocket-card__description">
      {{ rocket.description ?? 'No description available.' }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{
    rocket: Rocket
  }>()
</script>

<style scoped>
.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 0;
}
</style>
