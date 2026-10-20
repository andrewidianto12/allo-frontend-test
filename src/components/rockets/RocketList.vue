<template>
  <v-row>
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      cols="12"
      lg="3"
      md="4"
      sm="6"
    >
      <RocketCard :rocket="rocket" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{
    rockets: Rocket[]
  }>()
</script>
