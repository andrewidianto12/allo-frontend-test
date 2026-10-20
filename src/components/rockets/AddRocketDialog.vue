<template>
  <v-dialog
    v-model="open"
    max-width="600"
    @after-leave="resetForm"
  >
    <v-card title="Add a new rocket">
      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text>
          <v-text-field
            v-model="form.name"
            autofocus
            class="mb-2"
            label="Name *"
            :rules="[rules.required]"
            variant="outlined"
          />
          <v-textarea
            v-model="form.description"
            auto-grow
            class="mb-2"
            label="Description"
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="form.imageUrl"
            class="mb-2"
            label="Image URL"
            placeholder="https://..."
            :rules="[rules.url]"
            variant="outlined"
          />
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.costPerLaunch"
                label="Cost per launch (USD)"
                min="0"
                prefix="$"
                :rules="[rules.nonNegative]"
                type="number"
                variant="outlined"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country"
                label="Country"
                placeholder="USA"
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Cancel"
            variant="text"
            @click="open = false"
          />
          <v-btn
            color="primary"
            text="Add rocket"
            type="submit"
            variant="flat"
          />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { VForm } from 'vuetify/components'
  import type { NewRocketInput } from '@/types/rocket'

  const open = defineModel<boolean>({ default: false })

  const emit = defineEmits<{
    submit: [rocket: NewRocketInput]
  }>()

  const formRef = ref<VForm | null>(null)

  const emptyForm = () => ({
    name: '',
    description: '',
    imageUrl: '',
    costPerLaunch: '' as string | number,
    country: '',
    firstFlight: '',
  })

  const form = reactive(emptyForm())

  const rules = {
    required: (value: string) => !!value?.trim() || 'Name is required',
    url: (value: string) => {
      if (!value?.trim()) return true
      try {
        const { protocol } = new URL(value.trim())
        return protocol === 'http:' || protocol === 'https:' || 'Enter a valid http(s) URL'
      } catch {
        return 'Enter a valid http(s) URL'
      }
    },
    nonNegative: (value: string | number) =>
      value === '' || value == null || Number(value) >= 0 || 'Cost must be 0 or more',
  }

  /** Empty strings become null so the model matches API rockets with missing data */
  const orNull = (value: string) => value.trim() || null

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    const cost = form.costPerLaunch === '' ? null : Number(form.costPerLaunch)
    emit('submit', {
      name: form.name.trim(),
      description: orNull(form.description),
      imageUrl: orNull(form.imageUrl),
      costPerLaunch: cost != null && Number.isFinite(cost) ? cost : null,
      country: orNull(form.country)?.toUpperCase() ?? null,
      firstFlight: orNull(form.firstFlight),
    })
    open.value = false
  }

  function resetForm () {
    Object.assign(form, emptyForm())
    formRef.value?.resetValidation()
  }
</script>
