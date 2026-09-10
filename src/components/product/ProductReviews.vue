<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product, Review } from '@/types'
import { reviewsForProduct, ratingSummary } from '@/data/reviews'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import StarRating from '@/components/ui/StarRating.vue'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/utils/format'
import { validate, RULES } from '@/composables/useValidation'

const props = defineProps<{ product: Product }>()
const auth = useAuthStore()

const reviews = ref<Review[]>(reviewsForProduct(props.product.id))
const summary = computed(() => ratingSummary(props.product.id))

const formOpen = ref(false)
const form = ref({ rating: 5, author: auth.fullName || '', title: '', text: '' })
const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitted = ref(false)

const buckets = computed(() => [
  { stars: 5, count: summary.value.buckets[5] },
  { stars: 4, count: summary.value.buckets[4] },
  { stars: 3, count: summary.value.buckets[3] },
  { stars: 2, count: summary.value.buckets[2] },
  { stars: 1, count: summary.value.buckets[1] },
])

function average() {
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
  return reviews.value.length ? sum / reviews.value.length : props.product.rating
}

function percent(count: number) {
  const total = summary.value.total || 1
  return (count / total) * 100
}

function submitReview() {
  const validation = validate(
    { author: form.value.author, title: form.value.title, text: form.value.text },
    {
      author: [RULES.required('Please enter your name.')],
      title: [RULES.required('Please add a short title.')],
      text: [RULES.required('Please share a few words.'), RULES.minLength(20, 'Please write at least 20 characters.')],
    },
  )
  errors.value = validation.errors
  if (!validation.valid) return

  submitting.value = true
  setTimeout(() => {
    reviews.value.unshift({
      id: Date.now(),
      productId: props.product.id,
      author: form.value.author.trim(),
      rating: form.value.rating,
      title: form.value.title.trim(),
      text: form.value.text.trim(),
      date: new Date().toISOString(),
      verifiedPurchase: auth.isAuthenticated,
    })
    submitting.value = false
    submitted.value = true
    formOpen.value = false
    setTimeout(() => (submitted.value = false), 4000)
  }, 850)
}
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
    <div class="rounded-3xl border border-charcoal/8 bg-white p-7">
      <div class="text-center">
        <p class="font-display text-5xl text-charcoal">{{ average().toFixed(1) }}</p>
        <div class="mt-2 flex justify-center">
          <StarRating :value="average()" />
        </div>
        <p class="mt-2 text-sm text-charcoal/55">
          Based on {{ reviews.length }} review{{ reviews.length === 1 ? '' : 's' }}
        </p>
      </div>
      <div class="mt-6 space-y-2.5">
        <div v-for="b in buckets" :key="b.stars" class="flex items-center gap-3">
          <span class="w-8 text-sm font-medium text-charcoal/70">{{ b.stars }}★</span>
          <div class="h-2 flex-1 overflow-hidden rounded-full bg-charcoal/8">
            <div class="h-full rounded-full bg-gold" :style="{ width: `${percent(b.count)}%` }" />
          </div>
          <span class="w-6 text-right text-sm text-charcoal/45">{{ b.count }}</span>
        </div>
      </div>
    </div>

    <div>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 class="font-display text-xl text-charcoal">Customer reviews</h3>
        <BaseButton v-if="!formOpen" size="sm" variant="outline" @click="formOpen = true">
          Write a review
        </BaseButton>
      </div>

      <Transition name="fold">
        <form
          v-if="formOpen"
          class="mt-5 rounded-3xl border border-charcoal/8 bg-white p-6"
          @submit.prevent="submitReview"
        >
          <p class="text-sm font-semibold text-charcoal">Rate this product</p>
          <div class="mt-2">
            <StarRating v-model:value="form.rating" :readonly="false" :show-value="true" />
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <BaseInput v-model="form.author" label="Your name" :required="true" :error="errors.author" />
            <BaseInput v-model="form.title" label="Review title" placeholder="Sum it up in a few words" :error="errors.title" />
          </div>
          <div class="mt-4">
            <BaseInput v-model="form.text" label="Your review" type="text" placeholder="What did you love? Fit notes? Quality?" :error="errors.text" />
          </div>
          <div class="mt-5 flex items-center gap-3">
            <BaseButton type="submit" :loading="submitting">Submit review</BaseButton>
            <button type="button" class="text-sm text-charcoal/55 transition hover:text-charcoal" @click="formOpen = false">
              Cancel
            </button>
          </div>
        </form>
      </Transition>

      <p v-if="submitted" class="mt-4 flex items-center gap-2 rounded-2xl bg-green-600/10 p-4 text-sm text-green-700">
        <AppIcon name="check-circle" :size="18" />
        Thank you — your review has been published.
      </p>

      <ul class="mt-5 space-y-5">
        <li
          v-for="review in reviews"
          :key="review.id"
          class="rounded-2xl border border-charcoal/8 bg-white p-5"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-beige/60 text-xs font-bold text-charcoal/70">
                {{ review.author.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-semibold text-charcoal">{{ review.author }}</p>
                <div class="flex items-center gap-2 text-xs text-charcoal/45">
                  <StarRating :value="review.rating" :size="'sm'" />
                  <span>{{ formatDate(review.date) }}</span>
                </div>
              </div>
            </div>
            <span
              v-if="review.verifiedPurchase"
              class="flex items-center gap-1 rounded-full bg-green-600/10 px-2.5 py-1 text-[11px] font-medium text-green-700"
            >
              <AppIcon name="shield" :size="12" />
              Verified purchase
            </span>
          </div>
          <p class="mt-3 text-sm font-semibold text-charcoal">{{ review.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-charcoal/60">{{ review.text }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fold-enter-active,
.fold-leave-active {
  transition: all 0.3s ease;
}
.fold-enter-from,
.fold-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>