<template>
  <v-row dense>
    <v-col
      cols="12"
      md="8"
    >
      <v-text-field
        clearable
        density="comfortable"
        hide-details
        label="Search by name or description"
        :model-value="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @update:model-value="search = $event ?? ''"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <v-select
        v-model="status"
        density="comfortable"
        hide-details
        :items="statusOptions"
        label="Status"
        variant="outlined"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { RocketStatusFilter } from '@/types/rocket'

  const search = defineModel<string>('search', { default: '' })
  const status = defineModel<RocketStatusFilter>('status', { default: 'all' })

  const statusOptions: { title: string, value: RocketStatusFilter }[] = [
    { title: 'All', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' },
    { title: 'Reusable', value: 'reusable' },
  ]
</script>
